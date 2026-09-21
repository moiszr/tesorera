// Solo se ejecuta en CI, con datos ficticios. No viaja en el instalador.
const { mkdirSync, readFileSync, readdirSync, statSync } = require('node:fs')
const { join, resolve } = require('node:path')
const assert = require('node:assert/strict')
const [modo, destino, paquete] = process.argv.slice(2)
const Database = require(join(resolve(paquete), 'app', 'node_modules', 'better-sqlite3'))
const datos = join(destino, 'data')
mkdirSync(datos, { recursive: true })
const db = new Database(join(datos, 'tesorera.db'))
try {
  if (modo === 'preparar') {
    db.exec(
      "CREATE TABLE migraciones (nombre TEXT PRIMARY KEY, aplicada_en TEXT NOT NULL DEFAULT (datetime('now')))",
    )
    for (const archivo of [
      '001_inicial.sql',
      '002_pastor.sql',
      '003_habitaciones.sql',
      '004_alojamiento.sql',
    ]) {
      db.exec(readFileSync(join(paquete, 'app', 'migraciones', archivo), 'utf8'))
      db.prepare('INSERT INTO migraciones(nombre) VALUES (?)').run(archivo)
    }
    db.exec(`INSERT INTO iglesias(id,nombre) VALUES(1,'Iglesia de prueba de actualización');
      INSERT INTO eventos(id,nombre,activo) VALUES(1,'Evento de prueba',1);
      INSERT INTO categorias(id,evento_id,nombre,precio) VALUES(1,1,'Cupo de prueba',350000);
      INSERT INTO personas(id,nombre,nombre_busqueda,iglesia_id) VALUES(1,'Persona de prueba','persona de prueba',1);
      INSERT INTO inscripciones(id,persona_id,evento_id,categoria_id,precio) VALUES(1,1,1,1,350000);
      INSERT INTO pagos(id,inscripcion_id,monto,fecha) VALUES(1,1,125050,'2026-09-20');
      INSERT INTO pagos(id,inscripcion_id,monto,fecha,anulado,nota_anulacion) VALUES(2,1,10000,'2026-09-19',1,'Prueba');
      INSERT INTO personas(id,nombre,nombre_busqueda,archivada) VALUES(2,'Archivada de prueba','archivada de prueba',1);
      INSERT INTO inscripciones(id,persona_id,evento_id,categoria_id,precio) VALUES(2,2,1,1,350000);
      INSERT INTO pagos(id,inscripcion_id,monto,fecha) VALUES(3,2,55555,'2026-09-18');
      INSERT INTO personas(id,nombre,nombre_busqueda) VALUES(3,'Activa con descuento','activa con descuento');
      INSERT INTO inscripciones(id,persona_id,evento_id,categoria_id,precio,precio_a_mano) VALUES(3,3,1,1,200000,1);
      INSERT INTO habitaciones(id,evento_id,nombre,capacidad,categoria_privada_id,extra_total) VALUES(1,1,'Privada de prueba',3,1,100000);
      UPDATE inscripciones SET habitacion_id=1,extra_habitacion=50000 WHERE id IN (2,3);`)
  } else if (modo === 'verificar') {
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok')
    assert.deepEqual(db.prepare('SELECT id,monto,anulado FROM pagos ORDER BY id').all(), [
      { id: 1, monto: 125050, anulado: 0 },
      { id: 2, monto: 10000, anulado: 1 },
    ])
    assert.deepEqual(
      db.prepare('SELECT precio,habitacion_id,extra_habitacion FROM inscripciones WHERE id=1').get(),
      {
        precio: 350000,
        habitacion_id: null,
        extra_habitacion: 0,
      },
    )
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM migraciones').get().n, 6)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM habitaciones').get().n, 1)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM personas WHERE archivada<>0').get().n, 0)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM personas').get().n, 2)
    assert.deepEqual(
      db.prepare('SELECT precio,precio_a_mano,extra_habitacion FROM inscripciones WHERE id=3').get(),
      { precio: 200000, precio_a_mano: 1, extra_habitacion: 100000 },
    )
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), [])
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM actualizaciones').get().n, 1)
    const protegida = readdirSync(join(datos, 'respaldos')).find((f) =>
      f.startsWith('tesorera-antes-v1.2.0-'),
    )
    assert.ok(protegida, 'Falta el respaldo previo a la limpieza')
    const previa = new Database(join(datos, 'respaldos', protegida), { readonly: true })
    try {
      assert.equal(previa.prepare('SELECT COUNT(*) AS n FROM personas').get().n, 3)
      assert.equal(previa.prepare('SELECT monto FROM pagos WHERE id=3').get().monto, 55555)
      assert.equal(
        previa.prepare('SELECT extra_habitacion FROM inscripciones WHERE id=3').get().extra_habitacion,
        50000,
      )
    } finally {
      previa.close()
    }
    const copias = readdirSync(join(datos, 'respaldos')).filter(
      (f) => f.endsWith('.db') && !f.startsWith('tesorera-antes-'),
    )
    assert.ok(copias.length > 0, 'No se creó respaldo')
    const copia = new Database(join(datos, 'respaldos', copias.sort((a,b) => statSync(join(datos,'respaldos',a)).mtimeMs - statSync(join(datos,'respaldos',b)).mtimeMs).at(-1)), { readonly: true })
    try {
      assert.equal(copia.pragma('integrity_check', { simple: true }), 'ok')
      assert.equal(copia.prepare('SELECT SUM(monto) AS n FROM pagos WHERE anulado = 0').get().n, 125050)
    } finally {
      copia.close()
    }
  } else {
    throw new Error('Modo desconocido')
  }
  console.log(`OK: actualización ${modo}`)
} finally {
  db.close()
}
