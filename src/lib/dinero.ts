// Todo el dinero se guarda en CENTAVOS como número entero.
// Nunca se opera con decimales: 0.1 + 0.2 no es 0.3 y aquí eso sería un pago mal contado.

const FORMATO = new Intl.NumberFormat('es-DO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const FORMATO_CON_CENTAVOS = new Intl.NumberFormat('es-DO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 350000 → "RD$ 3,500"  ·  350050 → "RD$ 3,500.50" */
export function formatoRD(centavos: number): string {
  return `RD$ ${soloNumero(centavos)}`
}

/** Igual que formatoRD pero sin el "RD$", para cuando el símbolo va aparte. */
export function soloNumero(centavos: number): string {
  const entero = Math.trunc(Math.abs(centavos) / 100)
  const resto = Math.abs(centavos) % 100
  const signo = centavos < 0 ? '−' : ''
  if (resto === 0) return `${signo}${FORMATO.format(entero)}`
  return `${signo}${FORMATO_CON_CENTAVOS.format(Math.abs(centavos) / 100)}`
}

/**
 * Convierte lo que la usuaria escribe a centavos.
 * Acepta "1500", "1,500", "1500.50", "RD$ 1.500", " 1 500 ".
 * Devuelve null si no hay un número válido.
 *
 * Regla del punto y la coma: en RD se escribe 1,500.50 (coma de miles,
 * punto decimal), pero mucha gente escribe 1.500. Se resuelve así:
 * el último separador manda solo si le siguen exactamente 1 o 2 dígitos.
 */
export function aCentavos(texto: string): number | null {
  if (texto == null) return null
  let limpio = String(texto).replace(/rd\$?/gi, '').replace(/\s/g, '').trim()
  if (limpio === '') return null
  if (!/^[\d.,]+$/.test(limpio)) return null

  const ultimoPunto = limpio.lastIndexOf('.')
  const ultimaComa = limpio.lastIndexOf(',')
  const corte = Math.max(ultimoPunto, ultimaComa)

  let entero: string
  let decimales = '0'

  if (corte === -1) {
    entero = limpio
  } else {
    const cola = limpio.slice(corte + 1)
    if (cola.length === 1 || cola.length === 2) {
      // Es separador decimal.
      entero = limpio.slice(0, corte)
      decimales = cola.padEnd(2, '0')
    } else {
      // Es separador de miles.
      entero = limpio
    }
  }

  entero = entero.replace(/[.,]/g, '')
  if (entero === '') entero = '0'
  if (!/^\d+$/.test(entero) || !/^\d{1,2}$/.test(decimales)) return null

  const centavos = Number(entero) * 100 + Number(decimales.padEnd(2, '0'))
  if (!Number.isSafeInteger(centavos)) return null
  return centavos
}

/** Para poner en un campo de texto un monto ya guardado. */
export function aTextoEditable(centavos: number): string {
  return centavos % 100 === 0
    ? String(Math.trunc(centavos / 100))
    : (centavos / 100).toFixed(2)
}
