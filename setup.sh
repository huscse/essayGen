#!/bin/bash

echo "🚀 EssayGen + Paraphrase Setup"
echo "=============================="
echo ""

# Check if .env files exist
if [ ! -f server/.env ]; then
    echo "⚠️  Creating server/.env from .env.example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env - Please add your ANTHROPIC_API_KEY"
    echo ""
fi

if [ ! -f client/.env ]; then
    echo "⚠️  Creating client/.env from .env.example..."
    cp client/.env.example client/.env
    echo "✅ Created client/.env"
    echo ""
fi

# Install dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your ANTHROPIC_API_KEY"
echo "2. Run the following commands in separate terminals:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd server && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd client && npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
