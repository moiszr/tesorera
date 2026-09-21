-- Un enlace antiguo nunca debe abrir otra persona o comprobante tras eliminar.
CREATE TABLE identificadores (tabla TEXT PRIMARY KEY, ultimo INTEGER NOT NULL);
INSERT INTO identificadores VALUES ('personas', (SELECT COALESCE(MAX(id),0) FROM personas));
INSERT INTO identificadores VALUES ('inscripciones', (SELECT COALESCE(MAX(id),0) FROM inscripciones));
INSERT INTO identificadores VALUES ('pagos', (SELECT COALESCE(MAX(id),0) FROM pagos));
CREATE TRIGGER personas_identificador AFTER INSERT ON personas BEGIN
  UPDATE identificadores SET ultimo=MAX(ultimo,NEW.id) WHERE tabla='personas';
END;
CREATE TRIGGER inscripciones_identificador AFTER INSERT ON inscripciones BEGIN
  UPDATE identificadores SET ultimo=MAX(ultimo,NEW.id) WHERE tabla='inscripciones';
END;
CREATE TRIGGER pagos_identificador AFTER INSERT ON pagos BEGIN
  UPDATE identificadores SET ultimo=MAX(ultimo,NEW.id) WHERE tabla='pagos';
END;
