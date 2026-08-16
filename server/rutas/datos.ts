import { Hono } from 'hono'
import { eventoActivo, listarPersonas, resumen } from '../db/consultas'
import { hacerRespaldo, listarRespaldos } from '../db/respaldo'
import { CARPETA_RESPALDOS } from '../db/conexion'
import { fechaLarga } from '../../src/lib/fechas'
import { soloNumero } from '../../src/lib/dinero'
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
    'Nombre', 'Iglesia', 'Pastor', 'Tipo de cupo', 'Precio', 'Pagado', 'Falta', 'Estado', 'Último pago', 'Teléfono',
  ]
  const filas = personas.map((p) => [
    p.nombre,
    p.iglesia ?? '',
    p.pastor ?? '',
    p.categoria ?? '',
    (p.precio / 100).toFixed(2),
    (p.pagado / 100).toFixed(2),
    (p.balance / 100).toFixed(2),
    NOMBRE_ESTADO[p.estado],
    p.ultimo_pago ?? '',
    p.telefono ?? '',
  ])

  const csv = [columnas, ...filas]
    .map((fila) => fila.map(celda).join(','))
    .join('\r\n')

  const nombre = `tesorera-${(evento?.nombre ?? 'evento').replace(/[^\w\-]+/g, '-').toLowerCase()}.csv`
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nombre}"`,
    },
  })
})

function celda(valor: string) {
  const s = String(valor ?? '')
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Reporte por iglesia, para rendir cuentas. */
rutasDatos.get('/reporte', (c) => {
  const r = resumen()
  if (!r.evento) return c.json({ evento: null })
  return c.json({
    ...r,
    generado: fechaLarga(new Date().toISOString().slice(0, 10)),
    total_texto: soloNumero(r.totales!.recaudado_real),
  })
})
