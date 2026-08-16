import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import { listarIglesias } from '../db/consultas'
import { error } from './ayuda'

export const rutasIglesias = new Hono()

rutasIglesias.get('/iglesias', (c) => c.json(listarIglesias()))

rutasIglesias.post('/iglesias', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const nombre = String(cuerpo.nombre ?? '').trim()
  if (!nombre) return error(c, 'Escribe el nombre de la iglesia.')

  const db = conectar()
  const repetida = db.prepare('SELECT id FROM iglesias WHERE nombre = ? COLLATE NOCASE').get(nombre)
  if (repetida) return error(c, `Ya existe una iglesia que se llama "${nombre}".`)

  const res = db
    .prepare('INSERT INTO iglesias (nombre, color) VALUES (?, ?)')
    .run(nombre, String(cuerpo.color ?? 'arcilla'))
  return c.json({ id: Number(res.lastInsertRowid) }, 201)
})

rutasIglesias.patch('/iglesias/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const actual = db.prepare('SELECT * FROM iglesias WHERE id = ?').get(id) as any
  if (!actual) return error(c, 'No encontré esa iglesia.', 404)

  const nombre = cuerpo.nombre !== undefined ? String(cuerpo.nombre).trim() : actual.nombre
  if (!nombre) return error(c, 'El nombre de la iglesia no puede quedar vacío.')

  if (nombre.toLowerCase() !== String(actual.nombre).toLowerCase()) {
    const repetida = db
      .prepare('SELECT id FROM iglesias WHERE nombre = ? COLLATE NOCASE AND id <> ?')
      .get(nombre, id)
    if (repetida) return error(c, `Ya existe una iglesia que se llama "${nombre}".`)
  }

  db.prepare('UPDATE iglesias SET nombre = ?, color = ?, archivada = ? WHERE id = ?').run(
    nombre,
    cuerpo.color !== undefined ? String(cuerpo.color) : actual.color,
    cuerpo.archivada !== undefined ? (cuerpo.archivada ? 1 : 0) : actual.archivada,
    id,
  )
  return c.json({ ok: true })
})
