const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('http://82.208.22.226:8000/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'nrenterprisesy@gmail.com');
    await page.type('input[type="password"]', 'Noumaan@Raihaan5');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Go to MailServer config
    await page.goto('http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n/service/a39170v6pcu46nlfd9a60xt6/configuration', { waitUntil: 'networkidle0' });
    
    // Look for Deployable Compose or Edit Compose Button
    const buttons = await page.$$('button');
    for (const b of buttons) {
        const text = await b.evaluate(el => el.textContent);
        if (text && text.includes('Edit Compose File')) {
            await b.click();
            await new Promise(r => setTimeout(r, 2000));
            break;
        }
    }
    
    // Check if normal textarea option is available
    const labels = await page.$$('label');
    for (const l of labels) {
         const text = await l.evaluate(el => el.textContent);
         if (text && text.includes('Show Normal Textarea')) {
             await l.click();
             await new Promise(r => setTimeout(r, 1000));
         }
    }
    
    // Read textarea content
    const textareas = await page.$$('textarea');
    let composeContent = '';
    for (const t of textareas) {
         const val = await t.evaluate(el => el.value);
         if (val && val.includes('services:')) {
             composeContent = val;
             break;
         }
    }
    fs.writeFileSync('mailserver_compose.yml', composeContent);
    await browser.close();
    console.log("Done");
  } catch (error) {
    console.error(error);
  }
})();
