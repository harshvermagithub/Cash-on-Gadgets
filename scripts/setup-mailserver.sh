#!/bin/bash
# ================================================================
# Fonzkart Mail Server Setup Script
# Run this on the VPS (89.116.27.217) before starting docker-mailserver
# ================================================================

set -e

echo "🔧 Setting up Fonzkart Mail Server..."

# 1. Create required directories
echo "📁 Creating data directories..."
mkdir -p /data/mailserver/mail-data
mkdir -p /data/mailserver/mail-state
mkdir -p /data/mailserver/mail-logs
mkdir -p /data/mailserver/config

# 2. Set proper permissions
chmod -R 755 /data/mailserver

# 3. Create a default email account (if none exists)
ACCOUNTS_FILE="/data/mailserver/config/postfix-accounts.cf"
if [ ! -f "$ACCOUNTS_FILE" ] || [ ! -s "$ACCOUNTS_FILE" ]; then
    echo "📧 No email accounts found. Creating default account..."
    # Generate a password hash for the default account
    # Using doveadm if available, otherwise use a pre-hashed placeholder
    DEFAULT_EMAIL="noreply@fonzkart.in"
    DEFAULT_PASS="FonzKart@2024!"
    
    # Create the account using docker-mailserver's format
    # The format is: email|{SCHEME}hash
    # We'll let the container create it properly via setup command
    echo "📧 Default account will be created after container starts."
    echo "   Email: $DEFAULT_EMAIL"
    echo ""
    touch "$ACCOUNTS_FILE"
else
    echo "✅ Email accounts file already exists."
fi

# 4. Create postfix-virtual.cf for domain aliases (if needed)
VIRTUAL_FILE="/data/mailserver/config/postfix-virtual.cf"
if [ ! -f "$VIRTUAL_FILE" ]; then
    touch "$VIRTUAL_FILE"
    echo "📄 Created empty postfix-virtual.cf"
fi

echo ""
echo "✅ Directory setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the mailserver container:"
echo "      docker compose -f docker-compose.mail.yml up -d"
echo ""
echo "   2. Create email accounts (after container is running):"
echo "      docker exec mailserver setup email add noreply@fonzkart.in 'YourPassword'"
echo "      docker exec mailserver setup email add admin@fonzkart.in 'YourPassword'"
echo ""
echo "   3. Verify the container is running:"
echo "      docker ps -f name=mailserver"
echo "      docker logs mailserver --tail 50"
echo ""
echo "   4. Test SMTP connection:"
echo "      telnet localhost 25"
echo ""
