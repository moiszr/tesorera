/**
 * "Modo mamá": esto es lo que corre el launcher de doble clic.
 * Compila el frontend si hace falta, levanta el servidor, respalda la base
 * y abre el navegador en modo aplicación (ventana sin pestañas ni barra).
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { PUERTO, arrancarServidor } from './index'
import { RAIZ } from './db/conexion'

const DIST = join(RAIZ, 'dist')
const DIRECCION = `http://localhost:${PUERTO}`

async function main() {
  if (await yaEstaAbierta()) {
    console.log('Tesorera ya estaba abierta. Abro la ventana.')
    abrirNavegador()
    return
  }

  if (hayQueCompilar()) {
    console.log('Preparando Tesorera por primera vez… (esto tarda un minuto)')
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const r = spawnSync(npm, ['run', 'build'], { cwd: RAIZ, stdio: 'inherit', shell: process.platform === 'win32' })
    if (r.status !== 0) {
      console.error('No pude preparar la aplicación. Avísale a Moisés.')
      process.exit(1)
    }
  }

  await arrancarServidor()
  abrirNavegador()
}

function hayQueCompilar(): boolean {
  const indice = join(DIST, 'index.html')
  if (!existsSync(indice)) return true
  const compilado = statSync(indice).mtimeMs
  return masReciente(join(RAIZ, 'src')) > compilado || masReciente(join(RAIZ, 'index.html')) > compilado
}

function masReciente(ruta: string): number {
  if (!existsSync(ruta)) return 0
  const s = statSync(ruta)
  if (!s.isDirectory()) return s.mtimeMs
  let max = s.mtimeMs
  for (const hijo of readdirSync(ruta)) {
    max = Math.max(max, masReciente(join(ruta, hijo)))
  }
  return max
}

async function yaEstaAbierta(): Promise<boolean> {
  try {
    const r = await fetch(`${DIRECCION}/api/resumen`, { signal: AbortSignal.timeout(900) })
    return r.ok
  } catch {
    return false
  }
}

/**
 * Abre Tesorera en su propia ventana, no como una pestaña más del navegador.
 *
 * Se usa un perfil de navegador aparte (data/ventana) por tres razones:
 *  - la ventana de Tesorera no se cierra cuando ella cierra su Chrome,
 *  - no arrastra sus extensiones ni sus sesiones,
 *  - Chrome trata la ventana como una aplicación propia, así que toma el
 *    icono y el nombre del manifiesto en vez de los suyos.
 *
 * Para que el icono salga en la barra de tareas de Windows hace falta además
 * instalar la app una vez (ver "Crear acceso directo.bat" y el README).
 */
function abrirNavegador() {
  const perfil = join(RAIZ, 'data', 'ventana')
  const comunes = [
    `--app=${DIRECCION}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-features=Translate,MediaRouter',
  ]

  const candidatos: { cmd: string; args: string[] }[] = []

  if (process.platform === 'win32') {
    const pf = process.env['ProgramFiles'] ?? 'C:\\Program Files'
    const pf86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)'
    const local = process.env['LOCALAPPDATA'] ?? ''
    for (const ruta of [
      join(pf, 'Google\\Chrome\\Application\\chrome.exe'),
      join(pf86, 'Google\\Chrome\\Application\\chrome.exe'),
      join(local, 'Google\\Chrome\\Application\\chrome.exe'),
      join(pf86, 'Microsoft\\Edge\\Application\\msedge.exe'),
      join(pf, 'Microsoft\\Edge\\Application\\msedge.exe'),
    ]) {
      if (existsSync(ruta)) candidatos.push({ cmd: ruta, args: comunes })
    }
    candidatos.push({ cmd: 'cmd', args: ['/c', 'start', '', DIRECCION] })
  } else if (process.platform === 'darwin') {
    for (const app of ['Google Chrome', 'Microsoft Edge']) {
      if (existsSync(`/Applications/${app}.app`)) {
        candidatos.push({ cmd: 'open', args: ['-na', app, '--args', ...comunes] })
      }
    }
    candidatos.push({ cmd: 'open', args: [DIRECCION] })
  } else {
    candidatos.push({ cmd: 'google-chrome', args: comunes })
    candidatos.push({ cmd: 'xdg-open', args: [DIRECCION] })
  }

  for (const { cmd, args } of candidatos) {
    try {
      const hijo = spawn(cmd, args, { detached: true, stdio: 'ignore' })
      hijo.unref()
      return
    } catch {
      // Probamos el siguiente.
    }
  }
  console.log(`Abre esta dirección en el navegador: ${DIRECCION}`)
}

main()
