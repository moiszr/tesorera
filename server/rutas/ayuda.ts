import type { Context } from 'hono'

/**
 * Los errores se escriben como se los diríamos a ella: qué pasó y qué hacer.
 * Nunca "Bad Request", nunca un código, nunca inglés.
 */
export function error(c: Context, mensaje: string, codigo = 400) {
  return c.json({ error: mensaje }, codigo as 400)
}

export function numero(valor: unknown): number | null {
  if (valor === undefined || valor === null || valor === '') return null
  const n = Number(valor)
  return Number.isFinite(n) ? n : null
}

export function entero(valor: unknown): number | null {
  const n = numero(valor)
  return n === null ? null : Math.trunc(n)
}

export function texto(valor: unknown): string | null {
  if (valor === undefined || valor === null) return null
  const s = String(valor).trim()
  return s === '' ? null : s
}
