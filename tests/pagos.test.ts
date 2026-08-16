/**
 * Pruebas sobre una base real en memoria: lo que de verdad importa es que el
 * saldo cuadre después de anular, y que aplicar un precio nuevo no pise a nadie
 * que ya pagó completo ni a quien tiene beca.
 */
import { beforeEach, describe, expect, it } from 'vitest'

process.env.TESORERA_DB = ':memory:'

const { conectar, cerrar } = await import('../server/db/conexion')
const {
  aplicarPrecioDeCategoria,
  fichaPersona,
  inscripcionesAfectadas,
  listarPastores,
  listarPersonas,
  resumen,
} = await import('../server/db/consultas')

let db: ReturnType<typeof conectar>
let eventoId: number
let catFamiliar: number
let catNino: number

function crearPersona(nombre: string, categoriaId: number, precio: number, aMano = 0) {
  const personaId = Number(
    db
      .prepare('INSERT INTO personas (nombre, nombre_busqueda) VALUES (?, ?)')
      .run(nombre, nombre.toLowerCase()).lastInsertRowid,
  )
  const inscripcionId = Number(
    db
      .prepare(
        'INSERT INTO inscripciones (persona_id, evento_id, categoria_id, precio, precio_a_mano) VALUES (?, ?, ?, ?, ?)',
      )
      .run(personaId, eventoId, categoriaId, precio, aMano).lastInsertRowid,
  )
  return { personaId, inscripcionId }
}

function pagar(inscripcionId: number, monto: number) {
  return Number(
    db
      .prepare("INSERT INTO pagos (inscripcion_id, monto, fecha) VALUES (?, ?, '2026-08-01')")
      .run(inscripcionId, monto).lastInsertRowid,
  )
}

beforeEach(() => {
  cerrar()
  db = conectar()
  db.prepare('DELETE FROM pagos').run()
  db.prepare('DELETE FROM inscripciones').run()
  db.prepare('DELETE FROM personas').run()
  db.prepare('DELETE FROM categorias').run()
  db.prepare('DELETE FROM eventos').run()
  db.prepare('DELETE FROM iglesias').run()

  eventoId = Number(
    db.prepare("INSERT INTO eventos (nombre, activo) VALUES ('Convención de prueba', 1)").run().lastInsertRowid,
  )
  catFamiliar = Number(
    db
      .prepare("INSERT INTO categorias (evento_id, nombre, precio, orden) VALUES (?, 'Adulto — familiar', 450000, 1)")
      .run(eventoId).lastInsertRowid,
  )
  catNino = Number(
    db
      .prepare("INSERT INTO categorias (evento_id, nombre, precio, orden) VALUES (?, 'Niño', 150000, 2)")
      .run(eventoId).lastInsertRowid,
  )
})

describe('abonos y estado', () => {
  it('suma los abonos y calcula lo que falta', () => {
    const { personaId, inscripcionId } = crearPersona('Ana Mercedes', catFamiliar, 450000)
    pagar(inscripcionId, 100000)
    pagar(inscripcionId, 150000)

    const ficha = fichaPersona(personaId)!
    expect(ficha.cuenta.pagado).toBe(250000)
    expect(ficha.cuenta.balance).toBe(200000)
    expect(ficha.cuenta.estado).toBe('abonando')
  })

  it('un pago anulado deja de contar y el saldo se corrige', () => {
    const { personaId, inscripcionId } = crearPersona('Pedro Antonio', catFamiliar, 450000)
    pagar(inscripcionId, 300000)
    const malo = pagar(inscripcionId, 150000)

    expect(fichaPersona(personaId)!.cuenta.estado).toBe('pagado')

    db.prepare("UPDATE pagos SET anulado = 1, nota_anulacion = 'Me equivoqué' WHERE id = ?").run(malo)

    const ficha = fichaPersona(personaId)!
    expect(ficha.cuenta.pagado).toBe(300000)
    expect(ficha.cuenta.balance).toBe(150000)
    expect(ficha.cuenta.estado).toBe('abonando')
  })

  it('el pago anulado sigue existiendo en el historial', () => {
    const { personaId, inscripcionId } = crearPersona('Rosa Elena', catNino, 150000)
    const malo = pagar(inscripcionId, 50000)
    db.prepare('UPDATE pagos SET anulado = 1 WHERE id = ?').run(malo)

    const ficha = fichaPersona(personaId)!
    expect(ficha.pagos).toHaveLength(1)
    expect(ficha.pagos[0].anulado).toBe(1)
    expect(ficha.cuenta.pagado).toBe(0)
  })

  it('avisa del excedente cuando paga de más', () => {
    const { personaId, inscripcionId } = crearPersona('Juan Bautista', catNino, 150000)
    pagar(inscripcionId, 200000)

    const ficha = fichaPersona(personaId)!
    expect(ficha.cuenta.excedente).toBe(50000)
    expect(ficha.cuenta.balance).toBe(0)
    expect(ficha.cuenta.estado).toBe('pagado')
  })
})

