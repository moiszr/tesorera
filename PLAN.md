# PLAN — Tesorera

Sistema local de control de pagos para convenciones de iglesia.
Usuaria única: la mamá de Moises, en su laptop, sin internet requerido.

---

## 1. Visión

En octubre hay una convención. Los hermanos de varias iglesias van pagando su
cupo poco a poco (abonos). Hoy eso se lleva en papel o en la memoria. Tesorera
lo convierte en:

- Una lista clara de personas con su estado de pago de un vistazo.
- Un historial confiable por persona: cuándo pagó, cuánto, cuánto le falta.
- Registrar un abono en menos de 10 segundos.
- Precios distintos para adultos y niños, configurables por evento.
- Separación por iglesia (etiqueta + filtro, sin complicar la navegación).
- Totales del evento: cuánto se ha recaudado y cuánto falta.

## 2. La usuaria

- Señora adulta, no técnica, usa la laptop lo básico.
- Español únicamente. Moneda RD$.
- Puede equivocarse al digitar → todo error debe poder corregirse (anular pago,
  editar persona) sin perder historial.
- No debe instalar nada ni abrir una terminal: doble clic en un ícono y la app abre.

## 3. Decisiones técnicas

| Decisión | Elección | Por qué |
|---|---|---|
| Tipo de app | Web local servida por un proceso Node | Un solo stack, cero fricción de distribución; con el launcher se siente como app de escritorio |
| Datos | SQLite (`better-sqlite3`), archivo `data/tesorera.db` | Un solo archivo = respaldo trivial (copiarlo), rapidísimo, cero configuración, sobrevive a limpiar el navegador (localStorage NO es opción: datos sagrados) |
| Backend | Hono + `@hono/node-server` | Mínimo, rápido, TypeScript de punta a punta |
| Frontend | React + Vite + TS + Tailwind | Iteración rápida y compatible con todas las skills de diseño |
| ORM | Ninguno — SQL directo con `better-sqlite3` | La app tiene 5 tablas; un ORM solo agrega peso |
| Distribución | `git clone` en la laptop + launcher de doble clic | El launcher instala dependencias la primera vez y luego solo arranca y abre el navegador |
| Modo app | El launcher intenta abrir Chrome/Edge en modo `--app=` (ventana sin pestañas ni barra de direcciones) y cae al navegador normal si no existe | Sensación de aplicación nativa sin Electron/Tauri |

Futuro opcional (NO ahora): envolver en Tauri si algún día se quiere un `.app`
instalable de verdad. La arquitectura ya lo permite porque todo es web + SQLite.

## 4. Estructura del proyecto

```
tesorera/
├── CLAUDE.md
├── PLAN.md
├── PROMPTS.md
├── package.json            # workspace único (front + server juntos)
├── vite.config.ts          # proxy /api → localhost:5177 en dev
├── tailwind.config.ts
├── index.html
├── src/                    # frontend
│   ├── main.tsx
│   ├── App.tsx             # rutas (react-router)
│   ├── pages/
│   │   ├── Inicio.tsx
│   │   ├── Personas.tsx
│   │   ├── FichaPersona.tsx
│   │   ├── RegistrarPago.tsx
│   │   └── Ajustes.tsx
│   ├── components/
│   ├── api/                # cliente fetch tipado
│   └── lib/                # dinero.ts, fechas.ts, estados.ts
├── server/
│   ├── index.ts            # arranque: migrar, respaldar, servir api + dist, abrir navegador
│   ├── rutas/              # personas.ts, pagos.ts, iglesias.ts, eventos.ts, resumen.ts, exportar.ts
│   └── db/
│       ├── conexion.ts
│       ├── migraciones/    # 001_inicial.sql, ...
│       ├── consultas.ts    # TODA la lógica de balances y estados
│       └── seed.ts
├── data/                   # gitignored (excepto .gitkeep)
│   ├── tesorera.db
│   └── respaldos/
├── launchers/
│   ├── Tesorera.command    # macOS
│   └── Tesorera.bat        # Windows
└── tests/                  # dinero, estados, anulación de pagos
```

## 5. Modelo de datos (SQLite)

Dinero siempre en **centavos INTEGER**. Nada se borra: `archivado`/`anulado`.

