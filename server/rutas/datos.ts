import { Hono } from 'hono'
import { eventoActivo, listarPersonas, resumen } from '../db/consultas'
import { hacerRespaldo, listarRespaldos } from '../db/respaldo'
import { CARPETA_RESPALDOS } from '../db/conexion'
import { informe, type FiltrosInforme } from '../db/informes'
import { NOMBRE_ESTADO } from '../../src/lib/estados'
import { error } from './ayuda'

export const rutasDatos = new Hono()

rutasDatos.get('/resumen', (c) => c.json(resumen()))

rutasDatos.post('/respaldo', (c) => {
  const hecho = hacerRespaldo()
  if (!hecho) return error(c, 'Todavía no hay nada que respaldar.')
  return c.json({ ...hecho, carpeta: CARPETA_RESPALDOS })
})

rutasDatos.get('/respaldos', (c) => c.json({ carpeta: CARPETA_RESPALDOS, respaldos: listarRespaldos() }))

/** CSV con BOM UTF-8 para que Excel abra las tildes bien. */
rutasDatos.get('/exportar.csv', () => {
  const evento = eventoActivo()
  const personas = listarPersonas({}).filter((p) => p.inscripcion_id != null)

  const columnas = [
    'Nombre',
    'Iglesia',
    'Pastor',
    'Tipo de cupo',
    'Habitación',
    'Extra habitación',
    'Precio',
    'Pagado',
    'Falta',
    'Estado',
    'Último pago',
    'Teléfono',
  ]
  const filas = personas.map((p) => [
    p.nombre,
    p.iglesia ?? '',
    p.pastor ?? '',
    p.categoria ?? '',
    p.habitacion ?? '',
    (p.extra_habitacion / 100).toFixed(2),
    (p.precio / 100).toFixed(2),
    (p.pagado / 100).toFixed(2),
    (p.balance / 100).toFixed(2),
    NOMBRE_ESTADO[p.estado],
    p.ultimo_pago ?? '',
    p.telefono ?? '',
  ])

  const csv = [columnas, ...filas].map((fila) => fila.map(celda).join(',')).join('\r\n')

  const nombre = `tesorera-${(evento?.nombre ?? 'evento').replace(/[^\w\-]+/g, '-').toLowerCase()}.csv`
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nombre}"`,
    },
  })
})

function celda(valor: string) {
  const original = String(valor ?? '')
  const s = /^[=+@\t\r-]/.test(original) ? `'${original}` : original
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** El mismo corte alimenta la pantalla y su descarga. */
function filtrosInforme(c: any): FiltrosInforme {
  const q = c.req.query()
  for (const key of ['desde', 'hasta']) {
    if (
      q[key] &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(q[key]) ||
        !Number.isFinite(Date.parse(`${q[key]}T12:00:00Z`)) ||
        new Date(`${q[key]}T12:00:00Z`).toISOString().slice(0, 10) !== q[key])
    )
      throw new Error('Elige una fecha válida.')
  }
  if (q.desde && q.hasta && q.desde > q.hasta)
    throw new Error('La fecha inicial debe ser anterior a la fecha final.')
  if (q.iglesia && q.iglesia !== 'sin' && (!Number.isSafeInteger(Number(q.iglesia)) || Number(q.iglesia) < 1))
    throw new Error('Elige una iglesia válida.')
  return {
    desde: q.desde || undefined,
    hasta: q.hasta || undefined,
    iglesia: q.iglesia === 'sin' ? 'sin' : q.iglesia ? Number(q.iglesia) : undefined,
  }
}
rutasDatos.get('/reporte', (c) => {
  try {
    return c.json(informe(filtrosInforme(c)))
  } catch (e) {
    return error(c, e instanceof Error ? e.message : 'No pude preparar el reporte.')
  }
})
rutasDatos.get('/reporte.csv', (c) => {
  try {
    const f = filtrosInforme(c)
    const r = informe(f)
    const tipo = c.req.query('tipo') ?? 'iglesias'
    const dinero = (n: number) => (n / 100).toFixed(2)
    let filas: string[][]
    if (tipo === 'pagos')
      filas = [
        ['Fecha', 'Persona', 'Iglesia', 'Forma de pago', 'Monto RD$'],
        ...r.pagos.map((p) => [
          p.fecha,
          p.persona,
          p.iglesia ?? '',
          p.metodo === 'efectivo' ? 'Efectivo' : p.metodo === 'transferencia' ? 'Transferencia' : 'Otro',
          dinero(p.monto),
        ]),
      ]
    else if (tipo === 'pendientes')
      filas = [
        ['Persona', 'Iglesia', 'Habitación', 'Total RD$', 'Pagado RD$', 'Pendiente RD$'],
        ...r.pendientes.map((p) => [
          p.nombre,
          p.iglesia ?? '',
          p.habitacion ?? 'Sin asignar',
          dinero(p.precio),
          dinero(p.pagado),
          dinero(p.balance),
        ]),
      ]
    else if (tipo === 'habitaciones')
      filas = [
        ['Habitación', 'Modalidad', 'Capacidad', 'Persona', 'Iglesia', 'Extra individual RD$'],
        ...r.alojamiento.habitaciones.flatMap((h) =>
          h.integrantes.length
            ? h.integrantes.map((p) => [
                h.nombre,
                h.categoria_privada_id ? 'Privada' : 'Compartida',
                String(h.capacidad),
                p.nombre,
                p.iglesia ?? '',
                dinero(p.extra_habitacion),
              ])
            : [
                [
                  h.nombre,
                  h.categoria_privada_id ? 'Privada' : 'Compartida',
                  String(h.capacidad),
                  'Sin integrantes',
                  '',
                  '',
                ],
              ],
        ),
        ...r.alojamiento.sin_asignar.map((p) => ['Sin asignar', '', '', p.nombre, p.iglesia ?? '', '0.00']),
      ]
    else
      filas = [
        [
          'Iglesia',
          'Personas',
          'Cobrado en período RD$',
          'Recaudado acumulado RD$',
          'Pendiente actual RD$',
          'Excedente RD$',
        ],
        ...r.iglesias.map((g) => [
          g.nombre,
          String(g.personas),
          dinero(g.periodo),
          dinero(g.recaudado),
          dinero(g.pendiente),
          dinero(g.excedente),
        ]),
      ]
    const alcance = [
      ['Evento', r.evento?.nombre ?? 'Sin evento'],
      ['Desde', f.desde ?? 'Inicio del evento'],
      ['Hasta', f.hasta ?? 'Todos los pagos'],
      ['Iglesia', f.iglesia ? (r.iglesias[0]?.nombre ?? 'Sin personas') : 'Todas las iglesias'],
      [],
    ]
    return new Response('\uFEFF' + [...alcance, ...filas].map((f) => f.map(celda).join(',')).join('\r\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tesorera-${tipo}.csv"`,
      },
    })
  } catch (e) {
    return error(c, e instanceof Error ? e.message : 'No pude preparar la descarga.')
  }
})
