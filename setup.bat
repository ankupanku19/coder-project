@echo off
echo 🤖 Setting up AI Code Generator...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node -v

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Setup environment file
if not exist "backend\.env" (
    echo 🔧 Setting up environment file...
    copy "backend\.env.example" "backend\.env"
    echo ⚠️  Please edit backend\.env and add your ANTHROPIC_API_KEY
    echo    You can get your API key from: https://console.anthropic.com/
) else (
    echo ✅ Environment file already exists
)

REM Build frontend
echo 🏗️  Building frontend...
cd frontend
call npm run build
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env and add your ANTHROPIC_API_KEY
echo 2. Run 'npm run dev' to start the development servers
echo 3. Open http://localhost:3000 in your browser
echo.
echo For production deployment, see the README.md file.
pause