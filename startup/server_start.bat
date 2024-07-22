@echo off
:: Script to start the application using PM2 and set itself to run on startup


:: Change directory to where PM2 is installed
cd /d C:\Users\%USERNAME%\AppData\Roaming\npm

:: Start the application using PM2
pm2 start C:\Users\%USERNAME%\Desktop\UHN\ScreeningApp\api\index.js --name "screening-app-server"

:: Save PM2 process list
pm2 save


pause