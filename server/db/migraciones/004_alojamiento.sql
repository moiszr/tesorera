-- No se deduce alojamiento a partir de nombres configurables.
ALTER TABLE categorias ADD COLUMN incluye_alojamiento INTEGER NOT NULL DEFAULT 1 CHECK (incluye_alojamiento IN (0,1));
