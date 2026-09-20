import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import { eventoActivo } from '../db/consultas'
import { guardarHabitacion, listarHabitaciones, prepararHabitacion } from '../db/habitaciones'
import { error } from './ayuda'

export const rutasHabitaciones = new Hono()
rutasHabitaciones.get('/habitaciones', (c) => c.json(listarHabitaciones()))
rutasHabitaciones.post('/habitaciones/revisar', async (c) => {
  try {
    return c.json(prepararHabitacion(await c.req.json()))
  } catch (e) {
    return error(c, e instanceof Error ? e.message : 'Revisa los datos de la habitación.')
  }
})
rutasHabitaciones.post('/habitaciones/guardar', async (c) => {
  try {
    const { datos, firma } = await c.req.json()
    return c.json(guardarHabitacion(datos, firma))
  } catch (e) {
    return error(c, e instanceof Error ? e.message : 'No pude guardar la habitación.')
  }
})
rutasHabitaciones.patch('/habitaciones/:id/archivo', async (c) => {
  const db = conectar()
  const id = Number(c.req.param('id'))
  const h = db
    .prepare('SELECT * FROM habitaciones WHERE id=? AND evento_id=?')
    .get(id, eventoActivo(db)?.id ?? -1) as any
  if (!h) return error(c, 'No encontré esa habitación.', 404)
  const { archivada } = await c.req.json()
  if (archivada && db.prepare('SELECT id FROM inscripciones WHERE habitacion_id=?').get(id))
    return error(c, 'Retira o mueve a sus integrantes antes de archivar la habitación.')
  db.transaction(() => {
    db.prepare('UPDATE habitaciones SET archivada=?, revision=revision+1 WHERE id=?').run(
      archivada ? 1 : 0,
      id,
    )
    db.prepare('INSERT INTO cambios_habitaciones(evento_id,detalle) VALUES (?,?)').run(
      h.evento_id,
      JSON.stringify({ habitacion_id: id, archivada: !!archivada }),
    )
  })()
  return c.json({ ok: true })
})
