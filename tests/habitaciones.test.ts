import { beforeEach, describe, expect, it } from 'vitest'
process.env.TESORERA_DB = ':memory:'
const { conectar, cerrar } = await import('../server/db/conexion')
const { guardarHabitacion, prepararHabitacion, repartirExtra, listarHabitaciones } = await import(
  '../server/db/habitaciones'
)
const { fichaPersona, listarPersonas, aplicarPrecioDeCategoria } = await import('../server/db/consultas')
const { informe } = await import('../server/db/informes')
const { rutasDatos } = await import('../server/rutas/datos')
const { rutasHabitaciones } = await import('../server/rutas/habitaciones')
const { rutasPersonas } = await import('../server/rutas/personas')
let db: ReturnType<typeof conectar>
let evento: number, cat: number, iglesia: number
let ids: number[], personas: number[]
beforeEach(() => {
  cerrar()
  db = conectar()
  evento = Number(
    db.prepare("INSERT INTO eventos(nombre,activo) VALUES('Convención',1)").run().lastInsertRowid,
  )
  cat = Number(
    db
      .prepare(
        "INSERT INTO categorias(evento_id,nombre,precio,extra_privado) VALUES(?,'Familiar',450000,100000)",
      )
      .run(evento).lastInsertRowid,
  )
  iglesia = Number(db.prepare("INSERT INTO iglesias(nombre) VALUES('Iglesia Central')").run().lastInsertRowid)
  ids = []
  personas = []
  for (let i = 0; i < 6; i++) {
    const p = Number(
      db
        .prepare('INSERT INTO personas(nombre,nombre_busqueda,iglesia_id) VALUES(?,?,?)')
        .run(`Persona ${i}`, `persona ${i}`, i < 3 ? iglesia : null).lastInsertRowid,
    )
    personas.push(p)
    ids.push(
      Number(
        db
          .prepare('INSERT INTO inscripciones(persona_id,evento_id,categoria_id,precio) VALUES(?,?,?,?)')
          .run(p, evento, cat, i === 2 ? 150000 : 450000).lastInsertRowid,
      ),
    )
  }
})
const form = (integrantes = ids.slice(0, 3), nombre = 'Familia Pérez') => ({
  nombre,
  capacidad: 6,
  categoria_privada_id: cat,
  integrantes,
})
function guardar(datos: ReturnType<typeof form> & { id?: number; actualizar_extra?: boolean }) {
  return guardarHabitacion(datos, prepararHabitacion(datos).firma)
}
function pago(id: number, monto: number, fecha = '2026-09-20', anulado = 0) {
  db.prepare('INSERT INTO pagos(inscripcion_id,monto,fecha,anulado) VALUES(?,?,?,?)').run(
    id,
    monto,
    fecha,
    anulado,
  )
}

