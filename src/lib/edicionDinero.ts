/** En los editores usamos coma de miles y punto decimal, igual que los importes. */
export function formatearEdicionDinero(texto: string): string | null {
  const limpio = texto.replace(/,/g, '')
  if (!/^\d*(\.\d{0,2})?$/.test(limpio)) return null
  if (!limpio) return ''
  const [entero, decimales] = limpio.split('.')
  const agrupado = (entero || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return agrupado + (decimales !== undefined ? `.${decimales}` : '')
}

/** Mantiene el cursor junto al mismo dígito aunque aparezca una coma delante. */
export function cursorDinero(antes: string, cursor: number, despues: string): number {
  const cantidad =
    antes.slice(0, cursor).replace(/,/g, '').length + (antes.startsWith('.') && cursor > 0 ? 1 : 0)
  if (!cantidad) return 0
  let vistos = 0
  for (let i = 0; i < despues.length; i++) {
    if (despues[i] !== ',') vistos++
    if (vistos === cantidad) return i + 1
  }
  return despues.length
}
