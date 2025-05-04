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
