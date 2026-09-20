import type Database from 'better-sqlite3'
import { createHash } from 'node:crypto'
import { conectar } from './conexion'
import { eventoActivo, listarPersonas } from './consultas'
import { calcularBalance } from '../../src/lib/estados'

export type DatosHabitacion = {
  id?: number
  nombre: string
  capacidad: number
  categoria_privada_id: number | null
  actualizar_extra?: boolean
  notas?: string
  integrantes: number[] // IDs de inscripción, nunca de persona.
}

/** Reparte centavos enteros; el resto se asigna por ID, nunca se pierde dinero. */
export function repartirExtra(total: number, ids: number[]) {
  const orden = [...ids].sort((a, b) => a - b)
  return new Map(
    orden.map((id, i) => [id, Math.floor(total / orden.length) + (i < total % orden.length ? 1 : 0)]),
  )
}

export function listarHabitaciones(db: Database.Database = conectar()) {
  const evento = eventoActivo(db)
  const personas = listarPersonas({ incluir_archivadas: true }, db).filter((p) => p.inscripcion_id)
  const habitaciones = db
    .prepare(
      `SELECT h.*, c.nombre AS cupo_privado FROM habitaciones h
    LEFT JOIN categorias c ON c.id = h.categoria_privada_id WHERE h.evento_id = ? ORDER BY h.archivada, h.nombre COLLATE NOCASE`,
    )
    .all(evento?.id ?? -1) as any[]
  return {
    evento,
    habitaciones: habitaciones.map((h) => ({
      ...h,
      integrantes: personas.filter((p) => p.habitacion_id === h.id),
    })),
    personas: personas.filter((p) => (!p.archivada && p.incluye_alojamiento) || p.habitacion_id != null),
  }
}

export function prepararHabitacion(datos: DatosHabitacion, db: Database.Database = conectar()) {
  const evento = eventoActivo(db)
  if (!evento) throw new Error('Primero crea un evento en Ajustes.')
  const nombre = typeof datos.nombre === 'string' ? datos.nombre.trim() : ''
  if (!nombre) throw new Error('Ponle un nombre o número a la habitación.')
  if (!Number.isSafeInteger(datos.capacidad) || datos.capacidad < 1 || datos.capacidad > 100)
    throw new Error('La capacidad debe ser de 1 a 100 personas.')
  if (
    !Array.isArray(datos.integrantes) ||
    datos.integrantes.some((id) => !Number.isSafeInteger(id) || id < 1) ||
    new Set(datos.integrantes).size !== datos.integrantes.length
  )
    throw new Error('Revisa la lista de integrantes.')
  if (datos.integrantes.length > datos.capacidad)
    throw new Error('Hay más integrantes que espacios disponibles.')
  const { habitaciones, personas } = listarHabitaciones(db)
  const actual = datos.id ? habitaciones.find((h) => h.id === datos.id) : null
  if (datos.id && (!actual || actual.archivada))
    throw new Error('Esta habitación ya no está disponible. Vuelve a la lista.')
  if (
    habitaciones.some(
      (h) => h.id !== datos.id && h.nombre.toLocaleLowerCase('es') === nombre.toLocaleLowerCase('es'),
    )
  )
    throw new Error('Ya existe una habitación con ese nombre, incluso entre las archivadas.')
  const elegidas = datos.integrantes.map((id) => {
    const p = personas.find((p) => p.inscripcion_id === id)
    if (!p) throw new Error('Una persona ya no está disponible en este evento. Actualiza la lista.')
    if (p.archivada && p.habitacion_id !== actual?.id)
      throw new Error('Devuelve a la lista a esa persona archivada antes de asignarle otra habitación.')
    return p
  })
  const privada = datos.categoria_privada_id != null
  const cat = privada ? evento.categorias.find((c) => c.id === datos.categoria_privada_id) : null
  const conserva =
    actual && actual.categoria_privada_id === datos.categoria_privada_id && !datos.actualizar_extra
  if (privada && !conserva && (!cat || cat.archivada || cat.extra_privado === null))
    throw new Error('Activa la opción privada de un cupo antes de usarla en una habitación.')
  const extra = privada ? (conserva ? actual.extra_total : cat!.extra_privado!) : 0
  const destino = {
    id: actual?.id ?? 0,
    nombre,
    capacidad: datos.capacidad,
    categoria_privada_id: datos.categoria_privada_id ?? null,
    extra_total: extra,
    notas: typeof datos.notas === 'string' ? datos.notas.trim() : '',
    integrantes: [...datos.integrantes].sort((a, b) => a - b),
  }
  // Un traslado ajusta ambas habitaciones en una sola operación y una sola confirmación.
  const origenes = habitaciones.filter(
    (h) => h.id !== actual?.id && elegidas.some((p) => p.habitacion_id === h.id),
  )
  const repartos = [
    destino,
    ...origenes.map((h) => ({
      ...h,
      integrantes: h.integrantes
        .map((p: any) => p.inscripcion_id)
        .filter((id: number) => !datos.integrantes.includes(id)) as number[],
    })),
  ]
  const afectadas = personas.filter(
    (p) =>
      datos.integrantes.includes(p.inscripcion_id!) ||
      p.habitacion_id === actual?.id ||
      origenes.some((h) => h.id === p.habitacion_id),
  )
  const cambios = afectadas.map((p) => {
    const h = repartos.find((h) => h.integrantes.includes(p.inscripcion_id!))
    const nuevoExtra = h ? repartirExtra(h.extra_total, h.integrantes).get(p.inscripcion_id!)! : 0
    return {
      inscripcion_id: p.inscripcion_id!,
      persona_id: p.id,
      nombre: p.nombre,
      anterior: p.habitacion,
      habitacion: h?.nombre ?? null,
      habitacion_id: h?.id ?? null,
      extra_anterior: p.extra_habitacion,
      extra: nuevoExtra,
      precio_base: p.precio_base,
      total: p.precio_base + nuevoExtra,
      pagado: p.pagado,
      balance: calcularBalance(p.pagado, p.precio_base + nuevoExtra),
    }
  })
  const firma = createHash('sha256')
    .update(
      JSON.stringify({
        evento: evento.id,
        destino,
        cambios,
        revisiones: habitaciones.map((h) => [h.id, h.revision]),
        cat: cat?.extra_privado,
      }),
    )
    .digest('hex')
  return { firma, evento_id: evento.id, destino, cambios, origenes: origenes.map((h) => h.nombre) }
}

