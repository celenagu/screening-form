@echo off
setlocal 

:: Define paths and configs using %USERNAME%
set PROJECT_DIR=C:\Users\%USERNAME%\Desktop\UHN\ScreeningApp
set MONGODB_BIN=C:\Program Files\MongoDB\Server\7.0\bin
set MONGODB_TOOLS_BIN=C:\Program Files\mongodb-database-tools-windows-x86_64-100.9.5\bin
set MONGOSH_BIN=C:\Program Files\mongosh-2.2.12-win32-x64\bin
set MONGODB_DATA_DIR=C:\data\db
set ENV_FILE=%PROJECT_DIR%\.env
set LOCAL_DB_NAME=ScreeningApp
set DUMP_FILE=%PROJECT_DIR%\dump

:: Add MongoDB binaries to PATH temporarily
set "PATH=%MONGODB_BIN%;%MONGODB_TOOLS_BIN%;%MONGOSH_BIN%;%PATH%"

:: Get the IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
)

:: Remove leading spaces
set IP=%IP:~1%

:: Configure environment variables...
if not exist %ENV_FILE% (
	echo Creating .env file...
	echo PASSCODE=6261 > %ENV_FILE%
	echo URL=http://%IP%:3000 >> %ENV_FILE%
) else (
    echo Updating .env file...
    echo PASSCODE=6261 > %ENV_FILE%
    echo URL=http://%IP%:3000 >> %ENV_FILE%
)

:: Set up MongoDB
echo Setting up MongoDB...
if not exist "%MONGODB_BIN%" (
    echo MongoDB not found. Please install MongoDB
) else (
    if not exist "%MONGODB_DATA_DIR%" (
        echo Creating MongoDB data directory...
        mkdir "%MONGODB_DATA_DIR%"
    )

    echo Starting MongoDB...
    start "" mongod --dbpath "%MONGODB_DATA_DIR%"
)



:: Check if dump file exists
if not exist %DUMP_FILE% (
    echo Dump file not found. Please make sure the dump file is in the specified location.
    exit /b 1
)

:: Drop the existing local database if it exists
echo Dropping existing local database %LOCAL_DB_NAME% if it exists...
mongosh "mongodb://localhost:27017/ScreeningApp" --eval "db.getSiblingDB('%LOCAL_DB_NAME%').dropDatabase()"

:: Import the data into the local MongoDB
echo Importing data into local database %LOCAL_DB_NAME%...
mongorestore --nsInclude="%LOCAL_DB_NAME%.*" "%DUMP_FILE%"

echo MongoDB migration local MongoDB is complete!


:: Notify user
echo Setup complete. Press any key to exit...
pause
	