/**
 * Arma marca/tesorera.ico a partir de los PNG ya generados.
 *
 * Un .ico es un contenedor sencillo: cabecera, un directorio con una entrada
 * por tamaño, y los datos de cada imagen pegados detrás. Windows Vista en
 * adelante acepta que cada entrada sea un PNG tal cual, así que no hace falta
 * codificar BMP ni máscaras.
 *
 * Se hace a mano para no meter una dependencia más en un proyecto que se
 * instala en la laptop de alguien que no debe pelear con npm.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))
const TAMANOS = [16, 32, 48, 64, 128, 256]

const imagenes = TAMANOS.map((tam) => ({
  tam,
  datos: readFileSync(join(aqui, `icono-${tam}.png`)),
}))

const CABECERA = 6
const ENTRADA = 16
const directorio = Buffer.alloc(CABECERA + ENTRADA * imagenes.length)

directorio.writeUInt16LE(0, 0) // reservado
directorio.writeUInt16LE(1, 2) // 1 = icono
directorio.writeUInt16LE(imagenes.length, 4)

let desplazamiento = directorio.length
imagenes.forEach((img, i) => {
  const p = CABECERA + ENTRADA * i
  // 256 se escribe como 0: el campo es de un solo byte.
  directorio.writeUInt8(img.tam >= 256 ? 0 : img.tam, p)
  directorio.writeUInt8(img.tam >= 256 ? 0 : img.tam, p + 1)
  directorio.writeUInt8(0, p + 2) // colores de paleta (0 = sin paleta)
  directorio.writeUInt8(0, p + 3) // reservado
  directorio.writeUInt16LE(1, p + 4) // planos
  directorio.writeUInt16LE(32, p + 6) // bits por píxel
  directorio.writeUInt32LE(img.datos.length, p + 8)
  directorio.writeUInt32LE(desplazamiento, p + 12)
  desplazamiento += img.datos.length
})

const salida = join(aqui, 'tesorera.ico')
writeFileSync(salida, Buffer.concat([directorio, ...imagenes.map((i) => i.datos)]))

const kb = (Buffer.concat([directorio, ...imagenes.map((i) => i.datos)]).length / 1024).toFixed(1)
console.log(`tesorera.ico listo — ${imagenes.length} tamaños (${TAMANOS.join(', ')}), ${kb} kB`)
