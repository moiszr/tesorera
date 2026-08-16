import type Database from 'better-sqlite3'
import { conectar } from './conexion'
import { calcularBalance, calcularEstado, calcularExcedente, type Estado } from '../../src/lib/estados'
import { normalizar } from '../../src/lib/fechas'

// TODA la aritmética de "cuánto pagó / cuánto falta / cómo va" pasa por aquí.
// Ninguna ruta hace SUM(monto) por su cuenta.

export type Iglesia = {
  id: number
  nombre: string
  color: string
  archivada: number
  personas: number
}

export type Categoria = {
  id: number
  evento_id: number
  nombre: string
  precio: number
  orden: number
  archivada: number
  inscritos: number
}

export type Evento = {
  id: number
  nombre: string
  fecha_inicio: string | null
  fecha_fin: string | null
  activo: number
  categorias: Categoria[]
}

export type PersonaEnLista = {
  id: number
  nombre: string
  telefono: string | null
  iglesia_id: number | null
  iglesia: string | null
  iglesia_color: string | null
  inscripcion_id: number | null
  categoria_id: number | null
  categoria: string | null
  precio: number
  pagado: number
  balance: number
  excedente: number
  estado: Estado
  ultimo_pago: string | null
}

const PAGADO_SQL = `
  COALESCE((
    SELECT SUM(p.monto) FROM pagos p
    WHERE p.inscripcion_id = i.id AND p.anulado = 0
  ), 0)
`

// ── Eventos y categorías ──────────────────────────────────────────────────

export function eventoActivo(db: Database.Database = conectar()): Evento | null {
  const fila = db.prepare('SELECT * FROM eventos WHERE activo = 1 ORDER BY id DESC LIMIT 1').get() as any
  if (!fila) return null
  return { ...fila, categorias: categoriasDeEvento(fila.id, db) }
}

export function listarEventos(db: Database.Database = conectar()): Evento[] {
  const filas = db.prepare('SELECT * FROM eventos ORDER BY activo DESC, id DESC').all() as any[]
  return filas.map((e) => ({ ...e, categorias: categoriasDeEvento(e.id, db) }))
}

export function categoriasDeEvento(eventoId: number, db: Database.Database = conectar()): Categoria[] {
  return db
    .prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM inscripciones i WHERE i.categoria_id = c.id) AS inscritos
         FROM categorias c
        WHERE c.evento_id = ?
        ORDER BY c.archivada ASC, c.orden ASC, c.id ASC`,
    )
    .all(eventoId) as Categoria[]
}

export function categoria(id: number, db: Database.Database = conectar()): Categoria | null {
  const fila = db
    .prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM inscripciones i WHERE i.categoria_id = c.id) AS inscritos
         FROM categorias c WHERE c.id = ?`,
    )
    .get(id) as Categoria | undefined
  return fila ?? null
}

/**
 * Cuántas inscripciones de esta categoría cambiarían de precio si se
 * aplicara el precio actual. No toca nada: solo cuenta, para poder avisar.
 * Excluye a quienes ya pagaron completo y a quienes tienen precio puesto a mano.
 */
export function inscripcionesAfectadas(categoriaId: number, db: Database.Database = conectar()) {
  const cat = categoria(categoriaId, db)
  if (!cat) return { cuantas: 0, precio: 0 }
  const fila = db
    .prepare(
      `SELECT COUNT(*) AS cuantas FROM inscripciones i
        WHERE i.categoria_id = @cat
          AND i.precio_a_mano = 0
          AND i.precio <> @precio
          AND ${PAGADO_SQL} < i.precio`,
    )
    .get({ cat: categoriaId, precio: cat.precio }) as any
  return { cuantas: fila.cuantas as number, precio: cat.precio }
}

