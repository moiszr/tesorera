// En la base todo va en ISO (2026-08-16). En pantalla, siempre en español.

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** "2026-08-16" → "16 de agosto de 2026" */
export function fechaLarga(iso: string | null | undefined): string {
  const d = deISO(iso)
  if (!d) return ''
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

/** "2026-08-16" → "16 de agosto" (sin año, cuando el año se entiende) */
export function fechaCorta(iso: string | null | undefined): string {
  const d = deISO(iso)
  if (!d) return ''
  return `${d.getDate()} de ${MESES[d.getMonth()]}`
}

/** "hoy", "ayer", "hace 3 días", o la fecha corta si ya pasó una semana. */
export function fechaRelativa(iso: string | null | undefined, ahora = new Date()): string {
  const d = deISO(iso)
  if (!d) return ''
  const dias = diasEntre(d, ahora)
  if (dias === 0) return 'hoy'
  if (dias === 1) return 'ayer'
  if (dias > 1 && dias < 7) return `hace ${dias} días`
  if (dias === -1) return 'mañana'
  return fechaCorta(iso)
}

/** Días completos desde `desde` hasta `hasta`. Positivo si `desde` es pasado. */
export function diasEntre(desde: Date, hasta: Date): number {
  const a = Date.UTC(desde.getFullYear(), desde.getMonth(), desde.getDate())
  const b = Date.UTC(hasta.getFullYear(), hasta.getMonth(), hasta.getDate())
  return Math.round((b - a) / 86400000)
}

/** "Faltan 52 días" / "Es hoy" / "Fue hace 3 días" — para la cuenta regresiva del evento. */
export function cuentaRegresiva(isoEvento: string | null | undefined, ahora = new Date()): string {
  const d = deISO(isoEvento)
  if (!d) return ''
  const dias = diasEntre(ahora, d)
  if (dias === 0) return 'Es hoy'
  if (dias === 1) return 'Falta 1 día'
  if (dias > 1) return `Faltan ${dias} días`
  if (dias === -1) return 'Fue ayer'
  return `Fue hace ${Math.abs(dias)} días`
}

/** La fecha de hoy en ISO, en hora local (no UTC: si no, a las 8pm salta al día siguiente). */
export function hoyISO(ahora = new Date()): string {
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

function deISO(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const soloFecha = String(iso).slice(0, 10)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(soloFecha)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

/** Quita tildes y pasa a minúsculas: "José" → "jose". Para buscar sin acentos. */
export function normalizar(texto: string): string {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
