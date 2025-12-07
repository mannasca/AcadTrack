# AcadTrack Deployment Script (Windows PowerShell)
# This script helps deploy AcadTrack to Render and Netlify

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AcadTrack Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

function Print-Status {
    param([string]$message)
    Write-Host "✓ $message" -ForegroundColor Green
}

function Print-Error {
    param([string]$message)
    Write-Host "✗ $message" -ForegroundColor Red
}

function Print-Info {
    param([string]$message)
    Write-Host "ℹ $message" -ForegroundColor Blue
}

function Print-Warning {
    param([string]$message)
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Print-Status "Node.js installed: $nodeVersion"
} else {
    Print-Error "Node.js not found. Please install Node.js first."
    exit 1
}

$gitVersion = git --version 2>$null
if ($gitVersion) {
    Print-Status "Git installed: $gitVersion"
} else {
    Print-Error "Git not found. Please install Git first."
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building backend..." -ForegroundColor Yellow
Write-Host ""

Set-Location backend
Print-Info "Installing backend dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Print-Error "Backend npm install failed"
    exit 1
}

Print-Status "Backend dependencies installed"

Write-Host ""
Write-Host "Step 3: Building frontend..." -ForegroundColor Yellow
Write-Host ""

Set-Location ../frontend
Print-Info "Installing frontend dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Print-Error "Frontend npm install failed"
    exit 1
}

Print-Status "Frontend dependencies installed"

Print-Info "Running frontend build..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Print-Error "Frontend build failed"
    exit 1
}

Print-Status "Frontend build successful"

Write-Host ""
Write-Host "Step 4: Deployment Instructions" -ForegroundColor Yellow
Write-Host ""

Print-Info "Backend (Render) deployment:"
Write-Host "  1. Go to https://render.com"
Write-Host "  2. Create new Web Service"
Write-Host "  3. Connect GitHub repository"
Write-Host "  4. Set Base: backend"
Write-Host "  5. Build command: npm install"
Write-Host "  6. Start command: npm start"
Write-Host "  7. Add environment variables (see DEPLOYMENT_GUIDE.md)"
Write-Host ""

Print-Info "Frontend (Netlify) deployment:"
Write-Host "  1. Go to https://app.netlify.com"
Write-Host "  2. Import new site from Git"
Write-Host "  3. Select GitHub repository"
Write-Host "  4. Set Base: frontend"
Write-Host "  5. Build command: npm run build"
Write-Host "  6. Publish directory: frontend/dist"
Write-Host "  7. Add VITE_API_URL environment variable"
Write-Host ""

Print-Status "Ready for deployment!"
Print-Info "See DEPLOYMENT_GUIDE.md for detailed instructions"

Set-Location ..
