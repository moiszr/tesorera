import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))
export const RAIZ = join(aqui, '..', '..')
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

  const carpeta = join(aqui, 'migraciones')
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