export function guardarHabitacion(datos: DatosHabitacion, firma: string, db: Database.Database = conectar()) {
  return db.transaction(() => {
    const plan = prepararHabitacion(datos, db)
    if (!firma || firma !== plan.firma)
      throw new Error('Las cuentas cambiaron. Revisa de nuevo el reparto antes de guardar.')
    const h = plan.destino
    let id = h.id
    if (id)
      db.prepare(
        `UPDATE habitaciones SET nombre=?, capacidad=?, categoria_privada_id=?, extra_total=?, notas=?, revision=revision+1 WHERE id=?`,
      ).run(h.nombre, h.capacidad, h.categoria_privada_id, h.extra_total, h.notas, id)
    else
      id = Number(
        db
          .prepare(
            `INSERT INTO habitaciones(evento_id,nombre,capacidad,categoria_privada_id,extra_total,notas) VALUES (?,?,?,?,?,?)`,
          )
          .run(plan.evento_id, h.nombre, h.capacidad, h.categoria_privada_id, h.extra_total, h.notas)
          .lastInsertRowid,
      )
    for (const c of plan.cambios) {
      db.prepare('UPDATE inscripciones SET habitacion_id=?, extra_habitacion=? WHERE id=?').run(
        c.habitacion_id === 0 ? id : c.habitacion_id,
        c.extra,
        c.inscripcion_id,
      )
    }
    for (const nombre of plan.origenes)
      db.prepare('UPDATE habitaciones SET revision=revision+1 WHERE evento_id=? AND nombre=?').run(
        plan.evento_id,
        nombre,
      )
    db.prepare('INSERT INTO cambios_habitaciones(evento_id,detalle) VALUES (?,?)').run(
      plan.evento_id,
      JSON.stringify({ ...plan, habitacion_id: id }),
    )
    return { id }
  })()
}
