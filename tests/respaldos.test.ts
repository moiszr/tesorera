import { afterAll, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync, utimesSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Database from 'better-sqlite3'

const raiz = mkdtempSync(join(tmpdir(), 'tesorera-respaldo-'))
process.env.TESORERA_RAIZ = raiz
process.env.TESORERA_DB = join(raiz, 'data', 'tesorera.db')
const { conectar, cerrar } = await import('../server/db/conexion')
const { hacerRespaldo } = await import('../server/db/respaldo')

afterAll(() => {
  cerrar()
  rmSync(raiz, { recursive: true, force: true })
})

it('el respaldo incluye cambios confirmados en WAL sin cerrar la aplicación', () => {
  const db = conectar()
  db.pragma('wal_autocheckpoint = 0')
  db.exec(`CREATE TABLE prueba_respaldo (id INTEGER PRIMARY KEY, monto INTEGER);
    INSERT INTO prueba_respaldo VALUES (1, 125050);`)
  const respaldo = hacerRespaldo()
  expect(respaldo).not.toBeNull()
  const copia = new Database(respaldo!.ruta, { readonly: true })
  try {
    expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
    expect(copia.prepare('SELECT monto FROM prueba_respaldo WHERE id = 1').get()).toEqual({ monto: 125050 })
    expect(copia.prepare('SELECT COUNT(*) AS n FROM migraciones').get()).toEqual({ n: 6 })
    db.prepare('INSERT INTO prueba_respaldo VALUES (2, 500)').run()
    expect(copia.prepare('SELECT COUNT(*) AS n FROM prueba_respaldo').get()).toEqual({ n: 1 })
  } finally {
    copia.close()
  }
})

it('conserva ambos respaldos si se solicitan en el mismo segundo', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-20T12:00:00Z'))
  try {
    const primero = hacerRespaldo()!
    const segundo = hacerRespaldo()!
    expect(segundo.ruta).not.toBe(primero.ruta)
    for (const ruta of [primero.ruta, segundo.ruta]) {
      const copia = new Database(ruta, { readonly: true })
      try {
        expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
      } finally {
        copia.close()
      }
    }
  } finally {
    vi.useRealTimers()
  }
})

it('guarda una copia previa al editar y eliminar pagos y personas', async () => {
  const { Hono } = await import('hono')
  const { rutasPersonas } = await import('../server/rutas/personas')
  const { rutasPagos } = await import('../server/rutas/pagos')
  const { listarRespaldos } = await import('../server/db/respaldo')
  const app = new Hono().route('/', rutasPersonas).route('/', rutasPagos)
  const enviar = (ruta: string, method: string, body: unknown) =>
    app.request(ruta, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const db = conectar()
  const e = Number(db.prepare("INSERT INTO eventos(nombre,activo) VALUES('Prueba',1)").run().lastInsertRowid)
  const c = Number(
    db.prepare("INSERT INTO categorias(evento_id,nombre,precio) VALUES(?,'General',100000)").run(e)
      .lastInsertRowid,
  )
  const p = await (await enviar('/personas', 'POST', { nombre: 'ana respaldo', categoria_id: c })).json()
  const f = await (await app.request(`/personas/${p.id}`)).json()
  const pago = await (
    await enviar('/pagos', 'POST', { inscripcion_id: f.inscripcion.id, monto: 10000 })
  ).json()
  const operaciones = [
    async () => enviar(`/pagos/${pago.id}`, 'PATCH', { ...pago.ficha.pagos[0], monto: 20000 }),
    async () => {
      const f = await (await app.request(`/personas/${p.id}`)).json()
      return enviar(`/pagos/${pago.id}`, 'DELETE', { firma: f.pagos[0].firma })
    },
    async () => {
      const plan = await (await app.request(`/personas/${p.id}/eliminacion`)).json()
      return enviar(`/personas/${p.id}`, 'DELETE', { firma: plan.firma })
    },
  ]
  for (let i = 0; i < operaciones.length; i++) {
    const antes = new Set(listarRespaldos().map((r) => r.nombre))
    expect((await operaciones[i]()).status).toBe(200)
    const nuevo = listarRespaldos().find((r) => !antes.has(r.nombre))!
    expect(nuevo).toBeDefined()
    const copia = new Database(join(raiz, 'data', 'respaldos', nuevo.nombre), { readonly: true })
    try {
      expect(copia.prepare('SELECT id FROM personas WHERE id=?').get(p.id)).toBeDefined()
      if (i < 2)
        expect(copia.prepare('SELECT monto FROM pagos WHERE id=?').get(pago.id)).toEqual({
          monto: i === 0 ? 10000 : 20000,
        })
      expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
    } finally {
      copia.close()
    }
  }
})

it('no elimina ni edita si no puede crear el respaldo previo', async () => {
  const { Hono } = await import('hono')
  const { rutasPersonas } = await import('../server/rutas/personas')
  const { rutasPagos } = await import('../server/rutas/pagos')
  const { fichaPersona } = await import('../server/db/consultas')
  const { revisarEliminarPersona } = await import('../server/db/correcciones')
  const respaldo = await import('../server/db/respaldo')
  const app = new Hono().route('/', rutasPersonas).route('/', rutasPagos)
  app.onError((_e, c) => c.json({ error: 'No se pudo respaldar' }, 500))
  const db = conectar()
  const e = db.prepare('SELECT id FROM eventos WHERE activo=1').get() as any
  const c = db.prepare('SELECT id FROM categorias WHERE evento_id=?').get(e.id) as any
  const id = Number(
    db
      .prepare(
        "INSERT INTO personas(nombre,nombre_busqueda) VALUES('Prueba de respaldo','prueba de respaldo')",
      )
      .run().lastInsertRowid,
  )
  const ins = Number(
    db
      .prepare('INSERT INTO inscripciones(persona_id,evento_id,categoria_id,precio) VALUES(?,?,?,100000)')
      .run(id, e.id, c.id).lastInsertRowid,
  )
  db.prepare('INSERT INTO pagos(inscripcion_id,monto) VALUES(?,10000)').run(ins)
  const pg = fichaPersona(id)!.pagos[0]
  const espia = vi.spyOn(respaldo, 'respaldarAntesDeCorregir').mockImplementation(() => {
    throw new Error('Disco lleno')
  })
  try {
    for (const [url, method, cuerpo] of [
      [`/personas/${id}`, 'DELETE', { firma: revisarEliminarPersona(id).firma }],
      [`/pagos/${pg.id}`, 'DELETE', { firma: pg.firma }],
      [`/pagos/${pg.id}`, 'PATCH', { ...pg, monto: 20000 }],
    ] as const) {
      const r = await app.request(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      })
      expect(r.ok).toBe(false)
      expect(fichaPersona(id)!.cuenta.pagado).toBe(10000)
    }
  } finally {
    espia.mockRestore()
  }
})

it('la rotación diaria no borra el respaldo protegido de la transición', () => {
  const protegida = join(raiz, 'data', 'respaldos', 'tesorera-antes-v1.2.0-prueba.db')
  writeFileSync(protegida, 'copia protegida de prueba')
  utimesSync(protegida, new Date(0), new Date(0))
  for (let i = 0; i < 32; i++) hacerRespaldo()
  expect(existsSync(protegida)).toBe(true)
})
