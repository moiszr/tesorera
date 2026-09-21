import type Database from 'better-sqlite3'
import { conectar } from './conexion'
import { repartirExtra } from './habitaciones'
import { firmar } from './firma'
import { calcularBalance } from '../../src/lib/estados'

/** También funciona con habitaciones de eventos anteriores. No depende del evento activo. */
function salidaHabitaciones(ids: number[], db: Database.Database) {
  const salientes = new Set(ids)
  const habitaciones = db.prepare('SELECT * FROM habitaciones ORDER BY id').all() as any[]
  return habitaciones.flatMap((h) => {
    const integrantes = db
      .prepare(
        `SELECT i.*, p.nombre,
      COALESCE((SELECT SUM(monto) FROM pagos WHERE inscripcion_id=i.id AND anulado=0),0) AS pagado
      FROM inscripciones i JOIN personas p ON p.id=i.persona_id WHERE habitacion_id=? ORDER BY i.id`,
      )
      .all(h.id) as any[]
    if (!integrantes.some((i) => salientes.has(i.id))) return []
    const quedan = integrantes.filter((i) => !salientes.has(i.id))
    const reparto = repartirExtra(
      h.extra_total,
      quedan.map((i) => i.id),
    )
    return [
      {
        id: h.id as number,
        nombre: h.nombre as string,
        revision: h.revision as number,
        extra_total: h.extra_total as number,
        integrantes: integrantes.map((i) => ({
          inscripcion_id: i.id as number,
          persona_id: i.persona_id as number,
          nombre: i.nombre as string,
          sale: salientes.has(i.id),
          precio: i.precio as number,
          pagado: i.pagado as number,
          extra_anterior: i.extra_habitacion as number,
          extra: reparto.get(i.id) ?? 0,
          pendiente: calcularBalance(i.pagado, i.precio + (reparto.get(i.id) ?? 0)),
        })),
      },
    ]
  })
}
function aplicarSalida(habitaciones: ReturnType<typeof salidaHabitaciones>, db: Database.Database) {
  for (const h of habitaciones) {
    for (const p of h.integrantes) {
      db.prepare('UPDATE inscripciones SET habitacion_id=?, extra_habitacion=? WHERE id=?').run(
        p.sale ? null : h.id,
        p.extra,
        p.inscripcion_id,
      )
    }
    db.prepare('UPDATE habitaciones SET revision=revision+1 WHERE id=?').run(h.id)
  }
}
export function revisarEliminarPersona(id: number, db: Database.Database = conectar()) {
  const persona = db.prepare('SELECT * FROM personas WHERE id=?').get(id) as any
  if (!persona) throw new Error('No encontré esa persona. Actualiza la lista.')
  const inscripciones = db
    .prepare('SELECT * FROM inscripciones WHERE persona_id=? ORDER BY id')
    .all(id) as any[]
  const pagos = db
    .prepare(
      `SELECT pg.* FROM pagos pg JOIN inscripciones i ON i.id=pg.inscripcion_id
    WHERE i.persona_id=? ORDER BY pg.id`,
    )
    .all(id) as any[]
  const habitaciones = salidaHabitaciones(
    inscripciones.map((i) => i.id),
    db,
  )
  return {
    persona: { id, nombre: persona.nombre as string },
    pagos: pagos.length,
    eventos: inscripciones.length,
    pagado: pagos.filter((p) => !p.anulado).reduce((s, p) => s + p.monto, 0),
    habitaciones,
    firma: firmar({ persona, inscripciones, pagos, habitaciones }),
  }
}
export function eliminarPersona(id: number, firma: string, db: Database.Database = conectar()) {
  return db.transaction(() => {
    const plan = revisarEliminarPersona(id, db)
    if (!firma || firma !== plan.firma)
      throw new Error('La cuenta cambió. Cierra esta confirmación y vuelve a revisar antes de eliminar.')
    aplicarSalida(plan.habitaciones, db)
    db.prepare(
      'DELETE FROM pagos WHERE inscripcion_id IN (SELECT id FROM inscripciones WHERE persona_id=?)',
    ).run(id)
    db.prepare('DELETE FROM inscripciones WHERE persona_id=?').run(id)
    db.prepare('DELETE FROM personas WHERE id=?').run(id)
    // Los repartos anteriores conservan su aritmética, sin el nombre de la persona eliminada.
    for (const fila of db.prepare('SELECT id, detalle FROM cambios_habitaciones').all() as any[]) {
      const detalle = JSON.stringify(JSON.parse(fila.detalle), (_clave, valor) => {
        if (valor && typeof valor === 'object' && valor.persona_id === id)
          return { ...valor, persona_id: null, inscripcion_id: null, nombre: 'Persona eliminada' }
        return valor
      })
      if (detalle !== fila.detalle)
        db.prepare('UPDATE cambios_habitaciones SET detalle=? WHERE id=?').run(detalle, fila.id)
    }
    return { ok: true }
  })()
}

