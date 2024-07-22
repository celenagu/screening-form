@echo off
setlocal enabledelayedexpansion

:: Define paths and configs using %USERNAME%
set PROJECT_DIR=C:\Users\%USERNAME%\Desktop\UHN\ScreeningApp

:: Install Node.js packages
echo Installing Node.js packages...
cd /d %PROJECT_DIR%
npm install