```sql
CREATE TABLE iglesias (
  id         INTEGER PRIMARY KEY,
  nombre     TEXT NOT NULL UNIQUE,
  color      TEXT NOT NULL DEFAULT 'gris',      -- para la etiqueta visual
  archivada  INTEGER NOT NULL DEFAULT 0,
  creada_en  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE eventos (
  id             INTEGER PRIMARY KEY,
  nombre         TEXT NOT NULL,                 -- "Convención Octubre 2026"
  fecha_inicio   TEXT,
  fecha_fin      TEXT,
  precio_adulto  INTEGER NOT NULL,              -- centavos
  precio_nino    INTEGER NOT NULL,              -- centavos
  activo         INTEGER NOT NULL DEFAULT 0     -- solo uno activo a la vez
);

CREATE TABLE personas (
  id          INTEGER PRIMARY KEY,
  nombre      TEXT NOT NULL,                    -- nombre completo, un solo campo
  iglesia_id  INTEGER REFERENCES iglesias(id),
  telefono    TEXT,
  notas       TEXT,
  archivada   INTEGER NOT NULL DEFAULT 0,
  creada_en   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inscripciones (
  id          INTEGER PRIMARY KEY,
  persona_id  INTEGER NOT NULL REFERENCES personas(id),
  evento_id   INTEGER NOT NULL REFERENCES eventos(id),
  categoria   TEXT NOT NULL CHECK (categoria IN ('adulto','nino')),
  precio      INTEGER NOT NULL,                 -- foto del precio al inscribir; editable (descuentos/becas)
  creada_en   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (persona_id, evento_id)
);

CREATE TABLE pagos (
  id              INTEGER PRIMARY KEY,
  inscripcion_id  INTEGER NOT NULL REFERENCES inscripciones(id),
  monto           INTEGER NOT NULL CHECK (monto > 0),  -- centavos
  fecha           TEXT NOT NULL DEFAULT (date('now')),
  metodo          TEXT NOT NULL DEFAULT 'efectivo',    -- efectivo | transferencia | otro
  nota            TEXT,
  anulado         INTEGER NOT NULL DEFAULT 0,
  creado_en       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_pagos_inscripcion ON pagos(inscripcion_id);
CREATE INDEX idx_inscripciones_evento ON inscripciones(evento_id);
CREATE INDEX idx_personas_nombre ON personas(nombre);
```

**Derivados (nunca almacenados, siempre calculados en `consultas.ts`):**

- `pagado = SUM(monto) WHERE anulado = 0`
- `balance = precio - pagado`
- Estado: `pagado >= precio` → **Pagado** · `0 < pagado < precio` → **Abonando**
  · `pagado = 0` → **Sin pagos**. Si `pagado > precio`, mostrar aviso discreto
  de excedente ("Pagó RD$ X de más").

**Reglas de negocio:**

- Al crear una persona con un evento activo, se crea su inscripción de una vez
  (categoría elegida → precio del evento se copia como foto).
- Cambiar la categoría de una inscripción actualiza el precio SOLO si el precio
  no fue editado manualmente (marcar con comparación contra precio del evento,
  o simplemente preguntar: "¿Actualizar el precio a RD$ X?").
- Cambiar el precio del evento NO cambia inscripciones existentes en silencio;
  ofrece un botón explícito "Aplicar nuevo precio a quienes no han pagado completo".
- Anular un pago exige confirmación y pide una nota opcional del porqué.

## 6. API (JSON, prefijo `/api`)

```
GET    /resumen                      → totales del evento activo + últimos pagos
GET    /iglesias                     → lista (con conteo de personas)
POST   /iglesias                     → { nombre, color }
PATCH  /iglesias/:id                 → editar / archivar

GET    /eventos                      → lista
POST   /eventos                      → crear (desactiva el resto si activo=1)
PATCH  /eventos/:id                  → editar precios / activar
POST   /eventos/:id/aplicar-precios  → recalcular inscripciones sin pago completo

GET    /personas?buscar=&iglesia=&estado=&categoria=&orden=
       → lista con { pagado, balance, estado } ya calculados
POST   /personas                     → { nombre, iglesia_id, categoria, telefono?, notas? }
GET    /personas/:id                 → ficha completa: datos + inscripción + pagos + totales
PATCH  /personas/:id                 → editar / archivar
PATCH  /inscripciones/:id            → cambiar categoría / precio

POST   /pagos                        → { inscripcion_id, monto, fecha?, metodo?, nota? }
POST   /pagos/:id/anular             → { nota? }

GET    /exportar.csv?evento_id=      → CSV con BOM UTF-8 (abre bien en Excel)
POST   /respaldo                     → copia data/tesorera.db → data/respaldos/ y devuelve la ruta
```

La búsqueda ignora tildes y mayúsculas ("jose" encuentra "José").

## 7. Pantallas y flujos

**Navegación:** barra lateral fija (o superior en ventanas angostas) con solo
4 entradas grandes: **Inicio · Personas · Registrar pago · Ajustes**. La página
de iglesias vive dentro de Ajustes.