describe('precio del tipo de cupo', () => {
  it('la inscripción guarda la foto del precio, no lo sigue', () => {
    const { personaId } = crearPersona('Carmen Julia', catFamiliar, 450000)
    db.prepare('UPDATE categorias SET precio = 500000 WHERE id = ?').run(catFamiliar)

    // Cambiar el precio del tipo de cupo NO toca a nadie por su cuenta.
    expect(fichaPersona(personaId)!.cuenta.precio).toBe(450000)
  })

  it('aplicar el precio nuevo alcanza solo a quien no ha pagado completo', () => {
    const sinPagar = crearPersona('Sin pagar', catFamiliar, 450000)
    const aMedias = crearPersona('A medias', catFamiliar, 450000)
    pagar(aMedias.inscripcionId, 100000)
    const completo = crearPersona('Ya pagó', catFamiliar, 450000)
    pagar(completo.inscripcionId, 450000)
    const beca = crearPersona('Con beca', catFamiliar, 200000, 1)

    db.prepare('UPDATE categorias SET precio = 500000 WHERE id = ?').run(catFamiliar)

    const aviso = inscripcionesAfectadas(catFamiliar)
    expect(aviso.cuantas).toBe(2)
    expect(aviso.precio).toBe(500000)

    const r = aplicarPrecioDeCategoria(catFamiliar)
    expect(r.cambiadas).toBe(2)

    expect(fichaPersona(sinPagar.personaId)!.cuenta.precio).toBe(500000)
    expect(fichaPersona(aMedias.personaId)!.cuenta.precio).toBe(500000)
    // Quien ya pagó completo no cambia: su cuenta quedó cerrada.
    expect(fichaPersona(completo.personaId)!.cuenta.precio).toBe(450000)
    // La beca tampoco: su precio se puso a mano.
    expect(fichaPersona(beca.personaId)!.cuenta.precio).toBe(200000)
  })

  it('aplicar dos veces seguidas no cambia nada la segunda vez', () => {
    crearPersona('Alguien', catNino, 150000)
    db.prepare('UPDATE categorias SET precio = 180000 WHERE id = ?').run(catNino)

    expect(aplicarPrecioDeCategoria(catNino).cambiadas).toBe(1)
    expect(aplicarPrecioDeCategoria(catNino).cambiadas).toBe(0)
    expect(inscripcionesAfectadas(catNino).cuantas).toBe(0)
  })
})

