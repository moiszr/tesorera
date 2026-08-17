import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import { listarIglesias, listarPastores, normalizar } from '../db/consultas'
import { error, texto } from './ayuda'

export const rutasIglesias = new Hono()

/**
 * La paleta de etiquetas de iglesia. Vive también en src/components/Piezas.ts;
 * aquí solo hace falta la lista de claves para repartirlas.
 */
const COLORES = ['purpura', 'rosa', 'cyan', 'pizarra', 'ciruela', 'grafito']

/**
 * Devuelve el color que menos iglesias están usando. Con empate, se elige al
 * azar entre los empatados para que dos iglesias creadas seguidas no salgan
 * siempre en el mismo orden de paleta.
 */
function colorMenosUsado(db: ReturnType<typeof conectar>): string {
  const filas = db.prepare('SELECT color, COUNT(*) AS n FROM iglesias GROUP BY color').all() as any[]
  const uso = new Map<string, number>(COLORES.map((c) => [c, 0]))
  for (const f of filas) if (uso.has(f.color)) uso.set(f.color, f.n as number)

  const minimo = Math.min(...uso.values())
  const candidatos = [...uso.entries()].filter(([, n]) => n === minimo).map(([c]) => c)
  return candidatos[Math.floor(Math.random() * candidatos.length)]
}

rutasIglesias.get('/iglesias', (c) => c.json(listarIglesias()))
rutasIglesias.get('/pastores', (c) => c.json(listarPastores()))

rutasIglesias.post('/iglesias', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const nombre = String(cuerpo.nombre ?? '').trim()
  if (!nombre) return error(c, 'Escribe el nombre de la iglesia.')

  const db = conectar()
  const repetida = db.prepare('SELECT id FROM iglesias WHERE nombre = ? COLLATE NOCASE').get(nombre)
  if (repetida) return error(c, `Ya existe una iglesia que se llama "${nombre}".`)

  const pastor = texto(cuerpo.pastor)
  // Si ella elige color, manda el suyo. Si no, se le asigna el menos usado,
  // así no salen tres iglesias del mismo color mientras otros no se usan.
  const color = texto(cuerpo.color) ?? colorMenosUsado(db)
  const res = db
    .prepare('INSERT INTO iglesias (nombre, color, pastor, pastor_busqueda) VALUES (?, ?, ?, ?)')
    .run(nombre, color, pastor, pastor ? normalizar(pastor) : '')
  return c.json({ id: Number(res.lastInsertRowid), color }, 201)
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

  const pastor = cuerpo.pastor !== undefined ? texto(cuerpo.pastor) : actual.pastor
  db.prepare(
    'UPDATE iglesias SET nombre = ?, color = ?, pastor = ?, pastor_busqueda = ?, archivada = ? WHERE id = ?',
  ).run(
    nombre,
    cuerpo.color !== undefined ? String(cuerpo.color) : actual.color,
    pastor,
    pastor ? normalizar(pastor) : '',
    cuerpo.archivada !== undefined ? (cuerpo.archivada ? 1 : 0) : actual.archivada,
    id,
  )
  return c.json({ ok: true })
})
