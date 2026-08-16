import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import { fichaPersona } from '../db/consultas'
import { entero, error, texto } from './ayuda'

export const rutasPagos = new Hono()

const METODOS = ['efectivo', 'transferencia', 'otro']

rutasPagos.post('/pagos', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const inscripcionId = entero(cuerpo.inscripcion_id)
  const monto = entero(cuerpo.monto)

  if (inscripcionId === null) return error(c, 'Elige primero a quién le vas a registrar el pago.')
  if (monto === null || monto <= 0) return error(c, 'Escribe cuánto está abonando.')

  const db = conectar()
  const inscripcion = db
    .prepare('SELECT * FROM inscripciones WHERE id = ?').get(inscripcionId) as any
  if (!inscripcion) return error(c, 'Esta persona no está inscrita en el evento.', 404)

  const metodo = String(cuerpo.metodo ?? 'efectivo')
  const res = db
    .prepare(
      `INSERT INTO pagos (inscripcion_id, monto, fecha, metodo, nota)
       VALUES (?, ?, COALESCE(?, date('now')), ?, ?)`,
    )
    .run(
      inscripcionId,
      monto,
      texto(cuerpo.fecha),
      METODOS.includes(metodo) ? metodo : 'otro',
      texto(cuerpo.nota),
    )

  const ficha = fichaPersona(inscripcion.persona_id)
  return c.json({ id: Number(res.lastInsertRowid), ficha }, 201)
})

rutasPagos.post('/pagos/:id/anular', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const pago = db.prepare('SELECT * FROM pagos WHERE id = ?').get(id) as any
  if (!pago) return error(c, 'No encontré ese pago.', 404)
  if (pago.anulado) return error(c, 'Ese pago ya estaba anulado.')

  // Nunca se borra: se marca anulado y queda tachado en el historial.
  db.prepare(
    `UPDATE pagos SET anulado = 1, nota_anulacion = ?, anulado_en = datetime('now') WHERE id = ?`,
  ).run(texto(cuerpo.nota), id)

  const inscripcion = db
    .prepare('SELECT persona_id FROM inscripciones WHERE id = ?')
    .get(pago.inscripcion_id) as any
  return c.json({ ok: true, ficha: fichaPersona(inscripcion.persona_id) })
})

/** Datos del comprobante de un pago, para imprimir o mandar por WhatsApp. */
rutasPagos.get('/pagos/:id/comprobante', (c) => {
  const id = Number(c.req.param('id'))
  const db = conectar()
  const pago = db
    .prepare(
      `SELECT pg.*, per.id AS persona_id, per.nombre AS persona,
              g.nombre AS iglesia, c.nombre AS categoria, i.precio,
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

  const ficha = fichaPersona(pago.persona_id)
  // Cuánto llevaba pagado hasta ese pago, incluyéndolo (los anulados no cuentan).
  const hasta = db
    .prepare(
      `SELECT COALESCE(SUM(monto), 0) AS total FROM pagos
        WHERE inscripcion_id = ? AND anulado = 0 AND id <= ?`,
    )
    .get(pago.inscripcion_id, id) as any

  return c.json({
    pago,
    persona: ficha?.persona,
    cuenta: ficha?.cuenta,
    acumulado_a_la_fecha: hasta.total,
  })
})
