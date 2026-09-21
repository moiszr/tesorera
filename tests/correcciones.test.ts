import { beforeEach, describe, expect, it } from 'vitest'
import { Hono } from 'hono'
import { formatoNombre } from '../src/lib/nombres'
process.env.TESORERA_DB = ':memory:'
const { conectar, cerrar } = await import('../server/db/conexion')
const { rutasPersonas } = await import('../server/rutas/personas')
const { rutasPagos } = await import('../server/rutas/pagos')
const { rutasDatos } = await import('../server/rutas/datos')
const { revisarEliminarPersona, eliminarPersona, revisarCupo, cambiarCupo } = await import(
  '../server/db/correcciones'
)
const { prepararHabitacion, guardarHabitacion } = await import('../server/db/habitaciones')
const { fichaPersona, resumen, categoriasDeEvento, inscripcionesAfectadas, aplicarPrecioDeCategoria } =
  await import('../server/db/consultas')
const { informe } = await import('../server/db/informes')
let db: ReturnType<typeof conectar>
let evento: number, cat: number, sinCama: number, iglesia: number
const app = new Hono().route('/', rutasPersonas).route('/', rutasPagos).route('/', rutasDatos)
const peticion = (url: string, method: string, body?: unknown) =>
  app.request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
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
  sinCama = Number(
    db
      .prepare(
        "INSERT INTO categorias(evento_id,nombre,precio,incluye_alojamiento) VALUES(?,'Sin alojamiento',200000,0)",
      )
      .run(evento).lastInsertRowid,
  )
  iglesia = Number(db.prepare("INSERT INTO iglesias(nombre) VALUES('Central')").run().lastInsertRowid)
})
async function persona(nombre = 'ana pérez') {
  const res = await peticion('/personas', 'POST', { nombre, categoria_id: cat, iglesia_id: iglesia })
  expect(res.status).toBe(201)
  const { id } = await res.json()
  return fichaPersona(id)!
}
async function pago(p: any, monto = 100000, fecha = '2026-09-21') {
  const res = await peticion('/pagos', 'POST', {
    inscripcion_id: p.inscripcion.id,
    monto,
    fecha,
    metodo: 'efectivo',
  })
  expect(res.status).toBe(201)
  return (await res.json()).ficha.pagos.find((p: any) => p.monto === monto && p.fecha === fecha)
}
function habitacion(personas: any[]) {
  const datos = {
    nombre: 'Familia Pérez',
    capacidad: 6,
    categoria_privada_id: cat,
    integrantes: personas.map((p) => p.inscripcion.id),
  }
  return guardarHabitacion(datos, prepararHabitacion(datos).firma).id
}

