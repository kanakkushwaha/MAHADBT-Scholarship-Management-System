@echo off
title MAHADBT - Full System Starter
echo ========================================================
echo   Starting MAHADBT System (Frontend + Backend + MySQL)
echo ========================================================
echo.
echo Starting Backend Server on port 5000...
start "MAHADBT Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul

echo Starting Frontend on Vite dev server...
start "MAHADBT Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo ========================================================
echo   Both servers launched!
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo   MySQL Database: mahadbt_db (View in MySQL Workbench)
echo ========================================================
pause
