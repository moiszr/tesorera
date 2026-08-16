-- Tesorera — esquema inicial.
-- Dinero siempre en CENTAVOS como INTEGER. Nada se borra: se archiva o se anula.

CREATE TABLE iglesias (
  id         INTEGER PRIMARY KEY,
  nombre     TEXT NOT NULL UNIQUE,
  color      TEXT NOT NULL DEFAULT 'arcilla',
  archivada  INTEGER NOT NULL DEFAULT 0,
  creada_en  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE eventos (
  id            INTEGER PRIMARY KEY,
  nombre        TEXT NOT NULL,
  fecha_inicio  TEXT,
  fecha_fin     TEXT,
  activo        INTEGER NOT NULL DEFAULT 0,
  creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Los precios viven aquí, no en el evento. Cada evento define sus propios
-- tipos de cupo (edad + alojamiento) y la usuaria puede agregar más cuando quiera.
CREATE TABLE categorias (
  id         INTEGER PRIMARY KEY,
  evento_id  INTEGER NOT NULL REFERENCES eventos(id),
  nombre     TEXT NOT NULL,
  precio     INTEGER NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 0,
  archivada  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (evento_id, nombre)
);

CREATE TABLE personas (
  id               INTEGER PRIMARY KEY,
  nombre           TEXT NOT NULL,
  -- nombre sin tildes y en minúsculas, para que "jose" encuentre a "José"
  nombre_busqueda  TEXT NOT NULL DEFAULT '',
  iglesia_id       INTEGER REFERENCES iglesias(id),
  telefono         TEXT,
  notas            TEXT,
  archivada        INTEGER NOT NULL DEFAULT 0,
  creada_en        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inscripciones (
  id            INTEGER PRIMARY KEY,
  persona_id    INTEGER NOT NULL REFERENCES personas(id),
  evento_id     INTEGER NOT NULL REFERENCES eventos(id),
  categoria_id  INTEGER NOT NULL REFERENCES categorias(id),
  -- foto del precio al inscribir; editable a mano (becas, descuentos)
  precio        INTEGER NOT NULL,
  -- 1 cuando alguien editó el precio a mano: aplicar precios nuevos no lo pisa
  precio_a_mano INTEGER NOT NULL DEFAULT 0,
  creada_en     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (persona_id, evento_id)
);

CREATE TABLE pagos (
  id              INTEGER PRIMARY KEY,
  inscripcion_id  INTEGER NOT NULL REFERENCES inscripciones(id),
  monto           INTEGER NOT NULL CHECK (monto > 0),
  fecha           TEXT NOT NULL DEFAULT (date('now')),
  metodo          TEXT NOT NULL DEFAULT 'efectivo',
  nota            TEXT,
  anulado         INTEGER NOT NULL DEFAULT 0,
  nota_anulacion  TEXT,
  anulado_en      TEXT,
  creado_en       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_pagos_inscripcion     ON pagos(inscripcion_id);
CREATE INDEX idx_inscripciones_evento  ON inscripciones(evento_id);
CREATE INDEX idx_inscripciones_persona ON inscripciones(persona_id);
CREATE INDEX idx_inscripciones_categoria ON inscripciones(categoria_id);
CREATE INDEX idx_categorias_evento     ON categorias(evento_id);
CREATE INDEX idx_personas_busqueda     ON personas(nombre_busqueda);