### 7.1 Inicio
- Nombre del evento activo y cuánto falta para la fecha ("Faltan 52 días").
- Barra de progreso grande: recaudado vs. meta total, con RD$ en números grandes.
- 4 cifras: Recaudado · Pendiente · Personas inscritas · Pagados completos.
- Botones principales: **Registrar pago** (protagonista) y **Agregar persona**.
- "Últimos pagos": lista de los 8 más recientes (persona, monto, fecha relativa
  "hoy", "ayer"), cada uno clicable hacia la ficha.
- Desglose compacto por iglesia (recaudado/pendiente por iglesia).

### 7.2 Personas
- Búsqueda grande arriba (autofoco), resultados al instante mientras escribe.
- Filtros como chips: por iglesia, por estado (Pagado/Abonando/Sin pagos),
  por categoría (Adultos/Niños). Contadores en cada chip.
- Cada fila: nombre grande, etiqueta de iglesia con su color, categoría,
  mini barra de progreso, `RD$ pagado / RD$ precio`, chip de estado.
- Clic en la fila → ficha. Botón "＋ Agregar persona" siempre visible.
- Orden por defecto: alfabético; alternables "menos pagado primero" y "recientes".

### 7.3 Ficha de persona
- Encabezado: nombre, iglesia, categoría, teléfono.
- Tarjeta de cuenta: precio, pagado, **falta** (el número más grande de la
  pantalla), barra de progreso, chip de estado.
- Botón protagonista: **Registrar abono** (abre el flujo de pago con la persona
  ya seleccionada).
- Historial: línea de tiempo de pagos (fecha, monto, método, nota), los anulados
  visibles tachados con su motivo. Acción "Anular" por pago con confirmación.
- Menú discreto: editar datos, cambiar categoría/precio, archivar.

### 7.4 Registrar pago (el flujo estrella)
1. **¿Quién?** — buscador grande; al escribir 2 letras aparecen resultados con
   foto de su balance ("Le faltan RD$ 2,000"). Enter o clic selecciona.
2. **¿Cuánto?** — campo de monto gigante con teclado numérico, botones rápidos
   (RD$ 500 · 1,000 · el balance exacto "Saldar: RD$ 2,000"), fecha de hoy
   editable, método (Efectivo/Transferencia/Otro) como botones.
3. **Confirmar** — resumen en una frase: "María Pérez abona RD$ 1,000 · le
   faltarán RD$ 1,000". Botón grande **Guardar pago**.

Éxito: toast "Pago guardado ✓" + la pantalla queda lista para el siguiente pago
(porque los pagos llegan en fila los domingos). Enlace "Ver a María".

### 7.5 Ajustes
- Evento: nombre, fechas, precio adulto, precio niño (+ botón de aplicar precios).
- Iglesias: lista simple para agregar/renombrar/archivar y elegir color.
- Datos: botón **Hacer respaldo ahora** (muestra dónde quedó), nota de que la app
  respalda sola al abrir, y botón **Exportar a Excel (CSV)**.
- Sección "Acerca de" mínima con la versión.

## 8. Dirección de diseño

Ejecutar `/impeccable init` (superficie: **product**) y dejar que las skills
(`high-end-visual-design`, `minimalist-ui`, skills de Emil) definan los detalles,
con estas restricciones fijas:

- **Concepto:** la libreta de tesorería de toda la vida, elevada. Herramienta de
  trabajo seria y cálida; nada de estética de startup ni de landing.
- **Los números son los protagonistas:** montos en tipografía tabular, tamaño
  generoso, alineados a la derecha en listas.
- **El color comunica estado, no decora:** verde=pagado, ámbar=abonando,
  gris=sin pagos, y un solo color de acento para acciones. Prohibidos los
  degradados morados/azules y el "modo tarjeta dentro de tarjeta".
- Tipografía: una familia con dígitos tabulares excelentes para datos; evitar
  Inter-por-defecto. Elegir con intención (las skills deciden cuál).
- Movimiento: microtransiciones útiles (aparición de resultados de búsqueda,
  toast, actualización de barra de progreso al guardar un pago — ese momento
  merece la animación estrella). Sin bounce, sin parallax, respetar
  `prefers-reduced-motion`.
- Accesibilidad: contraste AA mínimo, foco visible, todo operable con teclado,
  textos de estado no dependientes solo del color (chip lleva texto).

## 9. Fases de implementación

Cada fase termina con: la app corriendo, la fase probada a mano, `npm test`
en verde y un commit con mensaje claro. No avanzar con criterios pendientes.

### Fase 0 — Esqueleto
Scaffold completo (Vite+React+TS+Tailwind, Hono, better-sqlite3), migración
001, conexión y respaldo al arrancar, layout con navegación de 4 entradas,
página Inicio placeholder, `npm run dev` y `npm start` funcionando.
**Criterio:** clonar → `npm install` → `npm start` abre el navegador con la app.

