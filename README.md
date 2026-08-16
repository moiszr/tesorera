# Tesorera

Control de pagos (abonos parciales) para convenciones de iglesia. App web 100%
local: una sola usuaria, una sola laptop, sin internet, sin cuentas.

La guía de la usuaria está en [README-MAMA.md](README-MAMA.md).
El contexto de producto está en [PRODUCT.md](PRODUCT.md), el plan en
[PLAN.md](PLAN.md) y las reglas del proyecto en [CLAUDE.md](CLAUDE.md).

## Stack

React 18 + Vite + TypeScript + Tailwind al frente · Hono sobre Node 20 y
`better-sqlite3` (sin ORM) atrás · SQLite en `data/tesorera.db`.

En producción hay **un solo proceso**: Hono sirve `/api/*` y el `dist/` compilado
en el puerto **5177**.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Vite en 5173 con proxy `/api` → 5177, y el servidor con watch |
| `npm run build` | Compila el frontend a `dist/` |
| `npm start` | Modo mamá: compila si hace falta, respalda la base, levanta y abre el navegador en modo app |
| `npm run seed` | Carga datos de ejemplo (64 personas, 4 tipos de cupo). Solo desarrollo |
| `npm run reset` | Vacía personas y pagos, conserva evento e iglesias. Pide confirmación y respalda antes |
| `npm test` | Pruebas de dinero, estados, anulación y precios (vitest) |

## Instalar en la laptop de ella (Windows)

Requisitos: **Node LTS** y **Git** instalados.

```bat
git clone <url-del-repo> C:\Tesorera
cd C:\Tesorera
npm install
```

Después, crear un **acceso directo en el Escritorio** a
`launchers\Tesorera.bat` y llamarlo **Tesorera**. Con eso, doble clic y abre.

El launcher hace `git pull` silencioso (si hay internet), `npm install` si
cambió `package.json`, y `npm start`.

> `.gitattributes` fuerza CRLF en los `.bat`. No lo quites: un `.bat` con
> finales de línea LF no corre en Windows.

## Actualizar la app en su laptop

Con internet, el propio launcher hace `git pull` al abrir. Si hace falta a mano:

```bat
cd C:\Tesorera
git pull
npm install
npm run build
```

## Decisiones que conviene no romper

- **Dinero en centavos INTEGER.** Nunca decimales. `src/lib/dinero.ts` tiene
  `formatoRD()` y `aCentavos()`.
- **Los estados y balances se calculan en un solo lugar**: `src/lib/estados.ts`
  (lógica pura, compartida) y `server/db/consultas.ts` (las consultas). El
  frontend nunca vuelve a sumar pagos por su cuenta.
- **El precio vive en las categorías, no en el evento.** La inscripción guarda
  una *foto* del precio; `precio_a_mano = 1` marca las becas para que
  "aplicar precio" no las pise.
- **Nada se borra.** Pagos → `anulado = 1`. Personas e iglesias → `archivada = 1`.
- **La búsqueda ignora tildes**: `personas.nombre_busqueda` guarda el nombre
  normalizado; se actualiza en cada insert/update de persona.

## Respaldos

`server/db/respaldo.ts` copia `data/tesorera.db` a
`data/respaldos/tesorera-AAAA-MM-DD-HHMMSS.db` al arrancar y desde el botón de
Ajustes. Conserva los últimos 30.

Para restaurar: cerrar la app, copiar el respaldo encima de `data/tesorera.db`
(borrando también `tesorera.db-wal` y `tesorera.db-shm` si existen) y volver a
abrir.
