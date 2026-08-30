' Tesorera - esto es lo que abre el icono del Escritorio.
'
' Hace una sola cosa: correr node.exe con la ventana escondida, para que ella
' vea la aplicacion y no una consola negra. Nada de cmd ni de redirecciones:
' si algo falla, quien lo anota es el propio Node en data\ultimo-arranque.txt.
Option Explicit

Dim shell, fso, carpeta, motor
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

carpeta = fso.GetParentFolderName(WScript.ScriptFullName)
motor = carpeta & "\node.exe"

If Not fso.FileExists(motor) Then
  MsgBox "Faltan archivos de Tesorera." & vbCrLf & vbCrLf & _
         "Vuelve a instalarla, o avisale a Moises.", vbCritical, "Tesorera"
  WScript.Quit 1
End If

' 0 = ventana escondida. False = no esperar; el servidor se queda corriendo.
shell.CurrentDirectory = carpeta
shell.Run """" & motor & """ ""app\iniciar.mjs""", 0, False