### Fase 1 — Datos maestros
CRUD de iglesias (en Ajustes), crear/editar evento con precios, crear persona
(nombre, iglesia, adulto/niño → inscripción automática al evento activo),
lista de Personas con búsqueda sin tildes y filtros.
**Criterio:** puedo crear 2 iglesias, el evento de octubre con sus 2 precios,
10 personas mezcladas, y filtrarlas por iglesia y categoría.

### Fase 2 — Pagos
Flujo Registrar pago completo (3 pasos), historial en la ficha, estados y
balances calculados en `consultas.ts` con tests, anulación con confirmación,
edición de categoría/precio con las reglas de la sección 5.
**Criterio:** registrar un abono toma < 10 segundos; anular un pago lo deja
tachado en el historial y corrige el balance; los tests de dinero pasan.

### Fase 3 — Inicio y visibilidad
Página Inicio real (totales, progreso, últimos pagos, desglose por iglesia),
chips con contadores en Personas, orden "menos pagado primero".
**Criterio:** con el seed cargado, Inicio cuenta la historia del evento de un
vistazo y cada número cuadra con la lista de personas.

### Fase 4 — Pulido de diseño
Pasada profunda con las skills: `/impeccable shape` por pantalla si hace falta
rediseñar, luego `/impeccable polish`, `/impeccable audit` y
`/impeccable critique`; skills de Emil para revisar/mejorar cada animación;
estados vacíos escritos con cariño; revisar textos de toda la UI en voz de la
usuaria.
**Criterio:** cero hallazgos graves del audit; la app se ve intencional, no
genérica; una persona no técnica entiende cada pantalla sin explicación.

### Fase 5 — Tranquilidad y entrega
- Respaldos: al arrancar (mantener últimos 30) + botón manual + exportar CSV.
- Launchers `Tesorera.command` y `Tesorera.bat` (sección 10) probados.
- `README-MAMA.md`: guía para la usuaria con pasos e imágenes simples
  (cómo abrir, registrar un pago, agregar persona, hacer respaldo).
- README.md técnico corto para Moises (instalar en la laptop, actualizar).
**Criterio:** en una laptop Windows limpia con Node LTS y Git instalados:
clonar, doble clic a `Tesorera.bat`, y la app abre con todo funcionando.

### Fase 6 — Ensayo general
Cargar seed realista (60+ personas, 3 iglesias, pagos variados), recorrer los
flujos como si fueras la usuaria un domingo con fila de gente: 10 pagos
seguidos, un error digitado y anulado, una persona nueva a mitad de la fila.
Corregir toda fricción encontrada. Vaciar la base para la entrega
(`npm run reset` con confirmación) dejando solo el evento configurado.

### Extras (solo si todo lo anterior quedó impecable)
- Comprobante de pago imprimible / imagen para compartir por WhatsApp.
- Reporte imprimible por iglesia (para rendir cuentas al final).

## 10. Launchers

**La laptop destino es Windows:** `Tesorera.bat` es el launcher principal, el
que se perfecciona y se prueba de punta a punta. El `.command` de macOS queda
solo como cortesía para probar en la Mac de desarrollo. Importante: agregar un
`.gitattributes` con `*.bat text eol=crlf` para que el `.bat` no se rompa al
clonar (los `.bat` necesitan finales de línea CRLF).

`launchers/Tesorera.command` (macOS — dar `chmod +x`):

```bash
#!/bin/bash
cd "$(dirname "$0")/.."
git pull --ff-only --quiet 2>/dev/null   # actualiza si hay internet; si no, sigue
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  npm install
fi
npm start   # start compila si dist falta o está viejo, respalda la DB y abre el navegador
```

`launchers/Tesorera.bat` (Windows — el principal): mismo flujo con `git pull`
silencioso, `npm install` condicional y `npm start`, con la ventana de consola
minimizada o cerrándose sola tras abrir el navegador. En la laptop se le crea
un acceso directo en el Escritorio llamado "Tesorera" (con ícono propio si es
posible).

`npm start` (server/index.ts) al final de arrancar intenta, en orden:
Chrome/Edge en modo app (`--app=http://localhost:5177`) → navegador por defecto.
Si el puerto ya está en uso (la app ya está abierta), solo abre el navegador.

Instrucción para la laptop: crear un alias/acceso directo del launcher en el
Escritorio o el Dock con el nombre "Tesorera".

## 11. Seed de ejemplo

`npm run seed` crea: 3 iglesias con colores distintos; el evento "Convención
Octubre 2026" activo (adulto RD$ 3,500 / niño RD$ 1,500); ~60 personas con
nombres dominicanos realistas repartidas entre iglesias y categorías; pagos
variados que produzcan los tres estados, incluyendo 2 pagos anulados y una
persona con excedente. El seed NUNCA corre solo en producción.