describe('habitaciones privadas', () => {
  it('reparte exactamente RD$ 1000 entre 2, 3, 4, 5 y 6 personas', () => {
    for (const n of [2, 3, 4, 5, 6]) {
      const partes = [...repartirExtra(100000, ids.slice(0, n)).values()]
      expect(partes.reduce((s, n) => s + n, 0)).toBe(100000)
      expect(Math.max(...partes) - Math.min(...partes)).toBeLessThanOrEqual(1)
    }
    expect([...repartirExtra(100000, ids.slice(0, 3))]).toEqual([
      [ids[0], 33334],
      [ids[1], 33333],
      [ids[2], 33333],
    ])
  })
  it('guarda precio base, extra y saldo por separado sin alterar pagos ni descuentos', () => {
    pago(ids[0], 450000)
    guardar(form())
    expect(fichaPersona(personas[0])!.inscripcion).toMatchObject({ precio: 450000, extra_habitacion: 33334 })
    expect(fichaPersona(personas[0])!.cuenta).toMatchObject({
      precio: 483334,
      pagado: 450000,
      balance: 33334,
      estado: 'abonando',
    })
    expect(fichaPersona(personas[2])!.cuenta.precio).toBe(183333)
    expect(listarPersonas()[0].extra_habitacion).toBe(33334)
    expect(informe().totales.extra).toBe(100000)
  })
  it('un traslado revisa y actualiza los dos repartos atómicamente', () => {
    const a = guardar(form(ids.slice(0, 3), 'A'))
    const b = guardar(form(ids.slice(3), 'B'))
    const datos = { ...form([ids[0], ...ids.slice(3)], 'B'), id: b.id }
    const plan = prepararHabitacion(datos)
    expect(plan.origenes).toEqual(['A'])
    expect(plan.cambios).toHaveLength(6)
    guardarHabitacion(datos, plan.firma)
    expect(fichaPersona(personas[0])!.inscripcion!.habitacion_id).toBe(b.id)
    expect(fichaPersona(personas[1])!.inscripcion!.habitacion_id).toBe(a.id)
    expect(fichaPersona(personas[1])!.inscripcion!.extra_habitacion).toBe(50000)
    expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(25000)
    expect(informe().totales.extra).toBe(200000)
    expect(db.prepare('SELECT id FROM cambios_habitaciones').all()).toHaveLength(3)
  })
  it('rechaza una confirmación obsoleta si alguien pagó después de revisar', () => {
    const datos = form()
    const plan = prepararHabitacion(datos)
    pago(ids[0], 10000)
    expect(() => guardarHabitacion(datos, plan.firma)).toThrow('Las cuentas cambiaron')
    expect(listarHabitaciones().habitaciones).toHaveLength(0)
    expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(0)
  })
  it('no cobra dos veces y conserva el extra ante cambios del cupo', () => {
    const datos = form()
    const plan = prepararHabitacion(datos)
    const h = guardarHabitacion(datos, plan.firma)
    expect(() => guardarHabitacion(datos, plan.firma)).toThrow()
    db.prepare('UPDATE categorias SET extra_privado=200000,precio=460000 WHERE id=?').run(cat)
    aplicarPrecioDeCategoria(cat)
    expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(33334)
    expect(prepararHabitacion({ ...datos, id: h.id }).destino.extra_total).toBe(100000)
    expect(prepararHabitacion({ ...datos, id: h.id, actualizar_extra: true }).destino.extra_total).toBe(
      200000,
    )
  })
  it('retirar integrantes libera su habitación y extra; permite excedentes visibles', () => {
    const datos = form()
    const h = guardar(datos)
    pago(ids[0], 500000)
    guardar({ ...datos, id: h.id, integrantes: [] })
    const p = fichaPersona(personas[0])!
    expect(p.inscripcion!.habitacion_id).toBeNull()
    expect(p.inscripcion!.extra_habitacion).toBe(0)
    expect(p.cuenta.excedente).toBe(50000)
    expect(p.pagos).toHaveLength(1)
  })
  it('rechaza capacidad insuficiente, duplicados, archivadas y personas de otro evento', () => {
    expect(() => prepararHabitacion({ ...form(), capacidad: 2 })).toThrow('espacios')
    expect(() => prepararHabitacion(form([ids[0], ids[0]]))).toThrow('integrantes')
    db.prepare('UPDATE personas SET archivada=1 WHERE id=?').run(personas[0])
    expect(() => prepararHabitacion(form())).toThrow('disponible')
    const otro = Number(db.prepare("INSERT INTO eventos(nombre) VALUES('Otro')").run().lastInsertRowid)
    db.prepare('UPDATE inscripciones SET evento_id=? WHERE id=?').run(otro, ids[1])
    expect(() => prepararHabitacion(form([ids[1]]))).toThrow('disponible')
  })
  it('no permite archivar una habitación ocupada ni ocultar uno de sus integrantes', async () => {
    const h = guardar(form())
    const r = await rutasHabitaciones.request(`/habitaciones/${h.id}/archivo`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archivada: true }),
    })
    expect(r.status).toBe(400)
    const persona = await rutasPersonas.request(`/personas/${personas[0]}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archivada: 1 }),
    })
    expect(persona.status).toBe(400)
  })
})

describe('reportes y cortes de dinero', () => {
  it('filtra cobros por fecha e iglesia sin recortar saldos actuales ni ocultar pagos archivados', () => {
    pago(ids[0], 10000, '2026-09-01')
    pago(ids[0], 20000, '2026-09-20')
    pago(ids[0], 99999, '2026-09-20', 1)
    pago(ids[3], 50000, '2026-09-20')
    db.prepare('UPDATE personas SET archivada=1 WHERE id=?').run(personas[0])
    const r = informe({ desde: '2026-09-20', hasta: '2026-09-20', iglesia })
    expect(r.totales.periodo).toBe(20000)
    expect(r.totales.recaudado).toBe(30000)
    expect(r.anulados).toBe(1)
    expect(r.archivadas).toBe(1)
    expect(r.totales.pendiente).toBe(1020000)
    expect(r.iglesias.reduce((s, g) => s + g.periodo, 0)).toBe(r.totales.periodo)
    expect(r.metodos.reduce((s, m) => s + m.monto, 0)).toBe(r.totales.periodo)
    expect(r.dias.reduce((s, d) => s + d.monto, 0)).toBe(r.totales.periodo)
  })
  it('el excedente no reduce deudas ajenas y el extra sí entra en todos los saldos', () => {
    guardar(form())
    pago(ids[0], 600000)
    const r = informe({ iglesia })
    expect(r.totales.meta).toBe(1150000)
    expect(r.totales.excedente).toBe(116666)
    expect(r.totales.pendiente).toBe(666666)
    expect(r.categorias[0].pendiente).toBe(r.totales.pendiente)
  })
  it('rechaza fechas inválidas o invertidas con un mensaje en español', async () => {
    for (const q of ['desde=2026-09-22&hasta=2026-09-20', 'desde=2026-02-30', 'hasta=2026-99-10']) {
      const r = await rutasDatos.request('/reporte?' + q)
      expect(r.status).toBe(400)
      expect((await r.json()).error).toMatch(/fecha/)
    }
  })
  it('la descarga respeta el corte y conserva tildes, dinero y encabezados', async () => {
    pago(ids[0], 12345, '2026-09-20')
    pago(ids[3], 54321, '2026-09-20')
    const r = await rutasDatos.request(`/reporte.csv?iglesia=${iglesia}&desde=2026-09-20&tipo=pagos`)
    expect(r.status).toBe(200)
    const csv = await r.text()
    expect(csv).toContain('123.45')
    expect(csv).not.toContain('543.21')
    expect(csv).toContain('Convención')
    expect(csv).toContain('Forma de pago')
  })
})

it('los cupos sin alojamiento no ocupan habitaciones ni aparecen por asignar', () => {
  db.prepare('UPDATE categorias SET incluye_alojamiento=0,extra_privado=NULL WHERE id=?').run(cat)
  expect(listarHabitaciones().personas).toHaveLength(0)
  expect(informe().alojamiento.sin_asignar).toHaveLength(0)
  expect(listarPersonas({ habitacion: 'sin' })).toHaveLength(0)
  expect(() => prepararHabitacion({ ...form(), categoria_privada_id: null })).toThrow('disponible')
})

it('no permite quitar alojamiento a un cupo mientras tenga personas ubicadas', async () => {
  guardar(form())
  const { rutasEventos } = await import('../server/rutas/eventos')
  const r = await rutasEventos.request(`/categorias/${cat}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incluye_alojamiento: false }),
  })
  expect(r.status).toBe(400)
  expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(33334)
})

