#!/bin/bash

echo "🚀 AI Builder - Quick Start Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the ai-builder-project directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check for .env files
echo "🔍 Checking environment files..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your API keys"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env not found. Creating from example..."
    cp frontend/.env.example frontend/.env
    echo "📝 Please edit frontend/.env with your configuration"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your API keys (Supabase, OpenAI, etc.)"
echo "2. Edit frontend/.env with your configuration"
echo "3. Set up your Supabase database (see SETUP.md)"
echo "4. Run 'npm run dev' in backend directory"
echo "5. Run 'npm run dev' in frontend directory (in another terminal)"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo ""
echo "🎉 Happy building!"
