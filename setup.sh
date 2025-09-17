#!/bin/bash

# TaskFlow Pro Setup Script
echo "🚀 Setting up TaskFlow Pro..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install

cd ..

echo "🗄️ Setting up database..."

# Copy environment files
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

echo "📝 Please update the following files with your database credentials:"
echo "   - backend/.env (DATABASE_URL)"
echo "   - frontend/.env (VITE_API_URL if different from default)"

echo ""
echo "🔧 To complete the setup:"
echo "1. Update backend/.env with your PostgreSQL connection string"
echo "2. Run 'pnpm db:migrate' to set up the database"
echo "3. Run 'pnpm db:seed' to populate with sample data"
echo "4. Run 'pnpm dev' to start both frontend and backend"
echo ""
echo "🎉 Setup complete! Happy coding!"
