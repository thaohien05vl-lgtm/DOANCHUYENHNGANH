@echo off
chcp 65001 >nul
title Finora Frontend (Vite)
cd /d "%~dp0frontend"
npm run dev

