@echo off
:: Navigate to the project directory
cd /d C:\Users\celen\Desktop\UHN\ScreeningApp

:start
:: Start Metro bundler output to console
npm start

:: Notify user
echo Metro bundler stopped. Restarting in 5 seconds...
timeout /t 5
goto start