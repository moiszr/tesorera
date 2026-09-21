-- Las transiciones de datos con respaldo se completan una sola vez al arrancar.
CREATE TABLE actualizaciones (
  nombre TEXT PRIMARY KEY,
  aplicada_en TEXT NOT NULL DEFAULT (datetime('now')),
  detalle TEXT NOT NULL
);
