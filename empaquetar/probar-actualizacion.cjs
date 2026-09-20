// Solo se ejecuta en CI, con datos ficticios. No viaja en el instalador.
const { mkdirSync, readFileSync, readdirSync } = require('node:fs')
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
    for (const archivo of ['001_inicial.sql', '002_pastor.sql']) {
      db.exec(readFileSync(join(paquete, 'app', 'migraciones', archivo), 'utf8'))
      db.prepare('INSERT INTO migraciones(nombre) VALUES (?)').run(archivo)
    }
    db.exec(`INSERT INTO iglesias(id,nombre) VALUES(1,'Iglesia de prueba de actualización');
      INSERT INTO eventos(id,nombre,activo) VALUES(1,'Evento de prueba',1);
      INSERT INTO categorias(id,evento_id,nombre,precio) VALUES(1,1,'Cupo de prueba',350000);
      INSERT INTO personas(id,nombre,nombre_busqueda,iglesia_id) VALUES(1,'Persona de prueba','persona de prueba',1);
      INSERT INTO inscripciones(id,persona_id,evento_id,categoria_id,precio) VALUES(1,1,1,1,350000);
      INSERT INTO pagos(id,inscripcion_id,monto,fecha) VALUES(1,1,125050,'2026-09-20');
      INSERT INTO pagos(id,inscripcion_id,monto,fecha,anulado,nota_anulacion) VALUES(2,1,10000,'2026-09-19',1,'Prueba');`)
  } else if (modo === 'verificar') {
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok')
    assert.deepEqual(db.prepare('SELECT id,monto,anulado FROM pagos ORDER BY id').all(), [
      { id: 1, monto: 125050, anulado: 0 },
      { id: 2, monto: 10000, anulado: 1 },
    ])
    assert.deepEqual(db.prepare('SELECT precio,habitacion_id,extra_habitacion FROM inscripciones').get(), {
      precio: 350000,
      habitacion_id: null,
      extra_habitacion: 0,
    })
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM migraciones').get().n, 4)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM habitaciones').get().n, 0)
    const copias = readdirSync(join(datos, 'respaldos')).filter((f) => f.endsWith('.db'))
    assert.ok(copias.length > 0, 'No se creó respaldo')
    const copia = new Database(join(datos, 'respaldos', copias.sort().at(-1)), { readonly: true })
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
