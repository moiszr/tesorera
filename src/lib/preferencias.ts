/**
 * Preferencias de USO, no datos.
 *
 * Aquí solo se recuerda qué eligió la última vez para no hacerla repetir lo
 * mismo veinte veces seguidas cuando inscribe a media iglesia de un tirón.
 * Nada de esto es un dato del negocio: si se pierde, no pasa nada. Por eso
 * puede vivir en localStorage, a diferencia de los pagos, que viven en SQLite.
 */

const CLAVE = 'tesorera.ultimasElecciones'

type Ultimas = {
  iglesiaId?: number
  categoriaId?: number
}

export function ultimasElecciones(): Ultimas {
  try {
    const crudo = localStorage.getItem(CLAVE)
    return crudo ? (JSON.parse(crudo) as Ultimas) : {}
  } catch {
    return {}
  }
}

export function recordarEleccion(cambio: Ultimas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...ultimasElecciones(), ...cambio }))
  } catch {
    // Si el navegador no deja guardar, se pierde la comodidad y ya. No es un error.
  }
}