export type CambioCupo = { categoria_id?: number; precio?: number; precio_a_mano?: number }
export function revisarCupo(id: number, datos: CambioCupo, db: Database.Database = conectar()) {
  const actual = db.prepare('SELECT * FROM inscripciones WHERE id=?').get(id) as any
  if (!actual) throw new Error('Esta persona no está inscrita en el evento.')
  const categoriaId = datos.categoria_id ?? actual.categoria_id
  if (!Number.isSafeInteger(categoriaId)) throw new Error('Elige un tipo de cupo válido.')
  const categoria = db
    .prepare('SELECT * FROM categorias WHERE id=? AND evento_id=?')
    .get(categoriaId, actual.evento_id) as any
  if (!categoria || (categoria.archivada && categoria.id !== actual.categoria_id))
    throw new Error('Elige un tipo de cupo disponible en este evento.')
  const cambia = categoria.id !== actual.categoria_id
  const precio = datos.precio ?? (cambia ? categoria.precio : actual.precio)
  if (!Number.isSafeInteger(precio) || precio < 0) throw new Error('Escribe un precio válido.')
  const personalizado =
    datos.precio_a_mano === undefined
      ? cambia || precio !== actual.precio
        ? Number(precio !== categoria.precio)
        : actual.precio_a_mano
      : Number(Boolean(datos.precio_a_mano))
  const habitaciones =
    !categoria.incluye_alojamiento && actual.habitacion_id ? salidaHabitaciones([id], db) : []
  const pagos = db.prepare('SELECT * FROM pagos WHERE inscripcion_id=? ORDER BY id').all(id) as any[]
  const pagado = pagos.filter((p) => !p.anulado).reduce((s, p) => s + p.monto, 0)
  const extra = habitaciones.length ? 0 : actual.extra_habitacion
  return {
    categoria_id: categoria.id as number,
    categoria: categoria.nombre as string,
    precio: precio as number,
    precio_a_mano: personalizado as number,
    extra: extra as number,
    pagado,
    total: precio + extra,
    pendiente: calcularBalance(pagado, precio + extra),
    excedente: Math.max(0, pagado - precio - extra),
    habitaciones,
    firma: firmar({ actual, categoria, precio, personalizado, pagos, habitaciones }),
  }
}
export function cambiarCupo(
  id: number,
  datos: CambioCupo,
  firma: string | undefined,
  db: Database.Database = conectar(),
) {
  return db.transaction(() => {
    const plan = revisarCupo(id, datos, db)
    if ((firma || plan.habitaciones.length) && firma !== plan.firma)
      throw new Error('Las cuentas cambiaron. Revisa el cambio de cupo antes de guardar.')
    aplicarSalida(plan.habitaciones, db)
    db.prepare('UPDATE inscripciones SET categoria_id=?, precio=?, precio_a_mano=? WHERE id=?').run(
      plan.categoria_id,
      plan.precio,
      plan.precio_a_mano,
      id,
    )
    return { ok: true }
  })()
}
