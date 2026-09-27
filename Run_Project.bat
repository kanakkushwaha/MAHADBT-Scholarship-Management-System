@echo off
title MAHADBT Scholarship Portal
echo =========================================================
echo   Starting MAHADBT Portal (Frontend + Backend + MySQL)
echo =========================================================
echo.
cd /d "%~dp0backend"
start /b node server.js
timeout /t 2 /nobreak >nul
start http://localhost:5000
echo.
echo Application is running live on http://localhost:5000!
echo Keep this window open while using the application.
echo Press Ctrl+C or close this window to stop.
echo.
pause
