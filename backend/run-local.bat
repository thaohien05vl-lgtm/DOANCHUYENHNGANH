@echo off
cd /d "%~dp0"
echo Finora Backend - Spring Boot
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-local.ps1"
pause
