#!/bin/bash

# TID Faction Checker - Simple Installer
# Run with: bash install.sh

echo "🚀 TID Alliance Faction Checker Installer"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Create config.json if it doesn't exist
if [ ! -f "config.json" ]; then
    echo "📝 Creating config.json..."
    cat > config.json << 'EOF'
{
  "alliedFactions": [
    "51447",
    "48251",
    "53128",
    "52835",
    "53032",
    "51855",
    "43545",
    "35090",
    "51536",
    "50274",
    "52701",
    "54843",
    "18560",
    "53857",
    "54366",
    "54120",
    "52484",
    "49473"
  ],
  "tornApiKey": "YOUR_TORN_API_KEY_HERE",
  "webhookUrl": "YOUR_WEBHOOK_URL_HERE",
  "port": 3000,
  "checkInterval": 5000
}
EOF
    echo "✅ config.json created"
else
    echo "✅ config.json already exists"
fi

echo ""
echo "⚙️  Next steps:"
echo ""
echo "1. Edit config.json and add your settings:"
echo "   - Go to https://www.torn.com/api.php for your API key"
echo "   - Go to Discord webhook settings for your webhook URL"
echo ""
echo "2. Start the server:"
echo "   npm start"
echo ""
echo "3. Test the server:"
echo "   curl http://localhost:3000"
echo ""
echo "4. Check a faction:"
echo "   curl -X POST http://localhost:3000/check \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"factionId\": \"51447\"}'"
echo ""
echo "📖 For mobile setup, see MOBILE_SETUP.md"
echo ""
