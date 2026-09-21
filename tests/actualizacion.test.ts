import { afterEach, beforeEach, expect, it } from 'vitest'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import Database from 'better-sqlite3'
process.env.TESORERA_DB = ':memory:'
const { conectar, cerrar } = await import('../server/db/conexion')
const { completarActualizacion } = await import('../server/db/actualizacion')
let db: ReturnType<typeof conectar>, carpeta: string
beforeEach(() => {
  cerrar()
  db = conectar()
  carpeta = mkdtempSync(join(tmpdir(), 'tesorera-transicion-'))
  db.exec(`INSERT INTO eventos(id,nombre,activo) VALUES(1,'Prueba',1);
    INSERT INTO categorias(id,evento_id,nombre,precio,extra_privado) VALUES(1,1,'General',350000,100000);
    INSERT INTO personas(id,nombre,nombre_busqueda,archivada) VALUES(1,'Activa','activa',0),(2,'Archivada','archivada',1),(3,'Otra archivada','otra archivada',1);
    INSERT INTO habitaciones(id,evento_id,nombre,capacidad,extra_total) VALUES(1,1,'Grupo',3,100000);
    INSERT INTO inscripciones(id,persona_id,evento_id,categoria_id,precio,precio_a_mano,habitacion_id,extra_habitacion) VALUES(1,1,1,1,123400,1,1,33334),(2,2,1,1,350000,0,1,33333),(3,3,1,1,350000,0,1,33333);
    INSERT INTO pagos(id,inscripcion_id,monto) VALUES(1,1,10000),(2,2,22200),(3,3,33300);`)
})
afterEach(() => {
  cerrar()
  rmSync(carpeta, { recursive: true, force: true })
})
it('respalda antes, elimina solo archivadas, conserva pagos y precios activos y reparte exactamente el extra', () => {
  completarActualizacion(db, carpeta)
  expect(db.prepare('SELECT id FROM personas').all()).toEqual([{ id: 1 }])
  expect(db.prepare('SELECT id,monto FROM pagos').all()).toEqual([{ id: 1, monto: 10000 }])
  expect(db.prepare('SELECT precio,precio_a_mano,extra_habitacion FROM inscripciones').get()).toEqual({
    precio: 123400,
    precio_a_mano: 1,
    extra_habitacion: 100000,
  })
  const copia = new Database(join(carpeta, readdirSync(carpeta)[0]), { readonly: true })
  try {
    expect(copia.prepare('SELECT COUNT(*) n FROM personas').get()).toEqual({ n: 3 })
    expect(copia.prepare('SELECT COUNT(*) n FROM pagos').get()).toEqual({ n: 3 })
    expect(copia.pragma('integrity_check', { simple: true })).toBe('ok')
  } finally {
    copia.close()
  }
  completarActualizacion(db, carpeta)
  expect(readdirSync(carpeta)).toHaveLength(1)
  expect(db.prepare('SELECT COUNT(*) n FROM actualizaciones').get()).toEqual({ n: 1 })
})
it('si falla la limpieza revierte todo y permite reintentar conservando el respaldo anterior', () => {
  db.exec(
    "CREATE TRIGGER fallo BEFORE DELETE ON personas WHEN OLD.id=3 BEGIN SELECT RAISE(ABORT,'Prueba'); END",
  )
  expect(() => completarActualizacion(db, carpeta)).toThrow('Prueba')
  expect(db.prepare('SELECT COUNT(*) n FROM personas').get()).toEqual({ n: 3 })
  expect(db.prepare('SELECT extra_habitacion FROM inscripciones WHERE id=1').get()).toEqual({
    extra_habitacion: 33334,
  })
  expect(db.prepare('SELECT COUNT(*) n FROM actualizaciones').get()).toEqual({ n: 0 })
  db.exec('DROP TRIGGER fallo')
  completarActualizacion(db, carpeta)
  expect(readdirSync(carpeta)).toHaveLength(2)
})
it('si no puede crear la copia no elimina ni marca la transición como terminada', () => {
  const ocupado = join(carpeta, 'archivo')
  writeFileSync(ocupado, 'prueba')
  expect(() => completarActualizacion(db, ocupado)).toThrow()
  expect(db.prepare('SELECT COUNT(*) n FROM personas').get()).toEqual({ n: 3 })
  expect(db.prepare('SELECT COUNT(*) n FROM actualizaciones').get()).toEqual({ n: 0 })
})
