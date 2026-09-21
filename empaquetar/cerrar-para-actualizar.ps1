param([Parameter(Mandatory=$true)][string]$Destino)
$ErrorActionPreference = 'Stop'
try {
  $motor = [IO.Path]::GetFullPath((Join-Path $Destino 'node.exe'))
  # Solo el motor de ESTA instalación: no cerrar Node de otras aplicaciones.
  $procesos = @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.ExecutablePath -and [string]::Equals($_.ExecutablePath, $motor, [StringComparison]::OrdinalIgnoreCase) })
  foreach ($proceso in $procesos) {
    $activo = Get-Process -Id $proceso.ProcessId -ErrorAction SilentlyContinue
    if ($activo) {
      Stop-Process -InputObject $activo -Force
      if (-not $activo.WaitForExit(15000)) { throw 'El motor sigue abierto' }
    }
  }
  exit 0
} catch {
  Write-Output 'No se pudo cerrar Tesorera. Reinicia Windows y vuelve a ejecutar el instalador.'
  exit 1
}
