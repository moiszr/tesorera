import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))

/**
 * Dónde vive la app y dónde viven sus migraciones.
 *
 * Corriendo desde el repo, ambas se deducen de este archivo y no hay nada que
 * configurar. Pero el instalador de Windows empaqueta el servidor como un solo
 * .js junto a `node.exe`, y ahí "dos carpetas arriba" ya no es la raíz ni las
 * migraciones están en `db/migraciones`. Por eso las dos rutas se pueden fijar
 * por variable de entorno: es el empaquetado el que sabe dónde puso las cosas,
 * no este archivo.
 */
export const RAIZ = process.env.TESORERA_RAIZ ?? join(aqui, '..', '..')
const CARPETA_MIGRACIONES = process.env.TESORERA_MIGRACIONES ?? join(aqui, 'migraciones')
export const CARPETA_DATOS = join(RAIZ, 'data')
export const CARPETA_RESPALDOS = join(CARPETA_DATOS, 'respaldos')
export const ARCHIVO_DB = process.env.TESORERA_DB ?? join(CARPETA_DATOS, 'tesorera.db')

let db: Database.Database | null = null

export function conectar(): Database.Database {
  if (db) return db

  if (ARCHIVO_DB !== ':memory:') {
    mkdirSync(dirname(ARCHIVO_DB), { recursive: true })
    mkdirSync(CARPETA_RESPALDOS, { recursive: true })
  }

  db = new Database(ARCHIVO_DB)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  migrar(db)
  return db
}

/** Migraciones simples: cada .sql corre una sola vez, en orden de nombre. */
function migrar(base: Database.Database) {
  base.exec(`CREATE TABLE IF NOT EXISTS migraciones (
    nombre     TEXT PRIMARY KEY,
    aplicada_en TEXT NOT NULL DEFAULT (datetime('now'))
  )`)

  const carpeta = CARPETA_MIGRACIONES
  if (!existsSync(carpeta)) return

  const yaAplicadas = new Set(
    base.prepare('SELECT nombre FROM migraciones').all().map((f: any) => f.nombre as string),
  )

  const archivos = readdirSync(carpeta).filter((f) => f.endsWith('.sql')).sort()
  const registrar = base.prepare('INSERT INTO migraciones (nombre) VALUES (?)')

  for (const archivo of archivos) {
    if (yaAplicadas.has(archivo)) continue
    const sql = readFileSync(join(carpeta, archivo), 'utf8')
    base.transaction(() => {
      base.exec(sql)
      registrar.run(archivo)
    })()
  }
}

export function cerrar() {
  db?.close()
  db = null
}
