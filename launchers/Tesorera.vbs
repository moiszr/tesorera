' Tesorera - esto es lo que abre el icono del Escritorio.
'
' Corre Tesorera.bat con la ventana negra ESCONDIDA, para que ella solo vea
' la aplicacion. Si algo sale mal, en vez de dejarla sin saber que paso,
' aparece un mensaje en espanol y se guarda el detalle en un archivo.

Option Explicit

Dim shell, fso, carpeta, bat, registro, codigo, mensaje
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

carpeta = fso.GetParentFolderName(WScript.ScriptFullName)
bat = carpeta & "\Tesorera.bat"
registro = fso.GetParentFolderName(carpeta) & "\data\ultimo-arranque.txt"

If Not fso.FileExists(bat) Then
  MsgBox "No encuentro los archivos de Tesorera." & vbCrLf & vbCrLf & _
         "Avisale a Moises.", vbCritical, "Tesorera"
  WScript.Quit 1
End If

' 0 = ventana escondida. True = esperar a que termine para saber si fallo.
codigo = shell.Run("cmd /c """"" & bat & """ > """ & registro & """ 2>&1""", 0, True)

If codigo <> 0 Then
  mensaje = "Tesorera no pudo abrir." & vbCrLf & vbCrLf & _
            "Prueba apagando y prendiendo la laptop." & vbCrLf & _
            "Si sigue igual, avisale a Moises y ensenale este archivo:" & vbCrLf & vbCrLf & _
            registro
  MsgBox mensaje, vbExclamation, "Tesorera"
End If