it('el comprobante conserva la cuenta de su evento aunque cambie el evento activo', async () => {
  guardar(form())
  pago(ids[0], 10000)
  const id = (db.prepare('SELECT id FROM pagos LIMIT 1').get() as { id: number }).id
  db.prepare('UPDATE eventos SET activo=0').run()
  db.prepare("INSERT INTO eventos(nombre,activo) VALUES('Evento siguiente',1)").run()
  const { rutasPagos } = await import('../server/rutas/pagos')
  const r = await rutasPagos.request(`/pagos/${id}/comprobante`)
  expect(r.status).toBe(200)
  const comprobante = await r.json()
  expect(comprobante.cuenta.precio).toBe(483334)
  expect(comprobante.cuenta.pagado).toBe(10000)
})

it('permite revisar y retirar una integrante archivada desde otro evento', async () => {
  const datos = form()
  const h = guardar(datos)
  db.prepare('UPDATE eventos SET activo=0').run()
  const nuevo = Number(
    db.prepare("INSERT INTO eventos(nombre,activo) VALUES('Nuevo',1)").run().lastInsertRowid,
  )
  const r = await rutasPersonas.request(`/personas/${personas[0]}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archivada: true }),
  })
  expect(r.status).toBe(200)
  db.prepare('UPDATE eventos SET activo=0 WHERE id=?').run(nuevo)
  db.prepare('UPDATE eventos SET activo=1 WHERE id=?').run(evento)
  expect(listarHabitaciones().personas.find((p) => p.id === personas[0])?.archivada).toBe(1)
  expect(() => prepararHabitacion({ ...form([ids[0]], 'Otra') })).toThrow('archivada')
  guardar({ ...datos, id: h.id, integrantes: ids.slice(1, 3) })
  expect(fichaPersona(personas[0])!.inscripcion!.habitacion_id).toBeNull()
  expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(0)
  expect(fichaPersona(personas[1])!.inscripcion!.extra_habitacion).toBe(50000)
})

it('aplicar precio considera pendiente el suplemento aunque el precio base esté pagado', () => {
  guardar(form())
  pago(ids[0], 450000)
  db.prepare('UPDATE categorias SET precio=460000 WHERE id=?').run(cat)
  aplicarPrecioDeCategoria(cat)
  expect(fichaPersona(personas[0])!.inscripcion!.precio).toBe(460000)
  expect(fichaPersona(personas[0])!.inscripcion!.extra_habitacion).toBe(33334)
  expect(fichaPersona(personas[0])!.cuenta.balance).toBe(43334)
})
