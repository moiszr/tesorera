import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import {
  aplicarPrecioDeCategoria,
  categoria,
  categoriasDeEvento,
  eventoActivo,
  inscripcionesAfectadas,
  listarEventos,
} from '../db/consultas'
import { entero, error, texto } from './ayuda'

export const rutasEventos = new Hono()

rutasEventos.get('/eventos', (c) => c.json(listarEventos()))
rutasEventos.get('/evento-activo', (c) => c.json(eventoActivo()))

rutasEventos.post('/eventos', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const nombre = texto(cuerpo.nombre)
  if (!nombre) return error(c, 'Ponle nombre al evento, por ejemplo "Convención Octubre".')

  const db = conectar()
  const id = db.transaction(() => {
    if (cuerpo.activo) db.prepare('UPDATE eventos SET activo = 0').run()
    const res = db
      .prepare('INSERT INTO eventos (nombre, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, ?)')
      .run(nombre, texto(cuerpo.fecha_inicio), texto(cuerpo.fecha_fin), cuerpo.activo ? 1 : 0)
    return Number(res.lastInsertRowid)
  })()

  return c.json({ id }, 201)
})

rutasEventos.patch('/eventos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const actual = db.prepare('SELECT * FROM eventos WHERE id = ?').get(id) as any
  if (!actual) return error(c, 'No encontré ese evento.', 404)

  const nombre = cuerpo.nombre !== undefined ? texto(cuerpo.nombre) : actual.nombre
  if (!nombre) return error(c, 'El nombre del evento no puede quedar vacío.')

  db.transaction(() => {
    if (cuerpo.activo) db.prepare('UPDATE eventos SET activo = 0').run()
    db.prepare(
      'UPDATE eventos SET nombre = ?, fecha_inicio = ?, fecha_fin = ?, activo = ? WHERE id = ?',
    ).run(
      nombre,
      cuerpo.fecha_inicio !== undefined ? texto(cuerpo.fecha_inicio) : actual.fecha_inicio,
      cuerpo.fecha_fin !== undefined ? texto(cuerpo.fecha_fin) : actual.fecha_fin,
      cuerpo.activo !== undefined ? (cuerpo.activo ? 1 : 0) : actual.activo,
      id,
    )
  })()

  return c.json({ ok: true })
})

// ── Categorías del evento (aquí viven los precios) ────────────────────────

rutasEventos.get('/eventos/:id/categorias', (c) =>
  c.json(categoriasDeEvento(Number(c.req.param('id')))),
)

rutasEventos.post('/eventos/:id/categorias', async (c) => {
  const eventoId = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const nombre = texto(cuerpo.nombre)
  const precio = entero(cuerpo.precio)

  if (!nombre) return error(c, 'Ponle nombre al tipo de cupo, por ejemplo "Adulto — habitación familiar".')
  if (precio === null || precio < 0) return error(c, 'Escribe cuánto cuesta este tipo de cupo.')

  const db = conectar()
  if (!db.prepare('SELECT id FROM eventos WHERE id = ?').get(eventoId)) {
    return error(c, 'No encontré ese evento.', 404)
  }
  const repetida = db
    .prepare('SELECT id FROM categorias WHERE evento_id = ? AND nombre = ? COLLATE NOCASE')
    .get(eventoId, nombre)
  if (repetida) return error(c, `Ya existe un tipo de cupo que se llama "${nombre}".`)

  const siguiente = db
    .prepare('SELECT COALESCE(MAX(orden), 0) + 1 AS n FROM categorias WHERE evento_id = ?')
    .get(eventoId) as any

  const res = db
    .prepare('INSERT INTO categorias (evento_id, nombre, precio, orden) VALUES (?, ?, ?, ?)')
    .run(eventoId, nombre, precio, entero(cuerpo.orden) ?? siguiente.n)

  return c.json({ id: Number(res.lastInsertRowid) }, 201)
})

rutasEventos.patch('/categorias/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const actual = db.prepare('SELECT * FROM categorias WHERE id = ?').get(id) as any
  if (!actual) return error(c, 'No encontré ese tipo de cupo.', 404)

  const nombre = cuerpo.nombre !== undefined ? texto(cuerpo.nombre) : actual.nombre
  if (!nombre) return error(c, 'El nombre del tipo de cupo no puede quedar vacío.')

  if (String(nombre).toLowerCase() !== String(actual.nombre).toLowerCase()) {
    const repetida = db
      .prepare('SELECT id FROM categorias WHERE evento_id = ? AND nombre = ? COLLATE NOCASE AND id <> ?')
      .get(actual.evento_id, nombre, id)
    if (repetida) return error(c, `Ya existe un tipo de cupo que se llama "${nombre}".`)
  }

  const precio = cuerpo.precio !== undefined ? entero(cuerpo.precio) : actual.precio
  if (precio === null || precio < 0) return error(c, 'El precio no puede quedar vacío.')

  db.prepare('UPDATE categorias SET nombre = ?, precio = ?, orden = ?, archivada = ? WHERE id = ?').run(
    nombre,
    precio,
    cuerpo.orden !== undefined ? entero(cuerpo.orden) : actual.orden,
    cuerpo.archivada !== undefined ? (cuerpo.archivada ? 1 : 0) : actual.archivada,
    id,
  )
  return c.json({ ok: true })
})

/** Cuántas personas cambiarían de precio. Solo cuenta, no toca nada. */
rutasEventos.get('/categorias/:id/afectadas', (c) => {
  const id = Number(c.req.param('id'))
  if (!categoria(id)) return error(c, 'No encontré ese tipo de cupo.', 404)
  return c.json(inscripcionesAfectadas(id))
})

rutasEventos.post('/categorias/:id/aplicar-precio', (c) => {
  const id = Number(c.req.param('id'))
  if (!categoria(id)) return error(c, 'No encontré ese tipo de cupo.', 404)
  return c.json(aplicarPrecioDeCategoria(id))
})