export function aplicarPrecioDeCategoria(categoriaId: number, db: Database.Database = conectar()) {
  const cat = categoria(categoriaId, db)
  if (!cat) return { cambiadas: 0 }
  const res = db
    .prepare(
      `UPDATE inscripciones
          SET precio = @precio
        WHERE categoria_id = @cat
          AND precio_a_mano = 0
          AND precio <> @precio
          AND id IN (
            SELECT i.id FROM inscripciones i
             WHERE i.categoria_id = @cat AND ${PAGADO_SQL} < i.precio
          )`,
    )
    .run({ cat: categoriaId, precio: cat.precio })
  return { cambiadas: res.changes }
}

// ── Iglesias ──────────────────────────────────────────────────────────────

export function listarIglesias(db: Database.Database = conectar()): Iglesia[] {
  return db
    .prepare(
      `SELECT g.*,
              (SELECT COUNT(*) FROM personas p WHERE p.iglesia_id = g.id AND p.archivada = 0) AS personas
         FROM iglesias g
        ORDER BY g.archivada ASC, g.nombre COLLATE NOCASE ASC`,
    )
    .all() as Iglesia[]
}

// ── Personas ──────────────────────────────────────────────────────────────

export type FiltrosPersonas = {
  buscar?: string
  iglesia?: number
  categoria_id?: number
  estado?: Estado
  orden?: 'nombre' | 'menos_pagado' | 'recientes'
  incluir_archivadas?: boolean
}

export function listarPersonas(
  filtros: FiltrosPersonas = {},
  db: Database.Database = conectar(),
): PersonaEnLista[] {
  const evento = eventoActivo(db)
  const eventoId = evento?.id ?? -1

  const filas = db
    .prepare(
      `SELECT p.id, p.nombre, p.telefono, p.iglesia_id,
              g.nombre AS iglesia, g.color AS iglesia_color,
              i.id AS inscripcion_id, i.categoria_id,
              c.nombre AS categoria,
              COALESCE(i.precio, 0) AS precio,
              ${PAGADO_SQL} AS pagado,
              (SELECT MAX(pg.fecha) FROM pagos pg
                WHERE pg.inscripcion_id = i.id AND pg.anulado = 0) AS ultimo_pago,
              p.creada_en
         FROM personas p
         LEFT JOIN iglesias g ON g.id = p.iglesia_id
         LEFT JOIN inscripciones i ON i.persona_id = p.id AND i.evento_id = @evento
         LEFT JOIN categorias c ON c.id = i.categoria_id
        WHERE (@archivadas = 1 OR p.archivada = 0)`,
    )
    .all({ evento: eventoId, archivadas: filtros.incluir_archivadas ? 1 : 0 }) as any[]

  let lista: PersonaEnLista[] = filas.map((f) => {
    const precio = f.precio ?? 0
    const pagado = f.pagado ?? 0
    return {
      id: f.id,
      nombre: f.nombre,
      telefono: f.telefono,
      iglesia_id: f.iglesia_id,
      iglesia: f.iglesia,
      iglesia_color: f.iglesia_color,
      inscripcion_id: f.inscripcion_id,
      categoria_id: f.categoria_id,
      categoria: f.categoria,
      precio,
      pagado,
      balance: calcularBalance(pagado, precio),
      excedente: calcularExcedente(pagado, precio),
      estado: calcularEstado(pagado, precio),
      ultimo_pago: f.ultimo_pago,
      _creada: f.creada_en,
    } as PersonaEnLista & { _creada: string }
  })

  // La búsqueda ignora tildes y mayúsculas; se hace en memoria porque
  // SQLite no sabe quitar acentos y son decenas de personas, no millones.
  const termino = normalizar(filtros.buscar ?? '')
  if (termino) {
    lista = lista.filter((p) => normalizar(p.nombre).includes(termino))
  }
  if (filtros.iglesia) lista = lista.filter((p) => p.iglesia_id === filtros.iglesia)
  if (filtros.categoria_id) lista = lista.filter((p) => p.categoria_id === filtros.categoria_id)
  if (filtros.estado) lista = lista.filter((p) => p.estado === filtros.estado)

  const orden = filtros.orden ?? 'nombre'
  if (orden === 'menos_pagado') {
    lista.sort((a, b) => b.balance - a.balance || compararNombre(a, b))
  } else if (orden === 'recientes') {
    lista.sort((a: any, b: any) => String(b._creada).localeCompare(String(a._creada)) || compararNombre(a, b))
  } else {
    lista.sort(compararNombre)
  }

  return lista.map(({ ...p }) => {
    delete (p as any)._creada
    return p
  })
}

