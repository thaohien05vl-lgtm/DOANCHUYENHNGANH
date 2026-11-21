
@echo off
setlocal

title Finora Fullstack Launcher

set "ROOT=%~dp0"

echo.
echo ============================================
echo        FINORA FULLSTACK STARTUP
echo ============================================
echo.

REM Check backend launcher
if not exist "%ROOT%backend\run-local.bat" (
    echo [ERROR] backend\run-local.bat was not found.
    echo Please check your backend folder.
    pause
    exit /b 1
)

REM Check frontend package
if not exist "%ROOT%frontend\package.json" (
    echo [ERROR] frontend\package.json was not found.
    echo Please check your frontend folder.
    pause
    exit /b 1
)

REM Check Java
where java >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java was not found in PATH.
    echo Please install Java or configure JAVA_HOME.
    pause
    exit /b 1
)

REM Check Node.js and npm
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found in PATH.
    echo Please install Node.js.
    pause
    exit /b 1
)

echo [1/2] Starting Backend...
start "Finora Backend - Port 8080" /D "%ROOT%backend" cmd /k "call run-local.bat"

echo [2/2] Starting Frontend...
start "Finora Frontend - Port 5173" /D "%ROOT%frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo         FINORA IS STARTING
echo ============================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Check the two new terminal windows.
echo Wait until both services are ready.
echo.
echo You can close this launcher window.
echo ============================================

endlocal
