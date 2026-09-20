import type Database from 'better-sqlite3'
import { conectar } from './conexion'
import { eventoActivo, listarPersonas, type PersonaEnLista } from './consultas'

export type FiltrosInforme = { desde?: string; hasta?: string; iglesia?: number | 'sin' }

/** Los saldos son actuales. Las fechas filtran cobros, nunca la deuda de una persona. */
export function informe(filtros: FiltrosInforme = {}, db: Database.Database = conectar()) {
  const evento = eventoActivo(db)
  const todas = listarPersonas({ incluir_archivadas: true }, db).filter((p) => p.inscripcion_id)
  const personas = todas.filter((p) =>
    filtros.iglesia === 'sin' ? p.iglesia_id === null : !filtros.iglesia || p.iglesia_id === filtros.iglesia,
  )
  const ids = new Set(personas.map((p) => p.inscripcion_id))
  const cobros = (
    db
      .prepare(
        `SELECT pg.*, per.nombre AS persona, per.id AS persona_id,
    g.nombre AS iglesia, g.id AS iglesia_id FROM pagos pg
    JOIN inscripciones i ON i.id=pg.inscripcion_id JOIN personas per ON per.id=i.persona_id
    LEFT JOIN iglesias g ON g.id=per.iglesia_id
    WHERE i.evento_id=? AND pg.fecha>=? AND pg.fecha<=? ORDER BY pg.fecha DESC,pg.id DESC`,
      )
      .all(evento?.id ?? -1, filtros.desde ?? '', filtros.hasta ?? '9999-12-31') as {
      id: number
      inscripcion_id: number
      monto: number
      fecha: string
      metodo: string
      anulado: number
      persona: string
      persona_id: number
      iglesia: string | null
      iglesia_id: number | null
    }[]
  ).filter((p) => ids.has(p.inscripcion_id))
  const validos = cobros.filter((p) => !p.anulado)
  function sumar(grupo: PersonaEnLista[]) {
    const miembros = new Set(grupo.map((p) => p.inscripcion_id))
    return {
      personas: grupo.length,
      meta: grupo.reduce((s, p) => s + p.precio, 0),
      recaudado: grupo.reduce((s, p) => s + p.pagado, 0),
      pendiente: grupo.reduce((s, p) => s + p.balance, 0),
      excedente: grupo.reduce((s, p) => s + p.excedente, 0),
      extra: grupo.reduce((s, p) => s + p.extra_habitacion, 0),
      periodo: validos.filter((p) => miembros.has(p.inscripcion_id)).reduce((s, p) => s + p.monto, 0),
      pagados: grupo.filter((p) => p.estado === 'pagado').length,
      abonando: grupo.filter((p) => p.estado === 'abonando').length,
      sinpagos: grupo.filter((p) => p.estado === 'sinpagos').length,
    }
  }
  const claves = [...new Set(personas.map((p) => p.iglesia_id))]
  const iglesias = claves
    .map((id) => {
      const grupo = personas.filter((p) => p.iglesia_id === id)
      return {
        id,
        nombre: grupo[0].iglesia ?? 'Sin iglesia asignada',
        color: grupo[0].iglesia_color ?? 'pizarra',
        pastor: grupo[0].pastor,
        ...sumar(grupo),
      }
    })
    .sort((a, b) => b.periodo - a.periodo || b.recaudado - a.recaudado)
  const categorias = (evento?.categorias ?? [])
    .map((c) => ({ id: c.id, nombre: c.nombre, ...sumar(personas.filter((p) => p.categoria_id === c.id)) }))
    .filter((c) => c.personas)
  const dias = new Map<string, number>()
  for (const pago of validos) dias.set(pago.fecha, (dias.get(pago.fecha) ?? 0) + pago.monto)
  const porDia = [...dias].sort(([a], [b]) => a.localeCompare(b)).map(([fecha, monto]) => ({ fecha, monto }))
  const habitaciones = db
    .prepare(
      'SELECT id,nombre,capacidad,categoria_privada_id,extra_total FROM habitaciones WHERE evento_id=? AND archivada=0 ORDER BY nombre',
    )
    .all(evento?.id ?? -1) as {
    id: number
    nombre: string
    capacidad: number
    categoria_privada_id: number | null
    extra_total: number
  }[]
  return {
    evento,
    filtros,
    totales: sumar(personas),
    iglesias,
    categorias,
    dias: porDia,
    metodos: ['efectivo', 'transferencia', 'otro'].map((metodo) => ({
      metodo,
      monto: validos.filter((p) => p.metodo === metodo).reduce((s, p) => s + p.monto, 0),
      cantidad: validos.filter((p) => p.metodo === metodo).length,
    })),
    pagos: validos,
    anulados: cobros.filter((p) => p.anulado).length,
    pendientes: personas.filter((p) => p.balance > 0).sort((a, b) => b.balance - a.balance),
    archivadas: personas.filter((p) => p.archivada).length,
    alojamiento: {
      sin_asignar: personas.filter((p) => !p.archivada && p.incluye_alojamiento && !p.habitacion_id),
      habitaciones: habitaciones
        .map((h) => ({
          ...h,
          integrantes: personas.filter((p) => p.habitacion_id === h.id),
          ...sumar(personas.filter((p) => p.habitacion_id === h.id)),
        }))
        .filter((h) => !filtros.iglesia || h.personas > 0),
    },
  }
}
