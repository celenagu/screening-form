
@echo off
:: Navigate to the project directory
cd /d C:\Users\celen\Desktop\UHN\ScreeningApp

:start
:: Start Metro bundler and redirect output to metro.log
npm start >> C:\Users\celen\Desktop\metro.log 2>&1

:: Notify user
echo Metro bundler stopped. Restarting in 5 seconds...
timeout /t 5
goto start