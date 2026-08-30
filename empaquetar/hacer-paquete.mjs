/**
 * Arma la carpeta que se instala en la laptop de ella.
 *
 * La idea: que no haya que instalar Node, ni Git, ni npm, ni compilar nada.
 * Todo eso pasa aquí, una vez, y lo que viaja es una carpeta que ya funciona:
 * el motor (node.exe), la app compilada y la base de datos vacía.
 *
 *   node empaquetar/hacer-paquete.mjs
 *
 * Deja el resultado en empaquetar/salida/Tesorera/.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = join(AQUI, '..')
const SALIDA = join(AQUI, 'salida')
const APP = join(SALIDA, 'Tesorera')

// Node 24 LTS. La versión se fija a propósito: que el paquete de mañana no
// cambie de motor sin que nadie lo note.
//
// Tiene que ser 22 o más. better-sqlite3 v13 declara `engines: node >=22`, y
// esto no es una recomendación: su binario compilado para Windows cargado bajo
// Node 20 revienta con violación de acceso (0xC0000005). Al ser un crash
// nativo, el proceso muere sin excepción, sin stderr y sin registro — la app
// simplemente "no abre", sin dejar rastro de por qué.
const NODE = 'v24.20.0'
const NODE_EXE = `https://nodejs.org/dist/${NODE}/win-x64/node.exe`

const paso = (t) => console.log(`\n▸ ${t}`)
const peso = (r) => {
  let n = 0
  const ver = (p) => {
    const s = statSync(p)
    if (!s.isDirectory()) return (n += s.size)
    for (const h of readdirSync(p)) ver(join(p, h))
  }
  ver(r)
  return `${(n / 1e6).toFixed(1)} MB`
}

paso('Limpiando')
rmSync(SALIDA, { recursive: true, force: true })
mkdirSync(APP, { recursive: true })

paso('Compilando el frontend')
execFileSync('npm', ['run', 'build'], { cwd: RAIZ, stdio: 'inherit' })
cpSync(join(RAIZ, 'dist'), join(APP, 'dist'), { recursive: true })

paso('Empaquetando el servidor en un solo archivo')
// better-sqlite3 queda fuera del bundle a propósito: lleva un binario compilado
// (.node) que no se puede meter dentro de un .js. Viaja al lado, entero.
execFileSync(
  'npx',
  [
    'esbuild', 'server/arrancar.ts',
    '--bundle', '--platform=node', '--format=esm', '--target=node20',
    '--external:better-sqlite3',
    `--outfile=${join(APP, 'app', 'servidor.mjs')}`,
  ],
  { cwd: RAIZ, stdio: 'inherit' },
)
cpSync(join(RAIZ, 'server', 'db', 'migraciones'), join(APP, 'app', 'migraciones'), { recursive: true })

paso('Copiando better-sqlite3 (solo lo de Windows)')
const BS = join(APP, 'app', 'node_modules', 'better-sqlite3')
mkdirSync(BS, { recursive: true })
for (const f of ['package.json', 'lib']) {
  cpSync(join(RAIZ, 'node_modules', 'better-sqlite3', f), join(BS, f), { recursive: true })
}
mkdirSync(join(BS, 'prebuilds'), { recursive: true })
// Solo el binario de Windows x64: los otros siete son 15 MB de peso muerto.
cpSync(
  join(RAIZ, 'node_modules', 'better-sqlite3', 'prebuilds', 'win32-x64.node'),
  join(BS, 'prebuilds', 'win32-x64.node'),
)
// Que se comporte como un paquete suelto y no busque un node_modules más arriba.
writeFileSync(join(APP, 'app', 'node_modules', '.marca'), 'solo better-sqlite3 vive aqui\n')

paso(`Bajando el motor Node ${NODE} para Windows`)
const destinoNode = join(APP, 'node.exe')
if (!existsSync(destinoNode)) {
  const r = await fetch(NODE_EXE)
  if (!r.ok) throw new Error(`No pude bajar node.exe (${r.status})`)
  writeFileSync(destinoNode, Buffer.from(await r.arrayBuffer()))
}

paso('Lanzador')
// Las plantillas viven en archivos sueltos, no incrustadas aqui: VBScript
// dentro de JavaScript es un nido de comillas escapadas que se rompe en
// silencio, y ademas asi se pueden leer y editar como lo que son.
cpSync(join(AQUI, 'plantillas', 'iniciar.mjs'), join(APP, 'app', 'iniciar.mjs'))
cpSync(join(AQUI, 'plantillas', 'Tesorera.vbs'), join(APP, 'Tesorera.vbs'))

paso('Marca e instrucciones')
cpSync(join(RAIZ, 'marca', 'tesorera.ico'), join(APP, 'tesorera.ico'))
cpSync(join(RAIZ, 'README-MAMA.md'), join(APP, 'Como se usa.txt'))
mkdirSync(join(APP, 'data'), { recursive: true })
writeFileSync(join(APP, 'version.txt'), `${JSON.parse(readFileSync(join(RAIZ, 'package.json'))).version}\n`)

paso(`Listo — ${peso(APP)} en ${APP}`)