function compararNombre(a: { nombre: string }, b: { nombre: string }) {
  return normalizar(a.nombre).localeCompare(normalizar(b.nombre), 'es')
}

export function fichaPersona(id: number, db: Database.Database = conectar()) {
  const persona = db
    .prepare(
      `SELECT p.*, g.nombre AS iglesia, g.color AS iglesia_color
         FROM personas p LEFT JOIN iglesias g ON g.id = p.iglesia_id
        WHERE p.id = ?`,
    )
    .get(id) as any
  if (!persona) return null

  const evento = eventoActivo(db)
  const inscripcion = evento
    ? (db
        .prepare(
          `SELECT i.*, c.nombre AS categoria, c.precio AS precio_categoria, c.archivada AS categoria_archivada
             FROM inscripciones i
             LEFT JOIN categorias c ON c.id = i.categoria_id
            WHERE i.persona_id = ? AND i.evento_id = ?`,
        )
        .get(id, evento.id) as any)
    : null

  const pagos = inscripcion
    ? (db
        .prepare('SELECT * FROM pagos WHERE inscripcion_id = ? ORDER BY fecha DESC, id DESC')
        .all(inscripcion.id) as any[])
    : []

  const precio = inscripcion?.precio ?? 0
  const pagado = pagos.filter((p) => !p.anulado).reduce((s, p) => s + p.monto, 0)

  return {
    persona: {
      id: persona.id,
      nombre: persona.nombre,
      telefono: persona.telefono,
      notas: persona.notas,
      archivada: persona.archivada,
      iglesia_id: persona.iglesia_id,
      iglesia: persona.iglesia,
      iglesia_color: persona.iglesia_color,
    },
    evento: evento ? { id: evento.id, nombre: evento.nombre, fecha_inicio: evento.fecha_inicio } : null,
    inscripcion: inscripcion
      ? {
          id: inscripcion.id,
          categoria_id: inscripcion.categoria_id,
          categoria: inscripcion.categoria,
          precio,
          precio_categoria: inscripcion.precio_categoria,
          precio_a_mano: inscripcion.precio_a_mano,
          categoria_archivada: inscripcion.categoria_archivada,
        }
      : null,
    cuenta: {
      precio,
      pagado,
      balance: calcularBalance(pagado, precio),
      excedente: calcularExcedente(pagado, precio),
      estado: calcularEstado(pagado, precio),
    },
    pagos,
  }
}

// ── Resumen del evento ────────────────────────────────────────────────────

