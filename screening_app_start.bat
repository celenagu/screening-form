@echo off
:: Script to start the application using PM2 and set itself to run on startup

:: Change directory to where PM2 is installed
cd /d C:\Users\%USERNAME%\AppData\Roaming\npm

:: Start the application using PM2
pm2 start C:\Users\%USERNAME%\Desktop\UHN\ScreeningApp\api\index.js --name "screening-app-server"

:: Save PM2 process list
pm2 save

:: Start Metro bundler and ensure it runs indefinitely, redirect output to metro.log
:start
npm start >> C:\Users\celen\Desktop\metro.log 2>&1
echo Metro bundler stopped. Restarting in 5 seconds...
timeout /t 5
goto start

copy "screening_app_start.bat" "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp" /Y

:: Notify user
echo Application started and set to run on startup. Check Task Scheduler for details.

pause