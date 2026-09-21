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
import { formatoNombre } from '../../src/lib/nombres'
import { respaldarAntesDeCorregir } from '../db/respaldo'
import { proximoId } from '../db/firma'
import { revisarEliminarPersona, eliminarPersona, revisarCupo, cambiarCupo } from '../db/correcciones'
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
    habitacion: q.habitacion === 'sin' ? 'sin' : (entero(q.habitacion) ?? undefined),
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
  const nombre = formatoNombre(texto(cuerpo.nombre) ?? '')
  if (!nombre) return error(c, 'Escribe el nombre de la persona.')

  const db = conectar()
  const evento = eventoActivo(db)
  const categoriaId = entero(cuerpo.categoria_id)

  if (evento) {
    if (categoriaId === null) return error(c, 'Elige el tipo de cupo de esta persona.')
    const cat = db
      .prepare('SELECT * FROM categorias WHERE id = ? AND evento_id = ?')
      .get(categoriaId, evento.id) as any
    if (!cat || cat.archivada) return error(c, 'Elige un tipo de cupo disponible en este evento.')
  }

  const parecida = db
    .prepare('SELECT nombre FROM personas WHERE nombre_busqueda = ? AND archivada = 0')
    .get(normalizar(nombre)) as any

  const id = db.transaction(() => {
    const res = db
      .prepare(
        `INSERT INTO personas (id, nombre, nombre_busqueda, iglesia_id, telefono, notas)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        proximoId('personas', db),
        nombre,
        normalizar(nombre),
        entero(cuerpo.iglesia_id),
        texto(cuerpo.telefono),
        texto(cuerpo.notas),
      )
    const personaId = Number(res.lastInsertRowid)

    if (evento && categoriaId !== null) {
      const cat = db.prepare('SELECT precio FROM categorias WHERE id = ?').get(categoriaId) as any
      db.prepare(
        `INSERT INTO inscripciones (id, persona_id, evento_id, categoria_id, precio)
         VALUES (?, ?, ?, ?, ?)`,
      ).run(proximoId('inscripciones', db), personaId, evento.id, categoriaId, cat.precio)
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

  if (
    cuerpo.archivada &&
    db
      .prepare(
        'SELECT id FROM inscripciones WHERE persona_id = ? AND habitacion_id IS NOT NULL AND evento_id = (SELECT id FROM eventos WHERE activo=1 ORDER BY id DESC LIMIT 1)',
      )
      .get(id)
  ) {
    return error(c, 'Primero retira a esta persona de su habitación y revisa el reparto del extra.')
  }

  const nombre = cuerpo.nombre !== undefined ? formatoNombre(texto(cuerpo.nombre) ?? '') : actual.nombre
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

rutasPersonas.get('/personas/:id/eliminacion', (c) => {
  try {
    return c.json(revisarEliminarPersona(Number(c.req.param('id'))))
  } catch (e) {
    return error(c, (e as Error).message, 404)
  }
})
rutasPersonas.delete('/personas/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  try {
    const plan = revisarEliminarPersona(id)
    if (!cuerpo.firma || cuerpo.firma !== plan.firma)
      return error(c, 'La cuenta cambió. Cierra esta confirmación y vuelve a revisar antes de eliminar.', 409)
    respaldarAntesDeCorregir()
    return c.json(eliminarPersona(id, cuerpo.firma))
  } catch (e) {
    return error(c, (e as Error).message)
  }
})
rutasPersonas.post('/inscripciones/:id/revisar', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  try {
    return c.json(revisarCupo(Number(c.req.param('id')), cuerpo))
  } catch (e) {
    return error(c, (e as Error).message)
  }
})
rutasPersonas.patch('/inscripciones/:id', async (c) => {
  const cuerpo = await c.req.json().catch(() => ({}))
  try {
    return c.json(cambiarCupo(Number(c.req.param('id')), cuerpo, cuerpo.firma))
  } catch (e) {
    return error(c, (e as Error).message)
  }
})

/** Inscribir a alguien que quedó sin inscripción (por ejemplo, evento nuevo). */
rutasPersonas.post('/personas/:id/inscribir', async (c) => {
  const personaId = Number(c.req.param('id'))
  const cuerpo = await c.req.json().catch(() => ({}))
  const db = conectar()
  const evento = eventoActivo(db)
  if (!evento) return error(c, 'Todavía no hay un evento activo.')

  if (!db.prepare('SELECT id FROM personas WHERE id=? AND archivada=0').get(personaId))
    return error(c, 'Devuelve a esta persona a la lista antes de asignarle un cupo.')
  const categoriaId = entero(cuerpo.categoria_id)
  const cat = db
    .prepare('SELECT * FROM categorias WHERE id = ? AND evento_id = ?')
    .get(categoriaId, evento.id) as any
  if (!cat || cat.archivada) return error(c, 'Elige un tipo de cupo disponible para esta persona.')

  if (cuerpo.precio !== undefined && !Number.isSafeInteger(cuerpo.precio))
    return error(c, 'Escribe un precio válido para esta persona.')
  const precio = cuerpo.precio === undefined ? cat.precio : entero(cuerpo.precio)
  if (precio === null || precio < 0) return error(c, 'Escribe un precio válido para esta persona.')

  const ya = db
    .prepare('SELECT id FROM inscripciones WHERE persona_id = ? AND evento_id = ?')
    .get(personaId, evento.id)
  if (ya) return error(c, 'Esta persona ya está inscrita en el evento.')

  const res = db
    .prepare(
      'INSERT INTO inscripciones (id, persona_id, evento_id, categoria_id, precio, precio_a_mano) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(proximoId('inscripciones', db), personaId, evento.id, cat.id, precio, precio !== cat.precio ? 1 : 0)
  return c.json({ id: Number(res.lastInsertRowid) }, 201)
})