export function resumen(db: Database.Database = conectar()) {
  const evento = eventoActivo(db)
  if (!evento) {
    return { evento: null, totales: null, ultimos_pagos: [], iglesias: [], categorias: [] }
  }

  const personas = listarPersonas({}, db).filter((p) => p.inscripcion_id != null)

  const meta = personas.reduce((s, p) => s + p.precio, 0)
  const recaudado = personas.reduce((s, p) => s + Math.min(p.pagado, p.precio), 0)
  const recaudadoReal = personas.reduce((s, p) => s + p.pagado, 0)
  const pendiente = personas.reduce((s, p) => s + p.balance, 0)

  // OJO: lo pendiente de un grupo NO es (meta − recaudado). Si alguien pagó de
  // más, esa resta le tapa la deuda a otro y los totales dejan de cuadrar con
  // la lista de personas. Lo pendiente siempre se suma persona por persona.
  const porIglesia = new Map<
    string,
    { nombre: string; color: string; meta: number; recaudado: number; pendiente: number; personas: number }
  >()
  for (const p of personas) {
    const clave = p.iglesia ?? '—'
    const actual = porIglesia.get(clave) ?? {
      nombre: p.iglesia ?? 'Sin iglesia',
      color: p.iglesia_color ?? 'arcilla',
      meta: 0,
      recaudado: 0,
      pendiente: 0,
      personas: 0,
    }
    actual.meta += p.precio
    actual.recaudado += p.pagado
    actual.pendiente += p.balance
    actual.personas += 1
    porIglesia.set(clave, actual)
  }

  const porCategoria = evento.categorias.map((c) => {
    const suyas = personas.filter((p) => p.categoria_id === c.id)
    return {
      id: c.id,
      nombre: c.nombre,
      personas: suyas.length,
      meta: suyas.reduce((s, p) => s + p.precio, 0),
      recaudado: suyas.reduce((s, p) => s + p.pagado, 0),
      pendiente: suyas.reduce((s, p) => s + p.balance, 0),
    }
  })

  const ultimos = db
    .prepare(
      `SELECT pg.id, pg.monto, pg.fecha, pg.metodo, pg.anulado,
              per.id AS persona_id, per.nombre AS persona
         FROM pagos pg
         JOIN inscripciones i ON i.id = pg.inscripcion_id
         JOIN personas per ON per.id = i.persona_id
        WHERE i.evento_id = ? AND pg.anulado = 0
        -- Se ordena por la FECHA DEL PAGO, no por cuándo se digitó: la lista se
        -- titula "Últimos pagos" y ella la lee como fechas. Ordenar por
        -- creado_en dejaba "hace 2 días" encima de "1 de agosto".
        ORDER BY pg.fecha DESC, pg.creado_en DESC, pg.id DESC
        LIMIT 8`,
    )
    .all(evento.id) as any[]

  return {
    evento,
    totales: {
      meta,
      recaudado,
      recaudado_real: recaudadoReal,
      pendiente,
      inscritos: personas.length,
      pagados: personas.filter((p) => p.estado === 'pagado').length,
      abonando: personas.filter((p) => p.estado === 'abonando').length,
      sinpagos: personas.filter((p) => p.estado === 'sinpagos').length,
    },
    ultimos_pagos: ultimos,
    iglesias: [...porIglesia.values()].sort((a, b) => b.recaudado - a.recaudado),
    categorias: porCategoria,
  }
}

/** Cuenta de personas por cada filtro, para los contadores de los chips. */
export function conteos(filtros: FiltrosPersonas = {}, db: Database.Database = conectar()) {
  const base = listarPersonas({ ...filtros, estado: undefined, categoria_id: undefined, iglesia: undefined }, db)
  const conIglesia = filtros.iglesia ? base.filter((p) => p.iglesia_id === filtros.iglesia) : base
  const conCategoria = filtros.categoria_id
    ? conIglesia.filter((p) => p.categoria_id === filtros.categoria_id)
    : conIglesia

  const porEstado: Record<string, number> = { pagado: 0, abonando: 0, sinpagos: 0 }
  for (const p of conCategoria) porEstado[p.estado] += 1

  const conEstado = filtros.estado ? conIglesia.filter((p) => p.estado === filtros.estado) : conIglesia
  const porCategoria: Record<number, number> = {}
  for (const p of conEstado) {
    if (p.categoria_id != null) porCategoria[p.categoria_id] = (porCategoria[p.categoria_id] ?? 0) + 1
  }

  const sinIglesiaFiltro = filtros.iglesia ? base : conIglesia
  const filtradas = sinIglesiaFiltro.filter(
    (p) =>
      (!filtros.estado || p.estado === filtros.estado) &&
      (!filtros.categoria_id || p.categoria_id === filtros.categoria_id),
  )
  const porIglesia: Record<number, number> = {}
  for (const p of filtradas) {
    if (p.iglesia_id != null) porIglesia[p.iglesia_id] = (porIglesia[p.iglesia_id] ?? 0) + 1
  }

  return { total: base.length, estado: porEstado, categoria: porCategoria, iglesia: porIglesia }
}

export { normalizar }
