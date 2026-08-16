import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { ARCHIVO_DB, CARPETA_RESPALDOS } from './conexion'

const CUANTOS_GUARDAR = 30

/**
 * Copia data/tesorera.db a data/respaldos/tesorera-AAAA-MM-DD-HHMM.db
 * Se hace sola al abrir la app y también con el botón de Ajustes.
 * Deja los últimos 30 y borra los más viejos.
 */
export function hacerRespaldo(): { ruta: string; nombre: string } | null {
  if (!existsSync(ARCHIVO_DB)) return null
  mkdirSync(CARPETA_RESPALDOS, { recursive: true })

  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const sello = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  const nombre = `tesorera-${sello}.db`
  const ruta = join(CARPETA_RESPALDOS, nombre)

  copyFileSync(ARCHIVO_DB, ruta)
  limpiarViejos()
  return { ruta, nombre }
}

function limpiarViejos() {
  const archivos = readdirSync(CARPETA_RESPALDOS)
    .filter((f) => f.startsWith('tesorera-') && f.endsWith('.db'))
    .map((f) => ({ f, t: statSync(join(CARPETA_RESPALDOS, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)

  for (const viejo of archivos.slice(CUANTOS_GUARDAR)) {
    try {
      unlinkSync(join(CARPETA_RESPALDOS, viejo.f))
    } catch {
      // Si no se puede borrar uno viejo, no es motivo para molestar a nadie.
    }
  }
}

export function listarRespaldos() {
  if (!existsSync(CARPETA_RESPALDOS)) return []
  return readdirSync(CARPETA_RESPALDOS)
    .filter((f) => f.startsWith('tesorera-') && f.endsWith('.db'))
    .map((f) => {
      const s = statSync(join(CARPETA_RESPALDOS, f))
      return { nombre: f, cuando: new Date(s.mtimeMs).toISOString(), tamano: s.size }
    })
    .sort((a, b) => b.cuando.localeCompare(a.cuando))
}
