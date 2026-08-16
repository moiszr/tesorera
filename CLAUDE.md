# Tesorera — Control de pagos para convenciones

## Contexto

App web 100% LOCAL para la mamá de Moises. Ella lleva el control de los pagos
(abonos parciales) de los hermanos de varias iglesias para una convención en
octubre. Corre en su laptop, sin publicarse en internet.

**La usuaria no es técnica.** Toda decisión de producto, texto y diseño se toma
pensando en una señora que usa la laptop lo básico. Si algo requiere explicación,
está mal diseñado.

## Reglas de oro (no negociables)

1. **Todo en español.** UI, mensajes, errores, fechas ("16 de agosto de 2026"),
   moneda en RD$ (pesos dominicanos). Cero palabras en inglés en la interfaz.
2. **Registrar un pago toma máximo 3 acciones:** buscar persona → escribir monto
   → confirmar. Este es EL flujo principal de la app; todo lo demás lo orbita.
3. **Los datos son sagrados.** Los pagos nunca se borran físicamente (se anulan
   con `anulado = 1` y quedan visibles tachados en el historial). Respaldo
   automático de la base de datos al iniciar. Confirmación clara antes de
   cualquier acción destructiva o de anulación.
4. **Cero jerga.** Nada de "registros", "sincronizar", "queries", "dashboard".
   Se dice: "personas", "pagos", "inicio", "respaldo", "lista".
5. **Tipografía grande y alto contraste.** Texto base ≥ 17px, montos de dinero
   prominentes con números tabulares (`font-variant-numeric: tabular-nums`),
   objetivos de clic ≥ 44px, foco de teclado visible.
6. **Estados de pago con colores consistentes en TODA la app:**
   - Pagado → verde
   - Abonando → ámbar/amarillo
   - Sin pagos → gris neutro (no rojo agresivo: son hermanos de iglesia, no morosos)
7. **Nunca dejarla perdida.** Estados vacíos que explican qué hacer, mensajes de
   éxito claros (toast con Sonner), y posibilidad de corregir errores (anular un
   pago mal digitado, editar una persona).

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Hono sobre Node 20 (`@hono/node-server`) + `better-sqlite3` (sin ORM)
- **Base de datos:** SQLite en `data/tesorera.db` — respaldos en `data/respaldos/`
- **Una sola app en producción:** el servidor Hono sirve `/api/*` y el frontend
  compilado (`dist/`) en el puerto **5177**
- **Toasts:** Sonner. **Animaciones:** sutiles, siguiendo las skills de Emil Kowalski.

## Comandos

- `npm run dev` — desarrollo (Vite en 5173 con proxy `/api` → servidor en 5177, ambos con watch)
- `npm run build` — compila el frontend a `dist/`
- `npm start` — modo "mamá": compila si hace falta, levanta el servidor, respalda la DB y abre el navegador
- `npm run seed` — carga datos de ejemplo realistas (solo desarrollo)
- `npm test` — pruebas de la lógica de dinero y estados (vitest)

## Convenciones

- Dinero en **centavos como INTEGER** en la DB. Helpers `formatoRD(centavos)` →
  `"RD$ 1,500"` (sin decimales si es .00) y `aCentavos(texto)` para parsear input.
- Fechas en ISO 8601 en la DB; helper para mostrarlas en español.
- Código (variables, funciones, tablas) en español simple y consistente:
  `personas`, `pagos`, `inscripciones`, `iglesias`, `eventos`, `categorias`.
- **El precio del cupo vive en las categorías, no en el evento.** Cada evento tiene
  sus propias categorías configurables (tipo de cupo/alojamiento: "Adulto —
  habitación familiar", "Niño", …), cada una con su precio en centavos. Nunca
  volver a codificar "adulto" y "niño" como valores fijos: la usuaria puede
  agregar tipos nuevos hasta el día del evento.
- La inscripción guarda una **foto del precio** al inscribir. Cambiar el precio de
  una categoría no reescribe inscripciones existentes en silencio: se ofrece un
  botón explícito para aplicarlo a quienes no han pagado completo.
- Frontend: componentes en `src/components/`, pantallas en `src/pages/`,
  cliente API en `src/api/`, helpers en `src/lib/`.
- Backend: `server/index.ts` (arranque), `server/rutas/`, `server/db/`
  (conexión, migraciones, consultas).
- La lógica de estados y balances vive en UN solo lugar (`server/db/consultas.ts`
  o `src/lib/estados.ts` compartido) — nunca duplicada.

## Diseño

Antes de maquetar cualquier pantalla, usa las skills de diseño instaladas:

- `/impeccable init` una sola vez al empezar; luego `/impeccable shape` antes de
  pantallas nuevas y `/impeccable polish` + `/impeccable audit` al final de cada fase.
- Skills de taste: `high-end-visual-design` (dirección principal) +
  `minimalist-ui` como contrapeso de sobriedad.
- Skills de Emil (`emil-design-eng`, `animate`, `review-animations`) para toda
  animación: entradas de listas, toasts, transiciones. Sutileza ante todo; nada
  de bounce/elastic.

Personalidad visual: **una libreta de tesorería moderna** — cálida, sobria,
confiable. Es una herramienta de trabajo (product UI), no una landing: la
claridad de los números y los estados manda sobre cualquier efecto.

## Qué NO hacer

- No agregar login, usuarios ni roles (es local, una sola usuaria).
- No agregar dependencias pesadas: nada de ORMs, Redux, Next.js, ni UI kits gigantes.
- No modo oscuro (por ahora). Un solo tema, bien hecho.
- No borrar datos físicamente. Anular/archivar siempre.
- No inglés en la UI, ni jerga técnica en mensajes de error.
- No pantallas de configuración complejas: los ajustes caben en una sola página simple.
