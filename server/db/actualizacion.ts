import type Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { CARPETA_RESPALDOS, conectar } from './conexion'
import { eliminarPersona, revisarEliminarPersona } from './correcciones'

const TRANSICION = 'v1.2.0-personas-archivadas'

/** Por petición del usuario: limpieza única, atómica y con una copia que no caduca. */
export function completarActualizacion(db: Database.Database = conectar(), carpeta = CARPETA_RESPALDOS) {
  if (db.prepare('SELECT nombre FROM actualizaciones WHERE nombre=?').get(TRANSICION)) return
  const ids = db.prepare('SELECT id FROM personas WHERE archivada<>0 ORDER BY id').all() as { id: number }[]
  const firmas = ids.map(({ id }) => revisarEliminarPersona(id, db).firma)
  let respaldo: string | null = null
  // Se usa VACUUM INTO: incluye los pagos confirmados que aún están en el WAL.
  if (ids.length) {
    mkdirSync(carpeta, { recursive: true })
    respaldo = `tesorera-antes-v1.2.0-${randomUUID()}.db`
    try {
      db.prepare('VACUUM INTO ?').run(join(carpeta, respaldo))
    } catch {
      throw new Error(
        'No pude guardar el respaldo de la actualización. No eliminé ninguna persona. Revisa el espacio disponible y vuelve a abrir Tesorera.',
      )
    }
  }
  db.transaction(() => {
    if (db.prepare('SELECT nombre FROM actualizaciones WHERE nombre=?').get(TRANSICION)) return
    const actuales = db.prepare('SELECT id FROM personas WHERE archivada<>0 ORDER BY id').all() as {
      id: number
    }[]
    if (
      JSON.stringify(ids) !== JSON.stringify(actuales) ||
      JSON.stringify(firmas) !==
        JSON.stringify(actuales.map(({ id }) => revisarEliminarPersona(id, db).firma))
    )
      throw new Error('La lista cambió durante la actualización. Vuelve a abrir Tesorera.')
    for (const { id } of ids) eliminarPersona(id, revisarEliminarPersona(id, db).firma, db)
    db.prepare('INSERT INTO actualizaciones(nombre,detalle) VALUES(?,?)').run(
      TRANSICION,
      JSON.stringify({ eliminadas: ids.length, respaldo }),
    )
  })()
}