describe('corregir pagos sin duplicarlos', () => {
  it('edita monto, fecha, forma y nota; actualiza cuenta, iglesia, reporte y comprobante', async () => {
    const p = await persona()
    const pg = await pago(p)
    const r = await peticion(`/pagos/${pg.id}`, 'PATCH', {
      firma: pg.firma,
      monto: 125050,
      fecha: '2026-09-15',
      metodo: 'transferencia',
      nota: 'Corregido',
    })
    expect(r.status).toBe(200)
    expect((await r.json()).ficha.cuenta).toMatchObject({ pagado: 125050, balance: 324950 })
    expect(db.prepare('SELECT COUNT(*) n FROM pagos').get()).toEqual({ n: 1 })
    expect(informe().iglesias[0].recaudado).toBe(125050)
    expect(informe({ desde: '2026-09-20' }).totales.periodo).toBe(0)
    const recibo = await (await app.request(`/pagos/${pg.id}/comprobante`)).json()
    expect(recibo.pago).toMatchObject({
      monto: 125050,
      fecha: '2026-09-15',
      metodo: 'transferencia',
      nota: 'Corregido',
    })
  })
  it('rechaza edición y eliminación desde una cuenta obsoleta', async () => {
    const p = await persona()
    const pg = await pago(p)
    db.prepare('UPDATE pagos SET monto=200000 WHERE id=?').run(pg.id)
    expect((await peticion(`/pagos/${pg.id}`, 'DELETE', { firma: pg.firma })).status).toBe(409)
    expect((await peticion(`/pagos/${pg.id}`, 'PATCH', { ...pg, monto: 300000 })).status).toBe(409)
    expect(fichaPersona(p.persona.id)!.cuenta.pagado).toBe(200000)
  })
  it('elimina pagos válidos y anulados y deja de servir el comprobante', async () => {
    const p = await persona()
    const pg = await pago(p)
    expect((await peticion(`/pagos/${pg.id}`, 'DELETE', { firma: pg.firma })).status).toBe(200)
    expect((await app.request(`/pagos/${pg.id}/comprobante`)).status).toBe(404)
    expect(informe().totales.recaudado).toBe(0)
    const otro = await pago(p)
    expect(otro.id).toBeGreaterThan(pg.id)
    await peticion(`/pagos/${otro.id}/anular`, 'POST', {})
    const anulado = fichaPersona(p.persona.id)!.pagos[0]
    expect((await peticion(`/pagos/${otro.id}`, 'DELETE', { firma: anulado.firma })).status).toBe(200)
    expect(fichaPersona(p.persona.id)!.pagos).toHaveLength(0)
  })
  it('rechaza centavos fraccionarios, montos inseguros, fechas inexistentes y métodos inválidos', async () => {
    const p = await persona()
    const pg = await pago(p)
    for (const cambio of [
      { monto: 10.5 },
      { monto: Number.MAX_SAFE_INTEGER + 1 },
      { monto: 0 },
      { monto: -100 },
      { fecha: '2026-02-30' },
      { metodo: 'tarjeta' },
    ]) {
      expect((await peticion(`/pagos/${pg.id}`, 'PATCH', { ...pg, ...cambio })).status).toBe(400)
      expect((await peticion('/pagos', 'POST', { ...pg, ...cambio })).status).toBe(400)
    }
    expect(fichaPersona(p.persona.id)!.cuenta.pagado).toBe(100000)
  })
  it('ordena el acumulado del comprobante por fecha corregida, sin sumar pagos posteriores', async () => {
    const p = await persona()
    const primero = await pago(p, 10000, '2026-09-20')
    await pago(p, 20000, '2026-09-01')
    const r = await (await app.request(`/pagos/${primero.id}/comprobante`)).json()
    expect(r.acumulado_a_la_fecha).toBe(30000)
  })
})

