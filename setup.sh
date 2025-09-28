#!/bin/bash

# AI Code Generator Setup Script
echo "🤖 Setting up AI Code Generator..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup environment file
if [ ! -f "backend/.env" ]; then
    echo "🔧 Setting up environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your ANTHROPIC_API_KEY"
    echo "   You can get your API key from: https://console.anthropic.com/"
else
    echo "✅ Environment file already exists"
fi

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your ANTHROPIC_API_KEY"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment, see the README.md file."