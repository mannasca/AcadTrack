#!/bin/bash

# AcadTrack Deployment Script
# This script helps deploy AcadTrack to Render and Netlify

echo "================================"
echo "AcadTrack Deployment Script"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
echo ""

if command -v node &> /dev/null; then
    print_status "Node.js installed: $(node -v)"
else
    print_error "Node.js not found. Please install Node.js first."
    exit 1
fi

if command -v git &> /dev/null; then
    print_status "Git installed: $(git --version)"
else
    print_error "Git not found. Please install Git first."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Building backend...${NC}"
echo ""

cd backend
print_info "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Backend npm install failed"
    exit 1
fi

print_status "Backend build successful"

echo ""
echo -e "${YELLOW}Step 3: Building frontend...${NC}"
echo ""

cd ../frontend
print_info "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Frontend npm install failed"
    exit 1
fi

print_info "Running frontend build..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

print_status "Frontend build successful"

echo ""
echo -e "${YELLOW}Step 4: Deployment Instructions${NC}"
echo ""

print_info "Backend (Render) deployment:"
echo "  1. Go to https://render.com"
echo "  2. Create new Web Service"
echo "  3. Connect GitHub repository"
echo "  4. Set Base: backend"
echo "  5. Build command: npm install"
echo "  6. Start command: npm start"
echo "  7. Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""

print_info "Frontend (Netlify) deployment:"
echo "  1. Go to https://app.netlify.com"
echo "  2. Import new site from Git"
echo "  3. Select GitHub repository"
echo "  4. Set Base: frontend"
echo "  5. Build command: npm run build"
echo "  6. Publish directory: frontend/dist"
echo "  7. Add VITE_API_URL environment variable"
echo ""

print_status "Ready for deployment!"
print_info "See DEPLOYMENT_GUIDE.md for detailed instructions"

cd ..