describe('eliminar una persona completa', () => {
  it('quita persona, todos sus pagos e inscripciones de varios eventos y libera/reparte su habitación', async () => {
    const a = await persona()
    const b = await persona('beatriz cruz')
    const c = await persona('carmen lópez')
    await pago(a)
    const h = habitacion([a, b, c])
    const anterior = Number(
      db.prepare("INSERT INTO eventos(nombre) VALUES('Anterior')").run().lastInsertRowid,
    )
    const ca = Number(
      db.prepare("INSERT INTO categorias(evento_id,nombre,precio) VALUES(?,'General',10000)").run(anterior)
        .lastInsertRowid,
    )
    const ins = Number(
      db
        .prepare('INSERT INTO inscripciones(persona_id,evento_id,categoria_id,precio) VALUES(?,?,?,10000)')
        .run(a.persona.id, anterior, ca).lastInsertRowid,
    )
    db.prepare('INSERT INTO pagos(inscripcion_id,monto,anulado) VALUES(?,5000,1)').run(ins)
    const plan = revisarEliminarPersona(a.persona.id)
    expect(plan).toMatchObject({ pagos: 2, eventos: 2, pagado: 100000 })
    expect(plan.habitaciones[0].integrantes.filter((p) => !p.sale).map((p) => p.extra)).toEqual([
      50000, 50000,
    ])
    expect((await peticion(`/personas/${a.persona.id}`, 'DELETE', { firma: plan.firma })).status).toBe(200)
    expect(fichaPersona(a.persona.id)).toBeNull()
    expect(db.prepare('SELECT * FROM pagos').all()).toHaveLength(0)
    expect(db.prepare('SELECT * FROM inscripciones WHERE persona_id=?').all(a.persona.id)).toHaveLength(0)
    expect(fichaPersona(b.persona.id)!.inscripcion).toMatchObject({
      habitacion_id: h,
      extra_habitacion: 50000,
      precio: 450000,
    })
    expect(informe().totales.extra).toBe(100000)
    expect(informe().totales.recaudado).toBe(0)
    expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([])
    expect(JSON.stringify(db.prepare('SELECT detalle FROM cambios_habitaciones').all())).not.toContain(
      'Ana Pérez',
    )
  })
  it('requiere una revisión vigente y no aplica cambios parciales', async () => {
    const a = await persona()
    const b = await persona('beatriz')
    habitacion([a, b])
    const plan = revisarEliminarPersona(a.persona.id)
    await pago(b)
    expect((await peticion(`/personas/${a.persona.id}`, 'DELETE', { firma: plan.firma })).status).toBe(409)
    expect((await peticion(`/personas/${a.persona.id}`, 'DELETE', {})).status).toBe(409)
    expect(fichaPersona(a.persona.id)!.inscripcion!.extra_habitacion).toBe(50000)
  })
  it('deshace todo si falla una operación dentro de la eliminación', async () => {
    const a = await persona()
    const b = await persona('beatriz')
    await pago(a)
    habitacion([a, b])
    db.exec(
      "CREATE TRIGGER impedir_prueba BEFORE DELETE ON personas BEGIN SELECT RAISE(ABORT, 'Prueba'); END;",
    )
    expect(() => eliminarPersona(a.persona.id, revisarEliminarPersona(a.persona.id).firma)).toThrow('Prueba')
    expect(fichaPersona(a.persona.id)!.pagos).toHaveLength(1)
    expect(fichaPersona(b.persona.id)!.inscripcion!.extra_habitacion).toBe(50000)
  })
  it('permite eliminar una archivada y no reutiliza sus enlaces', async () => {
    const a = await persona()
    db.prepare('UPDATE personas SET archivada=1 WHERE id=?').run(a.persona.id)
    eliminarPersona(a.persona.id, revisarEliminarPersona(a.persona.id).firma)
    const b = await persona('otra persona')
    expect(b.persona.id).toBeGreaterThan(a.persona.id)
    expect(b.inscripcion!.id).toBeGreaterThan(a.inscripcion!.id)
    expect((await app.request(`/personas/${a.persona.id}`)).status).toBe(404)
  })
  it('al salir el último integrante conserva una habitación vacía sin extra cobrado', async () => {
    const a = await persona()
    habitacion([a])
    eliminarPersona(a.persona.id, revisarEliminarPersona(a.persona.id).firma)
    expect(informe().totales.extra).toBe(0)
    expect(db.prepare('SELECT extra_total FROM habitaciones').get()).toEqual({ extra_total: 100000 })
  })
})

