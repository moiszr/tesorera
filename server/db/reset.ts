/**
 * Deja la base vacía para la entrega: borra personas y pagos, y conserva
 * el evento con sus tipos de cupo y las iglesias ya configuradas.
 * Hace un respaldo antes, porque los datos son sagrados.
 */
import { createInterface } from 'node:readline/promises'
import { conectar } from './conexion'
import { hacerRespaldo } from './respaldo'

async function main() {
  const db = conectar()
  const personas = db.prepare('SELECT COUNT(*) AS n FROM personas').get() as any
  const pagos = db.prepare('SELECT COUNT(*) AS n FROM pagos').get() as any

  console.log(`\nEsto va a borrar ${personas.n} personas y ${pagos.n} pagos.`)
  console.log('El evento, sus tipos de cupo y las iglesias se quedan.\n')

  const respaldo = hacerRespaldo()
  if (respaldo) console.log(`Respaldo hecho antes de borrar: ${respaldo.nombre}\n`)

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const respuesta = await rl.question('Escribe BORRAR para confirmar: ')
  rl.close()

  if (respuesta.trim() !== 'BORRAR') {
    console.log('No se borró nada.')
    return
  }

  db.transaction(() => {
    db.prepare('DELETE FROM pagos').run()
    db.prepare('DELETE FROM inscripciones').run()
    db.prepare('DELETE FROM personas').run()
  })()

  console.log('Listo. La base quedó limpia con el evento configurado.')
}

main()
