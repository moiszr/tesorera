/**
 * Puerta de entrada de la app instalada.
 *
 * El servidor deduce dónde vive la base de datos a partir de la ubicación de
 * sus archivos. Windows lanza los accesos directos desde cualquier directorio,
 * así que las dos rutas se fijan aquí, calculadas desde este archivo: sin esto,
 * abrir Tesorera desde el Escritorio buscaría la base en el Escritorio.
 */
import { appendFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))
const raiz = join(aqui, '..')

process.env.TESORERA_RAIZ ??= raiz
process.env.TESORERA_MIGRACIONES ??= join(aqui, 'migraciones')

/**
 * El lanzador corre Node con la ventana escondida, así que un error aquí no lo
 * ve nadie: ella solo nota que "no abre". Por eso el propio Node deja el rastro.
 * Lo anota Node y no una redirección del .vbs porque redirigir desde VBScript
 * obliga a pasar por cmd y a anidar comillas — justo lo que se rompe en
 * silencio y en la máquina de otro.
 */
const registro = join(raiz, 'data', 'ultimo-arranque.txt')

function anotar(que, error) {
  try {
    mkdirSync(dirname(registro), { recursive: true })
    const cuando = new Date().toISOString()
    appendFileSync(registro, `[${cuando}] ${que}\n${error?.stack ?? error ?? ''}\n`)
  } catch {
    // Si ni el registro se puede escribir, ya no hay nada más que hacer.
  }
}

process.on('uncaughtException', (e) => {
  anotar('Falló al arrancar', e)
  process.exit(1)
})
process.on('unhandledRejection', (e) => {
  anotar('Falló al arrancar', e)
  process.exit(1)
})

try {
  await import('./servidor.mjs')
} catch (e) {
  anotar('No pude cargar el servidor', e)
  process.exit(1)
}
