import { createHash } from 'node:crypto'
import type Database from 'better-sqlite3'

export function firmar(datos: unknown) {
  return createHash('sha256').update(JSON.stringify(datos)).digest('hex')
}

export function proximoId(tabla: 'personas' | 'inscripciones' | 'pagos', db: Database.Database) {
  return (
    (db.prepare('SELECT ultimo FROM identificadores WHERE tabla=?').get(tabla) as { ultimo: number }).ultimo +
    1
  )
}

/** La confirmación incluye toda la cuenta: otro abono o un cambio de cupo puede cambiar el saldo mostrado. */
export function firmaDePago(pago: { id: number; inscripcion_id: number }, db: Database.Database) {
  const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id=?').get(pago.inscripcion_id)
  const pagos = db.prepare('SELECT * FROM pagos WHERE inscripcion_id=? ORDER BY id').all(pago.inscripcion_id)
  return firmar({ id: pago.id, inscripcion, pagos })
}
