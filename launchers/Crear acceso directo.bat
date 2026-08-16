@echo off
REM Se corre UNA sola vez, al instalar Tesorera en la laptop.
REM Deja en el Escritorio un icono llamado "Tesorera" con el icono propio
REM de la app (el libro de caja), no el de Chrome ni el de un archivo .bat.

setlocal
set "RAIZ=%~dp0.."
set "DESTINO=%~dp0Tesorera.vbs"
set "ICONO=%RAIZ%\marca\tesorera.ico"

echo Creando el acceso directo "Tesorera" en el Escritorio...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$w = New-Object -ComObject WScript.Shell;" ^
  "$d = $w.SpecialFolders('Desktop');" ^
  "$s = $w.CreateShortcut((Join-Path $d 'Tesorera.lnk'));" ^
  "$s.TargetPath = '%DESTINO%';" ^
  "$s.WorkingDirectory = '%RAIZ%';" ^
  "$s.IconLocation = '%ICONO%,0';" ^
  "$s.Description = 'Control de pagos de la convencion';" ^
  "$s.Save();"

if errorlevel 1 (
  echo.
  echo No pude crear el acceso directo.
  pause
  exit /b 1
)

echo.
echo Listo. En el Escritorio esta el icono "Tesorera".
echo.
echo FALTA UN PASO para que el icono salga tambien en la barra de tareas:
echo   1. Abre Tesorera con el icono nuevo.
echo   2. En la ventana que abre, arriba a la derecha, toca los tres puntos.
echo   3. Elige "Abrir en Tesorera" o "Instalar Tesorera".
echo Con eso Windows la trata como una aplicacion de verdad.
echo.
pause
