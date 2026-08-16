-- El pastor de cada iglesia.
--
-- Va como campo de la iglesia y no como tabla aparte a propósito: lo que hace
-- falta es agrupar y filtrar, no llevarle una ficha al pastor. Un pastor puede
-- tener varias iglesias (por eso el filtro tiene sentido); una iglesia tiene
-- un pastor. Si algún día hace falta más, esto se migra sin perder nada.

ALTER TABLE iglesias ADD COLUMN pastor TEXT;

-- Para agrupar sin que "Juan Pérez" y "juan perez" salgan como dos pastores
-- distintos. Se mantiene desde la app, igual que personas.nombre_busqueda.
ALTER TABLE iglesias ADD COLUMN pastor_busqueda TEXT NOT NULL DEFAULT '';

CREATE INDEX idx_iglesias_pastor ON iglesias(pastor_busqueda);
