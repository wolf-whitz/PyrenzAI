REM This script is used to start up the entire application using the appropriate commands rather than using npm run dev which isnt suitable for production. 
REM It is designed to be run in a Windows environment and will execute the necessary commands to install dependencies, format the code, build the application, and start the production server.

REM Usage: Run this script in the command prompt to start the application.

REM Note: Ensure that you have Node.js and npm installed on your system before running this script.

@echo off
setlocal EnableDelayedExpansion

echo Installing dependencies...
call npm install || goto error

echo Running format...
call npm run format || goto error

echo Running format:check...
call npm run format:check || goto error

echo Building the app...
call npm run build || goto error

echo Starting production server...
call npm run prod || goto error

goto :eof

:error
echo.
echo [ERROR] Something went wrong during execution. Check the steps above.
exit /b 1
