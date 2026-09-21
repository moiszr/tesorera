import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import { fichaPersona } from '../db/consultas'
import { firmaDePago, proximoId } from '../db/firma'
import { respaldarAntesDeCorregir } from '../db/respaldo'
import { hoyISO } from '../../src/lib/fechas'
import { entero, error, texto } from './ayuda'

export const rutasPagos = new Hono()

const METODOS = ['efectivo', 'transferencia', 'otro']
function fechaValida(fecha: unknown): fecha is string {
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false
  const tiempo = Date.parse(fecha + 'T12:00:00Z')
  return Number.isFinite(tiempo) && new Date(tiempo).toISOString().slice(0, 10) === fecha
}

rutasPagos.post('/pagos', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const inscripcionId = entero(cuerpo.inscripcion_id)
  const monto = cuerpo.monto

  if (inscripcionId === null) return error(c, 'Elige primero a quién le vas a registrar el pago.')
  if (!Number.isSafeInteger(monto) || monto <= 0) return error(c, 'Escribe cuánto está abonando.')

  const db = conectar()
  const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id = ?').get(inscripcionId) as any
  if (!inscripcion) return error(c, 'Esta persona no está inscrita en el evento.', 404)

  if (!db.prepare('SELECT id FROM personas WHERE id=? AND archivada=0').get(inscripcion.persona_id))
    return error(c, 'Devuelve a esta persona a la lista antes de registrar un pago.')
  const fecha = cuerpo.fecha ?? hoyISO()
  if (!fechaValida(fecha)) return error(c, 'Elige una fecha válida para el pago.')
  const metodo = String(cuerpo.metodo ?? 'efectivo')
  if (!METODOS.includes(metodo)) return error(c, 'Elige una forma de pago válida.')
  const res = db
    .prepare(
      `INSERT INTO pagos (id, inscripcion_id, monto, fecha, metodo, nota)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      proximoId('pagos', db),
      inscripcionId,
      monto,
      fecha,
      METODOS.includes(metodo) ? metodo : 'otro',
      texto(cuerpo.nota),
    )

  const ficha = fichaPersona(inscripcion.persona_id, db, inscripcion.evento_id)
  return c.json({ id: Number(res.lastInsertRowid), ficha }, 201)
})

rutasPagos.post('/pagos/:id/anular', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const pago = db.prepare('SELECT * FROM pagos WHERE id = ?').get(id) as any
  if (!pago) return error(c, 'No encontré ese pago.', 404)
  if (pago.anulado) return error(c, 'Ese pago ya estaba anulado.')

  // Compatibilidad con versiones anteriores; la interfaz actual permite eliminar.
  db.prepare(
    `UPDATE pagos SET anulado = 1, nota_anulacion = ?, anulado_en = datetime('now') WHERE id = ?`,
  ).run(texto(cuerpo.nota), id)

  const inscripcion = db
    .prepare('SELECT persona_id FROM inscripciones WHERE id = ?')
    .get(pago.inscripcion_id) as any
  return c.json({ ok: true, ficha: fichaPersona(inscripcion.persona_id) })
})

rutasPagos.patch('/pagos/:id', async (c) => {
  const db = conectar()
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const pago = db.prepare('SELECT * FROM pagos WHERE id=?').get(id) as any
  if (!pago) return error(c, 'No encontré ese pago. Actualiza la cuenta.', 404)
  if (pago.anulado) return error(c, 'Este pago está anulado. Puedes eliminarlo o registrar un nuevo abono.')
  if (!cuerpo.firma || cuerpo.firma !== firmaDePago(pago, db))
    return error(c, 'El pago cambió. Cierra el editor y vuelve a abrirlo antes de guardar.', 409)
  if (!Number.isSafeInteger(cuerpo.monto) || cuerpo.monto <= 0)
    return error(c, 'Escribe un monto mayor que cero.')
  if (!fechaValida(cuerpo.fecha)) return error(c, 'Elige una fecha válida para el pago.')
  if (!METODOS.includes(cuerpo.metodo)) return error(c, 'Elige una forma de pago válida.')
  try {
    respaldarAntesDeCorregir()
  } catch (e) {
    return error(c, (e as Error).message)
  }
  const cambiado = db.transaction(() => {
    const vigente = db.prepare('SELECT * FROM pagos WHERE id=?').get(id) as any
    if (!vigente || firmaDePago(vigente, db) !== cuerpo.firma) return false
    db.prepare('UPDATE pagos SET monto=?,fecha=?,metodo=?,nota=? WHERE id=?').run(
      cuerpo.monto,
      cuerpo.fecha,
      cuerpo.metodo,
      texto(cuerpo.nota),
      id,
    )
    return true
  })()
  if (!cambiado) return error(c, 'El pago cambió. Cierra el editor y vuelve a abrirlo antes de guardar.', 409)
  const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id=?').get(pago.inscripcion_id) as any
  return c.json({ ficha: fichaPersona(inscripcion.persona_id, db, inscripcion.evento_id) })
})
rutasPagos.delete('/pagos/:id', async (c) => {
  const db = conectar()
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const pago = db.prepare('SELECT * FROM pagos WHERE id=?').get(id) as any
  if (!pago) return error(c, 'No encontré ese pago. Actualiza la cuenta.', 404)
  if (!cuerpo.firma || cuerpo.firma !== firmaDePago(pago, db))
    return error(c, 'El pago cambió. Cierra esta confirmación y vuelve a revisar antes de eliminar.', 409)
  try {
    respaldarAntesDeCorregir()
  } catch (e) {
    return error(c, (e as Error).message)
  }
  const eliminado = db.transaction(() => {
    const vigente = db.prepare('SELECT * FROM pagos WHERE id=?').get(id) as any
    if (!vigente || firmaDePago(vigente, db) !== cuerpo.firma) return false
    db.prepare('DELETE FROM pagos WHERE id=?').run(id)
    return true
  })()
  if (!eliminado)
    return error(c, 'El pago cambió. Cierra esta confirmación y vuelve a revisar antes de eliminar.', 409)
  const inscripcion = db.prepare('SELECT * FROM inscripciones WHERE id=?').get(pago.inscripcion_id) as any
  return c.json({ ficha: fichaPersona(inscripcion.persona_id, db, inscripcion.evento_id) })
})

/** Datos del comprobante de un pago, para imprimir o mandar por WhatsApp. */
rutasPagos.get('/pagos/:id/comprobante', (c) => {
  const id = Number(c.req.param('id'))
  const db = conectar()
  const pago = db
    .prepare(
      `SELECT pg.*, per.id AS persona_id, per.nombre AS persona,
              g.nombre AS iglesia, c.nombre AS categoria, i.precio, i.evento_id, i.extra_habitacion,
              e.nombre AS evento, e.fecha_inicio
         FROM pagos pg
         JOIN inscripciones i ON i.id = pg.inscripcion_id
         JOIN personas per ON per.id = i.persona_id
         JOIN eventos e ON e.id = i.evento_id
         LEFT JOIN iglesias g ON g.id = per.iglesia_id
         LEFT JOIN categorias c ON c.id = i.categoria_id
        WHERE pg.id = ?`,
    )
    .get(id) as any
  if (!pago) return error(c, 'No encontré ese pago.', 404)

  const ficha = fichaPersona(pago.persona_id, db, pago.evento_id)
  // Cuánto llevaba pagado hasta ese pago, incluyéndolo (los anulados no cuentan).
  const hasta = db
    .prepare(
      `SELECT COALESCE(SUM(monto), 0) AS total FROM pagos
        WHERE inscripcion_id = ? AND anulado = 0 AND (fecha < ? OR (fecha = ? AND id <= ?))`,
    )
    .get(pago.inscripcion_id, pago.fecha, pago.fecha, id) as any

  return c.json({
    pago,
    persona: ficha?.persona,
    cuenta: ficha?.cuenta,
    acumulado_a_la_fecha: hasta.total,
  })
})