describe('búsqueda y totales', () => {
  it('encuentra sin tildes y sin importar mayúsculas', () => {
    crearPersona('José Ramón Núñez', catFamiliar, 450000)
    crearPersona('Ana Mercedes', catNino, 150000)

    expect(listarPersonas({ buscar: 'jose' }).map((p) => p.nombre)).toEqual(['José Ramón Núñez'])
    expect(listarPersonas({ buscar: 'NUÑEZ' })).toHaveLength(1)
    expect(listarPersonas({ buscar: 'nunez' })).toHaveLength(1)
    expect(listarPersonas({ buscar: 'zzz' })).toHaveLength(0)
  })

  it('los totales del evento cuadran con la lista de personas', () => {
    const a = crearPersona('Uno', catFamiliar, 450000)
    const b = crearPersona('Dos', catNino, 150000)
    pagar(a.inscripcionId, 200000)
    pagar(b.inscripcionId, 150000)

    const r = resumen()
    const personas = listarPersonas({})

    expect(r.totales!.meta).toBe(personas.reduce((s, p) => s + p.precio, 0))
    expect(r.totales!.recaudado_real).toBe(personas.reduce((s, p) => s + p.pagado, 0))
    expect(r.totales!.pendiente).toBe(personas.reduce((s, p) => s + p.balance, 0))
    expect(r.totales!.inscritos).toBe(2)
    expect(r.totales!.pagados).toBe(1)
    expect(r.totales!.abonando).toBe(1)
  })

  it('el reporte cuadra aunque alguien haya pagado de más', () => {
    // Este es el caso que rompía el reporte: si "lo que falta" de un grupo se
    // calcula como (meta − recaudado), el excedente de uno le tapa la deuda de
    // otro y la columna Falta ya no suma el total. Se suma persona por persona.
    const iglesiaA = Number(
      db.prepare("INSERT INTO iglesias (nombre) VALUES ('Iglesia A')").run().lastInsertRowid,
    )
    const paga = crearPersona('Paga de más', catNino, 150000)
    db.prepare('UPDATE personas SET iglesia_id = ? WHERE id = ?').run(iglesiaA, paga.personaId)
    pagar(paga.inscripcionId, 300000) // 150,000 de excedente

    const debe = crearPersona('Debe todo', catFamiliar, 450000)
    db.prepare('UPDATE personas SET iglesia_id = ? WHERE id = ?').run(iglesiaA, debe.personaId)

    const r = resumen()
    const grupo = r.iglesias.find((g) => g.nombre === 'Iglesia A')!

    // Restar agregados daría 600,000 − 300,000 = 300,000. Lo correcto es 450,000.
    expect(grupo.pendiente).toBe(450000)
    expect(r.iglesias.reduce((s, g) => s + g.pendiente, 0)).toBe(r.totales!.pendiente)
    expect(r.categorias.reduce((s, c) => s + c.pendiente, 0)).toBe(r.totales!.pendiente)
    expect(r.iglesias.reduce((s, g) => s + g.recaudado, 0)).toBe(r.totales!.recaudado_real)
  })

  it('filtrar por pastor junta a la gente de TODAS sus iglesias', () => {
    // Este es el motivo de que el filtro por pastor exista: si cada pastor
    // tuviera una sola iglesia, filtrar por pastor sería filtrar por iglesia.
    const iglesiaA = Number(
      db
        .prepare("INSERT INTO iglesias (nombre, pastor, pastor_busqueda) VALUES ('Central', 'Ramón Guzmán', 'ramon guzman')")
        .run().lastInsertRowid,
    )
    const iglesiaB = Number(
      db
        .prepare("INSERT INTO iglesias (nombre, pastor, pastor_busqueda) VALUES ('Anexo', 'Ramón Guzmán', 'ramon guzman')")
        .run().lastInsertRowid,
    )
    const otra = Number(
      db
        .prepare("INSERT INTO iglesias (nombre, pastor, pastor_busqueda) VALUES ('Monte Sinaí', 'Wilfredo Peña', 'wilfredo pena')")
        .run().lastInsertRowid,
    )

    const a = crearPersona('De Central', catNino, 150000)
    const b = crearPersona('De Anexo', catNino, 150000)
    const c = crearPersona('De Monte Sinaí', catNino, 150000)
    db.prepare('UPDATE personas SET iglesia_id = ? WHERE id = ?').run(iglesiaA, a.personaId)
    db.prepare('UPDATE personas SET iglesia_id = ? WHERE id = ?').run(iglesiaB, b.personaId)
    db.prepare('UPDATE personas SET iglesia_id = ? WHERE id = ?').run(otra, c.personaId)

    const delPastor = listarPersonas({ pastor: 'Ramón Guzmán' }).map((p) => p.nombre)
    expect(delPastor.sort()).toEqual(['De Anexo', 'De Central'])

    // Filtrar por una sola de sus iglesias devuelve menos: no son lo mismo.
    expect(listarPersonas({ iglesia: iglesiaA })).toHaveLength(1)

    // Se agrupa sin importar tildes ni mayúsculas.
    expect(listarPersonas({ pastor: 'ramon guzman' })).toHaveLength(2)
    expect(listarPersonas({ pastor: 'RAMÓN GUZMÁN' })).toHaveLength(2)

    const pastores = listarPastores()
    expect(pastores.find((p) => p.nombre === 'Ramón Guzmán')?.iglesias).toBe(2)
    expect(pastores.find((p) => p.nombre === 'Wilfredo Peña')?.iglesias).toBe(1)
  })

  it('el orden "los que más deben" pone primero al de mayor saldo', () => {
    const a = crearPersona('Debe poco', catNino, 150000)
    pagar(a.inscripcionId, 140000)
    crearPersona('Debe mucho', catFamiliar, 450000)

    const orden = listarPersonas({ orden: 'menos_pagado' }).map((p) => p.nombre)
    expect(orden[0]).toBe('Debe mucho')
  })
})
