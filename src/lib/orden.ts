// El mismo orden visible en Iglesias y en todos sus selectores: #9 antes de #10.
const nombres = new Intl.Collator('es-DO', { numeric: true, sensitivity: 'base' })
export function ordenarPorNombre<T extends { nombre: string }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => nombres.compare(a.nombre, b.nombre))
}
