import { afterAll, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Database from 'better-sqlite3'

const raiz = mkdtempSync(join(tmpdir(), 'tesorera-respaldo-'))
process.env.TESORERA_RAIZ = raiz
process.env.TESORERA_DB = join(raiz, 'data', 'tesorera.db')
const { conectar, cerrar } = await import('../server/db/conexion')
const { hacerRespaldo } = await import('../server/db/respaldo')

afterAll(() => {
  cerrar()
  rmSync(raiz, { recursive: true, force: true })
})

it('el respaldo incluye cambios confirmados en WAL sin cerrar la aplicación', () => {
  const db = conectar()
  db.pragma('wal_autocheckpoint = 0')
  db.exec(`CREATE TABLE prueba_respaldo (id INTEGER PRIMARY KEY, monto INTEGER);
    INSERT INTO prueba_respaldo VALUES (1, 125050);`)
  const respaldo = hacerRespaldo()
  expect(respaldo).not.toBeNull()
  const copia = new Database(respaldo!.ruta, { readonly: true })
  try {
    expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
    expect(copia.prepare('SELECT monto FROM prueba_respaldo WHERE id = 1').get()).toEqual({ monto: 125050 })
    expect(copia.prepare('SELECT COUNT(*) AS n FROM migraciones').get()).toEqual({ n: 4 })
    db.prepare('INSERT INTO prueba_respaldo VALUES (2, 500)').run()
    expect(copia.prepare('SELECT COUNT(*) AS n FROM prueba_respaldo').get()).toEqual({ n: 1 })
  } finally {
    copia.close()
  }
})

it('conserva ambos respaldos si se solicitan en el mismo segundo', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-20T12:00:00Z'))
  try {
    const primero = hacerRespaldo()!
    const segundo = hacerRespaldo()!
    expect(segundo.ruta).not.toBe(primero.ruta)
    for (const ruta of [primero.ruta, segundo.ruta]) {
      const copia = new Database(ruta, { readonly: true })
      try {
        expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
      } finally {
        copia.close()
      }
    }
  } finally {
    vi.useRealTimers()
  }
})
