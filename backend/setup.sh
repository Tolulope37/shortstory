#!/bin/bash

# Shortlet Backend Setup Script
# This script helps you quickly set up the production-ready backend

set -e

echo "🚀 Shortlet Backend Setup"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 16${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version) found"

# Check if PostgreSQL is accessible (optional for Docker users)
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL found"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL not found - you'll need Docker or remote database"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    if [ -f .env.template ]; then
        cp .env.template .env
        echo -e "${GREEN}✓${NC} .env file created"
        echo -e "${YELLOW}⚠${NC} Please edit .env file with your database credentials"
    else
        echo -e "${YELLOW}⚠${NC} .env.template not found, skipping..."
    fi
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

echo ""
echo "🎯 Setup Options:"
echo "1. Use Docker (PostgreSQL + Backend)"
echo "2. Use local PostgreSQL"
echo "3. Skip database setup (manual setup later)"
echo ""
read -p "Choose an option (1-3): " option

case $option in
    1)
        echo ""
        echo "🐳 Starting Docker services..."
        if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
            docker-compose up -d
            echo -e "${GREEN}✓${NC} Docker services started"
            echo ""
            echo "⏳ Waiting for database to be ready..."
            sleep 5
            
            echo "📊 Running migrations..."
            npm run db:migrate
            
            echo "🌱 Seeding database..."
            npm run db:seed
            
            echo ""
            echo -e "${GREEN}✅ Setup complete!${NC}"
            echo ""
            echo "Your API is running at: http://localhost:5000"
            echo "Health check: http://localhost:5000/api/health"
            echo ""
            echo "Default login:"
            echo "  Username: admin"
            echo "  Password: password123"
            echo ""
            echo "View logs: docker-compose logs -f"
            echo "Stop services: docker-compose down"
        else
            echo -e "${RED}❌ Docker/docker-compose not found${NC}"
            exit 1
        fi
        ;;
    2)
        echo ""
        read -p "Database host (default: localhost): " db_host
        db_host=${db_host:-localhost}
        
        read -p "Database name (default: shortlet_db): " db_name
        db_name=${db_name:-shortlet_db}
        
        read -p "Database user (default: shortlet): " db_user
        db_user=${db_user:-shortlet}
        
        read -sp "Database password: " db_password
        echo ""
        
        # Update .env file
        if [ -f .env ]; then
            sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${db_user}:${db_password}@${db_host}:5432/${db_name}|" .env
            rm .env.bak 2>/dev/null || true
            echo -e "${GREEN}✓${NC} Updated .env with database credentials"
        fi
        
        echo ""
        echo "📊 Running migrations..."
        npm run db:migrate
        
        echo "🌱 Seeding database..."
        npm run db:seed
        
        echo ""
        echo -e "${GREEN}✅ Setup complete!${NC}"
        echo ""
        echo "Start the server with: npm start"
        echo "Or with hot reload: npm run server"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}⚠${NC} Skipping database setup"
        echo ""
        echo "Manual setup instructions:"
        echo "1. Edit .env file with your database credentials"
        echo "2. Run: npm run db:migrate"
        echo "3. Run: npm run db:seed"
        echo "4. Run: npm start"
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "📚 Documentation:"
echo "  - PRODUCTION_SETUP.md - Full deployment guide"
echo "  - IMPLEMENTATION_SUMMARY.md - What was implemented"
echo ""
echo "Happy coding! 🎉"

