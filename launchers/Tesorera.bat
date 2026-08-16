@echo off
REM Tesorera - doble clic para abrir (Windows). Este es el launcher principal.
title Tesorera
cd /d "%~dp0.."

echo Abriendo Tesorera...

REM Si hay internet, se actualiza sola. Si no, sigue igual.
git pull --ff-only --quiet >nul 2>&1

if not exist "node_modules" (
  echo Instalando lo que hace falta ^(solo esta vez^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo No pude instalar lo que hace falta. Avisale a Moises.
    pause
    exit /b 1
  )
)

REM npm start compila si hace falta, respalda la base y abre la ventana.
call npm start

if errorlevel 1 (
  echo.
  echo Tesorera no pudo abrir. Avisale a Moises.
  pause
)