describe('cupos, precios y personas archivadas', () => {
  it('cambiar al precio del nuevo cupo no lo convierte en personalizado', async () => {
    const a = await persona()
    const pg = await pago(a)
    const datos = { categoria_id: sinCama, precio: 200000 }
    cambiarCupo(a.inscripcion!.id, datos, revisarCupo(a.inscripcion!.id, datos).firma)
    expect(fichaPersona(a.persona.id)!.inscripcion).toMatchObject({
      categoria_id: sinCama,
      precio: 200000,
      precio_a_mano: 0,
    })
    expect(fichaPersona(a.persona.id)!.pagos[0].id).toBe(pg.id)
    cambiarCupo(a.inscripcion!.id, { precio: 175000 }, undefined)
    expect(fichaPersona(a.persona.id)!.inscripcion!.precio_a_mano).toBe(1)
    cambiarCupo(a.inscripcion!.id, { precio: 200000 }, undefined)
    expect(fichaPersona(a.persona.id)!.inscripcion!.precio_a_mano).toBe(0)
  })
  it('sin alojamiento permite salir y repartir el extra con una sola confirmación, conservando pagos y excedentes', async () => {
    const a = await persona()
    const b = await persona('beatriz')
    habitacion([a, b])
    await pago(a, 300000)
    const datos = { categoria_id: sinCama }
    expect((await peticion(`/inscripciones/${a.inscripcion!.id}`, 'PATCH', datos)).status).toBe(400)
    const plan = revisarCupo(a.inscripcion!.id, datos)
    expect(plan.excedente).toBe(100000)
    expect(
      (await peticion(`/inscripciones/${a.inscripcion!.id}`, 'PATCH', { ...datos, firma: plan.firma }))
        .status,
    ).toBe(200)
    expect(fichaPersona(a.persona.id)!.inscripcion).toMatchObject({
      habitacion_id: null,
      extra_habitacion: 0,
      precio: 200000,
    })
    expect(fichaPersona(b.persona.id)!.inscripcion!.extra_habitacion).toBe(100000)
    expect(fichaPersona(a.persona.id)!.cuenta.excedente).toBe(100000)
  })
  it('no sobrescribe un cupo editado en otra ventana ni asigna uno archivado', async () => {
    const a = await persona()
    const datos = { categoria_id: sinCama }
    const plan = revisarCupo(a.inscripcion!.id, datos)
    await pago(a)
    expect(() => cambiarCupo(a.inscripcion!.id, datos, plan.firma)).toThrow('cambiaron')
    db.prepare('UPDATE categorias SET archivada=1 WHERE id=?').run(sinCama)
    expect(() => revisarCupo(a.inscripcion!.id, datos)).toThrow('disponible')
  })
  it('excluye archivadas de inicio, iglesias, cupos, reportes y todas sus descargas', async () => {
    const a = await persona('ana retirada')
    const b = await persona('beatriz activa')
    await pago(a, 100000)
    await pago(b, 200000)
    db.prepare('UPDATE personas SET archivada=1 WHERE id=?').run(a.persona.id)
    expect(resumen().totales).toMatchObject({ inscritos: 1, recaudado_real: 200000, pendiente: 250000 })
    expect(resumen().ultimos_pagos.map((p) => p.persona_id)).toEqual([b.persona.id])
    expect(informe().iglesias[0]).toMatchObject({ personas: 1, recaudado: 200000 })
    expect(categoriasDeEvento(evento).find((c) => c.id === cat)!.inscritos).toBe(1)
    for (const ruta of [
      '/exportar.csv',
      '/reporte.csv',
      '/reporte.csv?tipo=pagos',
      '/reporte.csv?tipo=pendientes',
      '/reporte.csv?tipo=habitaciones',
    ])
      expect(await (await app.request(ruta)).text()).not.toContain('Ana Retirada')
    db.prepare('UPDATE categorias SET precio=500000 WHERE id=?').run(cat)
    expect(inscripcionesAfectadas(cat).cuantas).toBe(1)
    aplicarPrecioDeCategoria(cat)
    expect(fichaPersona(a.persona.id)!.inscripcion!.precio).toBe(450000)
    expect(
      (await peticion('/pagos', 'POST', { inscripcion_id: a.inscripcion!.id, monto: 1000 })).status,
    ).toBe(400)
    await peticion(`/personas/${a.persona.id}`, 'PATCH', { archivada: 0 })
    expect(informe().totales.recaudado).toBe(300000)
  })
  it('capitaliza nombres y apellidos al crear y editar, incluidas tildes y apellidos compuestos', async () => {
    expect(formatoNombre("  josé   maría pérez-gómez d'ávila  ")).toBe("José María Pérez-Gómez D'Ávila")
    const a = await persona('ángela núñez')
    expect(a.persona.nombre).toBe('Ángela Núñez')
    await peticion(`/personas/${a.persona.id}`, 'PATCH', { nombre: 'maría peña' })
    expect(fichaPersona(a.persona.id)!.persona.nombre).toBe('María Peña')
    const lista = await (await app.request('/personas?buscar=maria%20pena')).json()
    expect(lista.personas).toHaveLength(1)
  })
})

it('un abono adicional invalida la confirmación del saldo al eliminar otro pago', async () => {
  const p = await persona()
  const original = await pago(p)
  await pago(p, 25000)
  const r = await peticion(`/pagos/${original.id}`, 'DELETE', { firma: original.firma })
  expect(r.status).toBe(409)
  expect(fichaPersona(p.persona.id)!.cuenta.pagado).toBe(125000)
})

it('reparte habitaciones de eventos anteriores al eliminar sin tocar el precio de sus compañeros', async () => {
  const a = await persona()
  const b = await persona('beatriz')
  habitacion([a, b])
  db.prepare('UPDATE eventos SET activo=0').run()
  db.prepare("INSERT INTO eventos(nombre,activo) VALUES('Otro evento',1)").run()
  const plan = revisarEliminarPersona(a.persona.id)
  eliminarPersona(a.persona.id, plan.firma)
  expect(fichaPersona(b.persona.id, db, evento)!.inscripcion).toMatchObject({
    extra_habitacion: 100000,
    precio: 450000,
  })
})
