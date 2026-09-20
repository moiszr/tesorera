-- El suplemento de una habitación nunca reemplaza el precio del cupo.
ALTER TABLE categorias ADD COLUMN extra_privado INTEGER CHECK (extra_privado IS NULL OR extra_privado >= 0);

CREATE TABLE habitaciones (
  id INTEGER PRIMARY KEY,
  evento_id INTEGER NOT NULL REFERENCES eventos(id),
  nombre TEXT NOT NULL,
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  categoria_privada_id INTEGER REFERENCES categorias(id),
  extra_total INTEGER NOT NULL DEFAULT 0 CHECK (extra_total >= 0),
  notas TEXT,
  archivada INTEGER NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 1,
  creada_en TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(evento_id, nombre)
);
ALTER TABLE inscripciones ADD COLUMN habitacion_id INTEGER REFERENCES habitaciones(id);
ALTER TABLE inscripciones ADD COLUMN extra_habitacion INTEGER NOT NULL DEFAULT 0 CHECK (extra_habitacion >= 0);
CREATE INDEX idx_inscripciones_habitacion ON inscripciones(habitacion_id);

-- Conserva las asignaciones y los repartos anteriores para poder revisarlos.
CREATE TABLE cambios_habitaciones (
  id INTEGER PRIMARY KEY,
  evento_id INTEGER NOT NULL REFERENCES eventos(id),
  detalle TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
