const { Client } = require('ssh2');

const script = `
cat << 'EOF' > /root/sync_mail_certs.sh
#!/bin/bash
docker run --rm -v /data/coolify/proxy/acme.json:/acme.json:ro -v msh60luyag5s0dmbde7rnp3u_mail-config:/dest node:20-alpine node -e "
const fs = require('fs');
try {
  const acme = JSON.parse(fs.readFileSync('/acme.json', 'utf8'));
  const certs = acme.letsencrypt?.Certificates || acme.default?.Certificates || [];
  const mailCert = certs.find(c => c.domain.main === 'mail.fonzkart.in');
  if (mailCert) {
    if (!fs.existsSync('/dest/ssl')) fs.mkdirSync('/dest/ssl');
    const existingCert = fs.existsSync('/dest/ssl/cert.pem') ? fs.readFileSync('/dest/ssl/cert.pem', 'utf8') : '';
    const newCert = Buffer.from(mailCert.certificate, 'base64').toString('utf8');
    fs.writeFileSync('/dest/ssl/cert.pem', newCert);
    fs.writeFileSync('/dest/ssl/key.pem', Buffer.from(mailCert.key, 'base64'));
    if (existingCert !== newCert) {
        console.log('CHANGED');
    } else {
        console.log('UNCHANGED');
    }
  }
} catch(e) { console.error(e); }
" > /tmp/cert_sync_result

if grep -q "CHANGED" /tmp/cert_sync_result; then
  docker restart mailserver-msh60luyag5s0dmbde7rnp3u || true
fi
EOF

chmod +x /root/sync_mail_certs.sh
/root/sync_mail_certs.sh

if ! crontab -l 2>/dev/null | grep -q 'sync_mail_certs.sh'; then
  (crontab -l 2>/dev/null | grep -v 'sync_mail_certs.js'; echo "0 2 * * * /root/sync_mail_certs.sh") | crontab -
  echo "Cron job updated."
fi
`;

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '82.208.22.226',
  port: 22,
  username: 'root',
  password: 'noumaanr5'
});
