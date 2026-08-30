# Tesorera

Control de pagos (abonos parciales) para convenciones de iglesia. App web 100%
local: una sola usuaria, una sola laptop, sin internet, sin cuentas.

La guía de la usuaria está en [README-MAMA.md](README-MAMA.md).
El contexto de producto está en [PRODUCT.md](PRODUCT.md), el plan en
[PLAN.md](PLAN.md) y las reglas del proyecto en [CLAUDE.md](CLAUDE.md).

## Stack

React 18 + Vite + TypeScript + Tailwind al frente · Hono sobre Node 24 y
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

**No hace falta instalar nada previo.** Ni Node, ni Git, ni npm.

1. Ir a [Releases](../../releases) y bajar **`Tesorera-Instalador.exe`** (~19 MB).
2. Abrirlo. Windows avisa que el programa no es conocido —no está firmado—:
   **Más información → Ejecutar de todas formas**.
3. Listo: queda el icono en el Escritorio y en el menú de inicio.

El instalador lleva dentro el motor de Node y la app ya compilada. Se instala en
`%LOCALAPPDATA%\Programs\Tesorera`, en la carpeta del usuario y no en Archivos de
programa: así no pide permisos de administrador —ella no los tiene y no sabría
qué contestarle a la ventana azul— y la app puede escribir su base de datos al
lado suyo sin pelearse con los permisos de Windows.

### Cómo se arma ese instalador

Lo construye solo GitHub Actions al publicar un tag `v*`, y antes de publicarlo
lo **arranca en un Windows de verdad** para comprobar que responde y crea su base
de datos — que es justo lo que no se puede verificar desde un Mac.

```bash
npm run paquete   # deja la carpeta en empaquetar/salida/Tesorera/
cd empaquetar && makensis -DVERSION=1.0.0 instalador.nsi
```

Lo que viaja dentro: `node.exe` (Node 24 LTS, con la versión fijada a propósito),
el frontend compilado, el servidor empaquetado en un solo `.mjs` con esbuild, y
`better-sqlite3` con **solo** el binario de Windows —los otros siete prebuilds
son 15 MB de peso muerto—.

> `.gitattributes` fuerza CRLF en los `.bat` y `.vbs`. No lo quites: con finales
> de línea LF no corren en Windows.

## Actualizar la app en su laptop

Bajar el instalador nuevo y volver a instalar encima. **Los pagos no se tocan**:
el instalador sobrescribe archivo por archivo y en ningún momento borra la
carpeta de instalación, que es donde vive `data\`. Desinstalar tampoco los borra.

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
