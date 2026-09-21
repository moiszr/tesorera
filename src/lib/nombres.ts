/** Conserva las tildes y las mayúsculas interiores; no altera el cursor al escribir. */
export function formatoNombre(nombre: string) {
  return nombre
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(^|[\s’'\-])(\p{L})/gu, (_, inicio, letra: string) => inicio + letra.toLocaleUpperCase('es'))
}
