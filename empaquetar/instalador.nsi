; Instalador de Tesorera para Windows.
;
; Se instala en la carpeta del usuario, no en Archivos de programa: así no pide
; permisos de administrador (ella no los tiene y no sabría qué contestarle a la
; ventana azul) y, sobre todo, la app puede escribir su propia base de datos al
; lado suyo sin pelearse con los permisos de Windows.

Unicode true
Name "Tesorera"
OutFile "salida\Tesorera-Instalador.exe"
InstallDir "$LOCALAPPDATA\Programs\Tesorera"
InstallDirRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Tesorera" "InstallLocation"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "Tesorera"

!include "MUI2.nsh"

!define MUI_ICON "..\marca\tesorera.ico"
!define MUI_UNICON "..\marca\tesorera.ico"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\Tesorera.vbs"
!define MUI_FINISHPAGE_RUN_TEXT "Abrir Tesorera ahora"

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "Spanish"

Section "Tesorera"
  ; Cierra el motor anterior antes de reemplazar archivos, sin tocar data.
  InitPluginsDir
  SetOutPath "$PLUGINSDIR"
  File "cerrar-para-actualizar.ps1"
  nsExec::ExecToStack '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$PLUGINSDIR\cerrar-para-actualizar.ps1" -Destino "$INSTDIR"'
  Pop $0
  Pop $1
  StrCmp $0 "0" motor_cerrado
    IfSilent fallo_actualizacion
    MessageBox MB_OK|MB_ICONSTOP "No pude cerrar Tesorera. Reinicia Windows y vuelve a ejecutar este instalador. Tus datos no se han cambiado."
    fallo_actualizacion:
    SetErrorLevel 1
    Quit
  motor_cerrado:
  SetOutPath "$INSTDIR"

  ; Los archivos se sobrescriben uno a uno. En ningún momento se borra la
  ; carpeta de instalación: ahí dentro vive data\, con los pagos de todo el año.
  ; Reinstalar o actualizar tiene que ser inofensivo.
  File /r "salida\Tesorera\*.*"

  CreateShortCut "$DESKTOP\Tesorera.lnk" "$INSTDIR\Tesorera.vbs" "" "$INSTDIR\tesorera.ico" 0 \
    SW_SHOWNORMAL "" "Control de pagos de la convención"
  CreateDirectory "$SMPROGRAMS\Tesorera"
  CreateShortCut "$SMPROGRAMS\Tesorera\Tesorera.lnk" "$INSTDIR\Tesorera.vbs" "" "$INSTDIR\tesorera.ico" 0 \
    SW_SHOWNORMAL "" "Control de pagos de la convención"
  CreateShortCut "$SMPROGRAMS\Tesorera\Desinstalar Tesorera.lnk" "$INSTDIR\Desinstalar.exe"

  WriteUninstaller "$INSTDIR\Desinstalar.exe"

  ; Para que salga en "Aplicaciones instaladas" de Windows como cualquier otra.
  !define REG "Software\Microsoft\Windows\CurrentVersion\Uninstall\Tesorera"
  WriteRegStr HKCU "${REG}" "DisplayName" "Tesorera"
  WriteRegStr HKCU "${REG}" "DisplayIcon" "$INSTDIR\tesorera.ico"
  WriteRegStr HKCU "${REG}" "UninstallString" "$\"$INSTDIR\Desinstalar.exe$\""
  WriteRegStr HKCU "${REG}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${REG}" "Publisher" "Moisés Núñez"
  WriteRegStr HKCU "${REG}" "DisplayVersion" "${VERSION}"
  WriteRegDWORD HKCU "${REG}" "NoModify" 1
  WriteRegDWORD HKCU "${REG}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  ; Se borra el programa, NUNCA los datos. Si alguien desinstala por error (o
  ; para reinstalar limpio), los pagos siguen ahí y basta con volver a instalar.
  Delete "$INSTDIR\node.exe"
  Delete "$INSTDIR\Tesorera.vbs"
  Delete "$INSTDIR\tesorera.ico"
  Delete "$INSTDIR\version.txt"
  Delete "$INSTDIR\Como se usa.txt"
  Delete "$INSTDIR\Desinstalar.exe"
  RMDir /r "$INSTDIR\app"
  RMDir /r "$INSTDIR\dist"

  Delete "$DESKTOP\Tesorera.lnk"
  RMDir /r "$SMPROGRAMS\Tesorera"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Tesorera"

  ; RMDir sin /r solo borra la carpeta si quedó vacía. Si data\ sigue dentro
  ; —que es lo normal— no se toca, y ese es exactamente el objetivo.
  RMDir "$INSTDIR"

  ; El aviso solo si hay alguien mirando. En modo silencioso (/S) nadie puede
  ; cerrar un MessageBox, asi que el desinstalador se quedaria colgado para
  ; siempre esperando un clic que no llega.
  IfSilent fin
  IfFileExists "$INSTDIR\data\*.*" 0 fin
    MessageBox MB_OK|MB_ICONINFORMATION \
      "Tesorera se desinstaló, pero los pagos NO se borraron.$\r$\n$\r$\nSiguen guardados en:$\r$\n$INSTDIR\data$\r$\n$\r$\nSi vuelves a instalar Tesorera, aparecerán solos."
  fin:
SectionEnd
