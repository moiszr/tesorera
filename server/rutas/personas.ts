import { Hono } from 'hono'
import { conectar } from '../db/conexion'
import {
  conteos,
  eventoActivo,
  fichaPersona,
  listarPersonas,
  normalizar,
  type FiltrosPersonas,
} from '../db/consultas'
import type { Estado } from '../../src/lib/estados'
import { entero, error, texto } from './ayuda'

export const rutasPersonas = new Hono()

function filtrosDesdeUrl(c: any): FiltrosPersonas {
  const q = c.req.query()
  const orden = q.orden === 'menos_pagado' || q.orden === 'recientes' ? q.orden : 'nombre'
  const estado = ['pagado', 'abonando', 'sinpagos'].includes(q.estado) ? (q.estado as Estado) : undefined
  return {
    buscar: q.buscar ?? '',
    iglesia: entero(q.iglesia) ?? undefined,
    pastor: q.pastor || undefined,
    categoria_id: entero(q.categoria_id) ?? undefined,
    estado,
    orden,
    incluir_archivadas: q.archivadas === '1',
  }
}

rutasPersonas.get('/personas', (c) => {
  const filtros = filtrosDesdeUrl(c)
  return c.json({ personas: listarPersonas(filtros), conteos: conteos(filtros) })
})

rutasPersonas.get('/personas/:id', (c) => {
  const ficha = fichaPersona(Number(c.req.param('id')))
  if (!ficha) return error(c, 'No encontré esa persona.', 404)
  return c.json(ficha)
})

rutasPersonas.post('/personas', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  const nombre = texto(cuerpo.nombre)
  if (!nombre) return error(c, 'Escribe el nombre de la persona.')

  const db = conectar()
  const evento = eventoActivo(db)
  const categoriaId = entero(cuerpo.categoria_id)

  if (evento) {
    if (categoriaId === null) return error(c, 'Elige el tipo de cupo de esta persona.')
    const cat = db
      .prepare('SELECT * FROM categorias WHERE id = ? AND evento_id = ?')
      .get(categoriaId, evento.id) as any
    if (!cat) return error(c, 'Ese tipo de cupo no es de este evento.')
  }

  const parecida = db
    .prepare('SELECT nombre FROM personas WHERE nombre_busqueda = ? AND archivada = 0')
    .get(normalizar(nombre)) as any

  const id = db.transaction(() => {
    const res = db
      .prepare(
        `INSERT INTO personas (nombre, nombre_busqueda, iglesia_id, telefono, notas)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(nombre, normalizar(nombre), entero(cuerpo.iglesia_id), texto(cuerpo.telefono), texto(cuerpo.notas))
    const personaId = Number(res.lastInsertRowid)

    if (evento && categoriaId !== null) {
      const cat = db.prepare('SELECT precio FROM categorias WHERE id = ?').get(categoriaId) as any
      db.prepare(
        `INSERT INTO inscripciones (persona_id, evento_id, categoria_id, precio)
         VALUES (?, ?, ?, ?)`,
      ).run(personaId, evento.id, categoriaId, cat.precio)
    }
    return personaId
  })()

  return c.json({ id, aviso_repetida: parecida ? parecida.nombre : null }, 201)
})

rutasPersonas.patch('/personas/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const actual = db.prepare('SELECT * FROM personas WHERE id = ?').get(id) as any
  if (!actual) return error(c, 'No encontré esa persona.', 404)

  const nombre = cuerpo.nombre !== undefined ? texto(cuerpo.nombre) : actual.nombre
  if (!nombre) return error(c, 'El nombre no puede quedar vacío.')

  db.prepare(
    `UPDATE personas
        SET nombre = ?, nombre_busqueda = ?, iglesia_id = ?, telefono = ?, notas = ?, archivada = ?
      WHERE id = ?`,
  ).run(
    nombre,
    normalizar(nombre),
    cuerpo.iglesia_id !== undefined ? entero(cuerpo.iglesia_id) : actual.iglesia_id,
    cuerpo.telefono !== undefined ? texto(cuerpo.telefono) : actual.telefono,
    cuerpo.notas !== undefined ? texto(cuerpo.notas) : actual.notas,
    cuerpo.archivada !== undefined ? (cuerpo.archivada ? 1 : 0) : actual.archivada,
    id,
  )
  return c.json({ ok: true })
})

/** Cambiar el tipo de cupo o el precio de una inscripción. */
rutasPersonas.patch('/inscripciones/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const actual = db.prepare('SELECT * FROM inscripciones WHERE id = ?').get(id) as any
  if (!actual) return error(c, 'Esta persona no está inscrita en el evento.', 404)

  let categoriaId = actual.categoria_id
  let precio = actual.precio
  let aMano = actual.precio_a_mano

  if (cuerpo.categoria_id !== undefined) {
    const nueva = db
      .prepare('SELECT * FROM categorias WHERE id = ? AND evento_id = ?')
      .get(entero(cuerpo.categoria_id), actual.evento_id) as any
    if (!nueva) return error(c, 'Ese tipo de cupo no es de este evento.')
    categoriaId = nueva.id
    // Solo se arrastra el precio nuevo si nadie lo había tocado a mano.
    if (!actual.precio_a_mano && cuerpo.precio === undefined) precio = nueva.precio
  }

  if (cuerpo.precio !== undefined) {
    const nuevoPrecio = entero(cuerpo.precio)
    if (nuevoPrecio === null || nuevoPrecio < 0) return error(c, 'Escribe un precio válido.')
    if (nuevoPrecio !== actual.precio) aMano = 1
    precio = nuevoPrecio
  }

  if (cuerpo.precio_a_mano !== undefined) aMano = cuerpo.precio_a_mano ? 1 : 0

  db.prepare('UPDATE inscripciones SET categoria_id = ?, precio = ?, precio_a_mano = ? WHERE id = ?').run(
    categoriaId,
    precio,
    aMano,
    id,
  )
  return c.json({ ok: true })
})

/** Inscribir a alguien que quedó sin inscripción (por ejemplo, evento nuevo). */
rutasPersonas.post('/personas/:id/inscribir', async (c) => {
  const personaId = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const evento = eventoActivo(db)
  if (!evento) return error(c, 'Todavía no hay un evento activo.')

  const categoriaId = entero(cuerpo.categoria_id)
  const cat = db
    .prepare('SELECT * FROM categorias WHERE id = ? AND evento_id = ?')
    .get(categoriaId, evento.id) as any
  if (!cat) return error(c, 'Elige el tipo de cupo de esta persona.')

  const ya = db
    .prepare('SELECT id FROM inscripciones WHERE persona_id = ? AND evento_id = ?')
    .get(personaId, evento.id)
  if (ya) return error(c, 'Esta persona ya está inscrita en el evento.')

  const res = db
    .prepare('INSERT INTO inscripciones (persona_id, evento_id, categoria_id, precio) VALUES (?, ?, ?, ?)')
    .run(personaId, evento.id, cat.id, cat.precio)
  return c.json({ id: Number(res.lastInsertRowid) }, 201)
})
