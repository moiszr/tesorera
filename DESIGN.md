---
name: Tesorera
description: Una libreta de tesorería moderna — papel cálido, lomo de tela oxblood, cifras tabulares y rayas finas; densidad de herramienta, no de panel de control.
colors:
  papel: "#f3efe6"
  hoja: "#fffdf8"
  hoja-2: "#faf7f0"
  tinta: "#241f1b"
  tinta-2: "#575047"
  tinta-3: "#756b62"
  linea: "#e6dfd2"
  linea-fuerte: "#d3c8b6"
  papel-impreso: "#ffffff"
  linea-impresa: "#c9c2b6"
  lomo: "#47222a"
  lomo-alto: "#5c2f38"
  lomo-texto: "#f6e9e3"
  lomo-pestana: "#e8b4a0"
  accion: "#8a3340"
  accion-alto: "#71272f"
  rubrica: "#a8443c"
  pagado-fondo: "#e6efe4"
  pagado-tinta: "#2c5a31"
  pagado-marca: "#4d8a53"
  abonando-fondo: "#fbf0d8"
  abonando-tinta: "#77510e"
  abonando-marca: "#bf8920"
  sinpagos-fondo: "#eeeae2"
  sinpagos-tinta: "#5d574d"
  sinpagos-marca: "#a1988a"
  aviso-fondo: "#e6eeee"
  aviso-tinta: "#2c5253"
  iglesia-indigo: "#4a5578"
  iglesia-pizarra: "#41525c"
  iglesia-arcilla: "#8a5a3c"
  iglesia-ciruela: "#6d4560"
  iglesia-tabaco: "#6b4a2e"
  iglesia-humo: "#59555f"
typography:
  micro:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: "1.15rem"
    letterSpacing: "0.06em"
  menuda:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: "1.35rem"
    letterSpacing: "normal"
  base:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  guia:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "normal"
  titulo:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.4375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.011em"
  cifra:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.018em"
    fontFeature: "tnum 1, lnum 1"
  cifraGrande:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.024em"
    fontFeature: "tnum 1, lnum 1"
  cifraEnorme:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum 1, lnum 1"
rounded:
  foco: "4px"
  pieza: "8px"
  hoja: "10px"
  redondo: "999px"
spacing:
  fila: "10px"
  pieza: "12px"
  hoja: "20px"
  hoja-amplia: "24px"
  pagina: "28px"
  pagina-ancha: "36px"
components:
  hoja:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
    padding: "20px"
  boton-principal:
    backgroundColor: "{colors.accion}"
    textColor: "#ffffff"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
    height: "44px"
  boton-principal-hover:
    backgroundColor: "{colors.accion-alto}"
    textColor: "#ffffff"
  boton-principal-grande:
    backgroundColor: "{colors.accion}"
    textColor: "#ffffff"
    rounded: "{rounded.pieza}"
    padding: "0 24px"
    height: "52px"
    typography: "{typography.guia}"
  boton-contorno:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
    height: "44px"
  boton-suave:
    backgroundColor: "rgba(138, 51, 64, 0.07)"
    textColor: "{colors.accion}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
    height: "44px"
  boton-texto:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
    height: "44px"
  campo:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "8px 12px"
    height: "46px"
  campo-monto:
    backgroundColor: "{colors.hoja-2}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "12px 16px 12px 4.2rem"
    typography: "{typography.cifraGrande}"
  buscador-barra:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "0 16px 0 44px"
    height: "44px"
    typography: "{typography.guia}"
  chip-pagado:
    backgroundColor: "{colors.pagado-fondo}"
    textColor: "{colors.pagado-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 12px"
    typography: "{typography.menuda}"
  chip-abonando:
    backgroundColor: "{colors.abonando-fondo}"
    textColor: "{colors.abonando-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 12px"
    typography: "{typography.menuda}"
  chip-sinpagos:
    backgroundColor: "{colors.sinpagos-fondo}"
    textColor: "{colors.sinpagos-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 12px"
    typography: "{typography.menuda}"
  filtro-boton:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.pieza}"
    padding: "0 12px"
    height: "44px"
    width: "280px"
    typography: "{typography.menuda}"
  filtro-boton-activo:
    backgroundColor: "rgba(138, 51, 64, 0.08)"
    textColor: "{colors.accion}"
    rounded: "{rounded.pieza}"
    padding: "0 12px"
    height: "44px"
    typography: "{typography.menuda}"
  selector-campo:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "0 12px"
    height: "46px"
  menu:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
    padding: "4px 0"
    width: "280px"
  menu-opcion:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    padding: "0 12px"
    height: "44px"
    typography: "{typography.menuda}"
  menu-opcion-elegida:
    backgroundColor: "rgba(138, 51, 64, 0.08)"
    textColor: "{colors.accion}"
    padding: "0 12px"
    height: "44px"
    typography: "{typography.menuda}"
  lomo:
    backgroundColor: "{colors.lomo}"
    textColor: "{colors.lomo-texto}"
    width: "236px"
  lomo-entrada:
    backgroundColor: "transparent"
    textColor: "rgba(246, 233, 227, 0.82)"
    rounded: "{rounded.pieza}"
    padding: "0 12px"
    height: "46px"
  lomo-entrada-activa:
    backgroundColor: "{colors.lomo-alto}"
    textColor: "#ffffff"
    rounded: "{rounded.pieza}"
    padding: "0 12px"
    height: "46px"
  dialogo:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
    width: "460px"
  aviso:
    backgroundColor: "{colors.aviso-fondo}"
    textColor: "{colors.aviso-tinta}"
    rounded: "{rounded.pieza}"
    padding: "10px 12px"
    typography: "{typography.menuda}"
---

# Design System: Tesorera

## Overview

**Creative North Star: "La libreta de tesorería moderna"**

El objeto sigue siendo un libro de caja: lomo de tela oxblood a la izquierda con
las cuatro pestañas, hoja de papel cálido a la derecha donde se escribe. Pero el
libro dejó de imitarse a sí mismo. La raya roja de margen y la trama alterna de
renglones —los dos adornos que hacían "libro viejo"— se quitaron a propósito, y
lo que carga la identidad hoy es material, no ornamento: el papel cálido, la tela
oxblood, las cifras tabulares y el hairline. La frase que fija la dirección es del
usuario: **moderno, no "hecho para viejitos"**. Nadie vuelve a poner una raya roja
vertical junto a una tabla ni a rayar los renglones para que "parezca contabilidad".

Lo que sí quedó del libro es la estructura, y esa es la parte útil: una hoja por
bloque, renglones de una sola línea separados por una raya de 1px, columnas de
cifras alineadas consigo mismas. Donde un panel de control genérico pondría una
retícula de tarjetitas, aquí hay **una hoja con renglones**. Inicio es el caso
extremo y la prueba de la idea: no son cuatro tarjetas de resumen, es **una sola
hoja abierta** —cabecera con lo recaudado, renglón de totales y el doblez con dos
columnas regladas—, exactamente como se abre un libro de caja por la página del
mes.

La densidad es de herramienta de trabajo, no de landing: texto base de 18px sobre
raíz de 17px, renglones de 46–58px, barras de herramientas de 44px, todo dentro de
1366×768 sin scroll horizontal. La escala es **fija, no fluida**: hay un solo
dispositivo de destino y la estabilidad de las columnas vale más que la
adaptabilidad. Los dos escalones chicos son deliberadamente grandes (14px y 16px,
no 11px y 13px) porque quien lee esto lee con lentes; eso es accesibilidad, no
falta de refinamiento.

El contenido son los números. Toda la dramaturgia tipográfica está reservada al
dinero: los pasos de texto son vecinos cercanos (16 → 18 → 20 → 24px) mientras las
cifras saltan a 30, 42 y 59px. El color se administra con avaricia: un solo
acento (la familia oxblood) reservado para acciones, y tres colores de estado que
existen únicamente para decir cómo va un pago, siempre acompañados de su texto.

**Key Characteristics:**

- Lomo de tela a la izquierda (236px) + hoja de papel a la derecha; una sola hoja
  por bloque, nunca una hoja dentro de otra.
- La hoja se define por un hairline, no por una sombra, y **todo dato vive sobre
  una hoja**. Sobre el papel de la mesa solo van el `h1` de la pantalla con su
  bajada y el enlace de volver.
- Una hoja grande se subdivide por dentro con hairlines, con `{colors.hoja-2}` y
  con el doblez (`lg:divide-x`) — nunca partiéndola en varias superficies.
- Renglones de una sola línea separados por una raya fina. Sin trama alterna, sin
  raya de margen: el adorno de época se retiró y no vuelve.
- Una sola familia tipográfica (Fira Sans) con cifras tabulares obligatorias, y
  rótulos en minúscula (nunca versalitas espaciadas).
- Un solo acento (oxblood) para acciones; verde/ámbar/gris solo para estado de pago.
- Los controles densos —filtros y selectores— son botones compactos que abren
  menús en la capa superior del navegador, nunca rejillas de píldoras que crecen
  con los datos.
- Escala fija en rem sobre raíz de 17px; sin modo oscuro, sin tipografía fluida.
- Movimiento breve y de una sola curva; la barra de progreso al guardar es el
  único momento con autoría.

## Colors

Una paleta de papel envejecido e imprenta: tierras cálidas y desaturadas, con un
solo rojo vinoso que carga todas las acciones y tres colores de estado prestados
del semáforo pero rebajados a tinta de libro.

### Primary

- **Vino de acción** (`{colors.accion}`): el único acento de la app. Botón sólido
  principal, borde y texto de lo seleccionado (opción elegida de un menú, filtro
  puesto, forma de pago elegida), borde y anillo de foco de los campos, enlaces
  dentro del texto, `caret-color` y `accent-color` del documento. Su versión
  oscura (`{colors.accion-alto}`) es exclusivamente el hover del botón sólido.
  Aparece además al 6–16% de opacidad como fondo de opción resaltada, de filtro
  activo y de resultado resaltado en el buscador de cobro.
- **Tela del lomo** (`{colors.lomo}`): la encuadernación. Solo la barra lateral de
  navegación, la cubierta de la marca y el `theme-color` de la ventana.
  `{colors.lomo-alto}` es la pestaña activa; `{colors.lomo-texto}` la tinta sobre
  la tela; `{colors.lomo-pestana}` la marca de 3×24px que señala la pestaña
  marcada del libro.
- **Rúbrica** (`{colors.rubrica}`): la raya roja de margen del libro mayor.
  **No se dibuja sobre ninguna superficie de datos.** Sobrevive exactamente en dos
  sitios: el dibujo del estado vacío (al 30% de opacidad) y la franja de margen de
  la marca. La variable sigue declarada porque esos dos usos la necesitan; no es
  un color disponible para pantallas nuevas.

### Secondary

Los tres colores de estado de pago. Cada uno es una tríada fondo/tinta/marca y no
significa nada fuera del estado de un pago.

- **Pagado** (`{colors.pagado-fondo}` / `{colors.pagado-tinta}` /
  `{colors.pagado-marca}`): verde de tinta, no de éxito de app. La *marca* es el
  relleno de las barras de progreso; el par fondo/tinta viste el chip y la banda
  de "Pago guardado".
- **Abonando** (`{colors.abonando-fondo}` / `{colors.abonando-tinta}` /
  `{colors.abonando-marca}`): ámbar de papel. Es también el tono del `Aviso` que
  pide atención (`tono="ojo"`): persona archivada, nombre repetido, evento sin
  tipos de cupo.
- **Sin pagos** (`{colors.sinpagos-fondo}` / `{colors.sinpagos-tinta}` /
  `{colors.sinpagos-marca}`): gris cálido neutro. Viste también la etiqueta
  "Anulado" del historial.

Las tres tríadas pasan AA sobre su propio fondo y sobre las tres superficies de la
app.

### Tertiary

- **Aviso tranquilo** (`{colors.aviso-fondo}` / `{colors.aviso-tinta}`): verde
  azulado apagado. Es el tono del componente `Aviso` neutro, que solo se usa donde
  hay que interrumpir o explicar un número que no cuadra: los avisos de Ajustes al
  cambiar precios, y en la cuenta de la ficha el excedente pagado de más y el
  precio puesto a mano. Nunca es un error. Para notas que solo informan al pie de
  un total, el sistema **no** usa caja de color: usa el patrón `Nota` (ver
  Components).
- **Colores de iglesia** (`{colors.iglesia-indigo}`, `{colors.iglesia-pizarra}`,
  `{colors.iglesia-arcilla}`, `{colors.iglesia-ciruela}`,
  `{colors.iglesia-tabaco}`, `{colors.iglesia-humo}`): seis opciones cerradas,
  todas oscurecidas y desaturadas al mismo nivel para que ninguna grite más que
  otra. Viven en `src/components/Piezas.tsx`, no en `estilos.css`, porque son
  datos de una iglesia y no superficies del sistema. Solo aparecen como punto de
  8–10px junto al nombre de una iglesia; jamás como fondo de bloque.

### Neutral

- **Papel de la mesa** (`{colors.papel}`): el fondo del documento y el hueco entre
  hojas. **Ningún dato se escribe sobre él**: lo único que lleva encima es el `h1`
  de cada pantalla con su bajada y el enlace de volver de la ficha. Aun así tiene
  que sostener texto con contraste AA, porque esos rótulos son texto de verdad.
- **Hoja** (`{colors.hoja}`): la superficie escrita de las listas y los
  formularios. También el fondo de campos, diálogos y menús.
- **Hoja segunda** (`{colors.hoja-2}`): la superficie recesiva dentro de una hoja.
  No es alternancia de filas: viste el hover de renglón, **el renglón de resumen de
  Inicio** (entre dos hairlines), el pie del diálogo, el estado de cuenta del
  comprobante, la franja de archivados de Ajustes, el fondo del campo de monto y
  del buscador del cobro, y el número de paso.
- **Tinta** (`{colors.tinta}`): texto principal, 14.2–16.1:1 sobre los tres
  fondos. **Tinta segunda** (`{colors.tinta-2}`): rótulos, bajadas, texto de apoyo
  y el "RD$" que precede a una cifra, 6.9–7.8:1. **Tinta tercera**
  (`{colors.tinta-3}`): placeholders, iconos de apoyo, marcas de agua y texto de
  un pago anulado, 4.5–5.1:1. Los tres escalones están calibrados para no bajar de
  4.5:1 sobre `{colors.hoja}`, `{colors.hoja-2}` **ni** `{colors.papel}`.
- **Raya** (`{colors.linea}`): el hairline que delimita la hoja, separa los
  renglones, dibuja el borde de los menús y hace de canal vacío en las barras de
  progreso. Es también el borde de los controles de la **barra de herramientas**
  (buscador de Personas y botones de filtro). **Raya fuerte**
  (`{colors.linea-fuerte}`): el borde de todo control **dentro de un formulario**
  (campo, selector, botón de contorno, botones de forma de pago), el borde del
  toast y el pulgar de la barra de scroll.
- **Papel impreso** (`{colors.papel-impreso}`) y **raya impresa**
  (`{colors.linea-impresa}`): en papel el fondo es blanco de verdad, no nuestro
  tono cálido, y el borde del recibo tiene que verse en una impresora en gris.
  Solo existen dentro de `@media print`.

### Named Rules

**La regla del acento único.** Hay un solo color de acción en toda la app y es la
familia oxblood. Si una pantalla nueva necesita "otro color para destacar algo",
la respuesta es jerarquía tipográfica o un rótulo, no un color nuevo. Prueba
concreta: en cualquier captura debe haber **un solo botón sólido**.

**La regla de los hermanos, no morosos.** Los estados de pago son verde, ámbar y
gris, y nunca rojo. Nadie que deba dinero se pinta como falta: el gris de "Sin
pagos" es deliberadamente neutro y cálido. El único rojo de la app es el vino de
acción, y ese pertenece a los botones, no a las personas.

**La regla del color acompañado.** Ningún estado se comunica solo con color. Todo
chip lleva su texto ("Pagado", "Abonando", "Sin pagos"), toda barra lleva su
`aria-valuetext` en palabras, y todo punto de color va pegado a un nombre.

**La regla del color prestado.** Ningún color de identidad puede tomar un tono de
estado. Por eso la paleta de iglesias no tiene verde ni ámbar: esos dos ya
significan "Pagado" y "Abonando". Un punto verde de identidad al lado de un chip
de estado le enseña a leer el verde de dos maneras distintas, y entonces el verde
deja de querer decir nada. Si hace falta una séptima iglesia, se busca en azul,
tierra, ciruela o gris — nunca en el semáforo.

**La regla de las dos rayas.** El hairline claro (`{colors.linea}`) es estructura:
delimita superficies, separa renglones y viste la barra de herramientas, que es
cromo y debe quedarse callada. El hairline fuerte (`{colors.linea-fuerte}`) es
**contorno de algo que se rellena**: campos, selectores, botones de contorno. Un
control de formulario con el borde claro se lee como texto; un filtro con el borde
fuerte compite con la lista.

**La regla del acompañado en pantalla y en papel.** Todo color que carga
significado tiene que pasar AA sobre las tres superficies de la app
(`{colors.hoja}`, `{colors.hoja-2}`, `{colors.papel}`), no solo sobre la más
clara. Un gris que se lee sobre la hoja y se pierde sobre la mesa es un gris mal
elegido.

## Typography

**Familia única:** Fira Sans (con `system-ui`, `sans-serif` de respaldo), en pesos
400, 500 y 600. No hay segunda familia: los "números" no son un mono, son la misma
Fira con cifras tabulares activadas.

**Character:** Fira Sans es una grotesca humanista de origen editorial: tiene
cifras de altura pareja, buena diferenciación entre 1/l/I y una minúscula ancha
que aguanta 18px sin verse infantil. Elegida por legibilidad a la distancia de
lectura con lentes, no por personalidad; la personalidad la pone el papel.

**Raíz de 17px.** `html { font-size: 17px }`, así que todo rem del sistema se lee
1rem = 17px. La escala es **fija a propósito** (nada de `clamp`): hay un solo
destino, una laptop de 13–14" a ~1366×768, y las columnas de cifras deben medir
siempre lo mismo.

### Hierarchy

- **cifraEnorme** (600, 3.5rem ≈ 59px, interlineado 1): la cifra que manda la
  pantalla, **una sola por pantalla y siempre dentro de una hoja**: lo recaudado en
  la cabecera de Inicio y el saldo en la ficha de una persona ("Le falta" mientras
  deba, "Pagó en total" cuando ya cerró). Es el techo de la escala; no hay ningún
  escalón por encima.
- **cifraGrande** (600, 2.5rem ≈ 42px): el campo donde se escribe el monto del
  abono. Es el único *input* de este tamaño en la app.
- **cifra** (600, 1.75rem ≈ 30px): cifras de segundo nivel — "Falta por cobrar" y
  las cuatro cuentas del renglón de resumen de Inicio, "Le falta" del cobro,
  "Abonó" del recibo, las cifras del reporte.
- **titulo** (600, 1.4375rem ≈ 24px, tracking −0.011em): el `h1` de cada pantalla.
  Uno por pantalla; también es el rótulo "Tesorera" del lomo.
- **guia** (500, 1.1875rem ≈ 20px): nombre de la persona elegida, título de
  diálogo, campos de búsqueda, el monto de cada renglón de "Últimos pagos", botón
  grande.
- **base** (400, 1.0625rem ≈ 18px, interlineado 1.55): el texto de lectura y el
  cuerpo de las filas. Es el mínimo de lectura de la app.
- **menuda** (400, 0.9375rem ≈ 16px): rótulos, metadatos de fila, ayudas bajo los
  campos, texto de chips, de opciones de menú y de botones de filtro. Es el
  escalón de trabajo de todo lo denso.
- **micro** (600, 0.8125rem ≈ 14px, tracking 0.06em): el escalón más chico que
  existe y hoy queda **un solo uso en toda la app**: el número de paso del
  instructivo del cobro. No es la clase `.rotulo` y no debe volver a serlo.

### Named Rules

**La regla del rótulo en minúscula.** `.rotulo` es `menuda`, peso 500, tinta
segunda, **en caja normal**. Las versalitas espaciadas se veían a "libro viejo" y,
sobre todo, se leían peor: esto lo mira alguien con lentes, no un tipógrafo. Un
rótulo nombra el valor que tiene al lado ("Recaudado", "Le falta", "Su cupo") y
siempre está pegado a él; nunca es un antetítulo decorativo suelto.

**La regla del extremo chico.** Los dos escalones menores de la escala son
deliberadamente más grandes de lo que pide la convención tipográfica (14px y 16px,
no 11px y 13px). Antes de bajar un texto de tamaño, la pregunta no es si se ve
elegante sino si ella lo lee de un vistazo. Nada por debajo de `micro`, y `micro`
solo para datos accesorios que se repiten en otro lado.

**La regla de las cifras tabulares.** Todo número que la usuaria pueda comparar
con otro lleva la clase `.cifra` (`tabular-nums lining-nums`). Montos, conteos,
porcentajes, teléfonos, números de paso. Si una columna de números no cuadra al
scrollear, es que alguien olvidó `.cifra`.

**La regla del "RD$" pequeño.** El símbolo de moneda nunca compite con el número, y
se encoge conforme la cifra crece. El componente `Monto` es el dueño **único** de
esa proporción y la ajusta por escalón: `0.5em` en `cifra`, `0.46em` en
`cifraGrande`, `0.42em` en `cifraEnorme`, y tamaño pleno en los escalones de texto
— siempre en tinta segunda, peso 500, alineado a la línea base. Hoy no queda una
sola excepción: todo monto de la app, incluido el de la cabecera de Inicio, sale de
`Monto`, y `cifraEnorme` es el escalón más grande que `Monto` acepta. Si una cifra
nueva necesita otra proporción, se agrega un escalón a `Monto`, no se escribe el
símbolo a mano en la pantalla.

**La regla del drama reservado.** Los escalones de texto son vecinos (16 → 18 →
20 → 24px); los saltos grandes pertenecen solo al dinero (30 → 42 → 59px). Si un
título de sección quiere ser enorme, la respuesta es no: el número es el
contenido.

## Layout

**El libro abierto.** Toda la app vive en un `flex` de dos partes: el lomo, una
`nav` de 236px de ancho y alto de pantalla completa (`sticky`, `h-screen`), y el
cuerpo, que ocupa el resto con 28px de padding horizontal (36px a partir de `xl`)
y 24px vertical. El contenido del cuerpo se centra con un ancho máximo de 1120px.

**La hoja como unidad.** Todo dato vive sobre una `.hoja`: fondo `{colors.hoja}`,
radio de 10px, borde de 1px `{colors.linea}` y un filo de sombra casi
imperceptible. Las hojas se separan entre sí con 20px (`gap-5` / `space-y-5`). El
padding interior es de 20px (24px en la hoja de Inicio, 28px en comprobante y
reporte); las hojas con lista llevan `overflow-hidden` y trasladan el padding a
cada renglón para que las rayas lleguen de borde a borde.

**La hoja abierta de Inicio.** Inicio es **una sola hoja** con `overflow-hidden`
que contiene la pantalla entera, dividida por dentro en tres franjas:

1. **Cabecera** (`px-6 pb-5 pt-6`): "Recaudado" en `cifraEnorme` a la izquierda y
   "Falta por cobrar" en `cifra` alineado a la derecha, sobre la misma línea base
   (`items-end`, `justify-between`); debajo la barra de progreso a todo el ancho;
   bajo ella, en una sola línea de `menuda`, el porcentaje a la izquierda y la
   meta a la derecha; después la nota al pie del excedente cuando lo hay; y al
   final los dos botones ("Registrar pago" sólido + "Agregar persona" de contorno).
2. **Renglón de resumen**: franja de `{colors.hoja-2}` entre dos hairlines
   (`border-y`, `px-6 py-3`) con las cuatro cuentas —inscritos, pagaron completo,
   abonando, sin pagos— como **cifras grandes** (`cifra`, 30px, peso 600) con su
   rótulo en `menuda` al lado. Las tres últimas llevan la tinta de su estado. Es el
   renglón de totales de una libreta, no una fila de tarjetitas.
3. **El doblez**: `grid lg:grid-cols-2 lg:divide-x lg:divide-linea` — "Últimos
   pagos" a la izquierda y "Por iglesia" a la derecha, separadas por una raya
   vertical que es literalmente el pliegue del libro. Por debajo de `lg` se apilan
   y la raya vertical se convierte en el `border-t` de la segunda sección.

**El renglón, no la tarjeta.** Las listas son `<ul>` cuyos `<li>` llevan
`.renglon`: una raya inferior de `{colors.linea}` y nada más — sin raya en el
último, **sin trama alterna**. La altura mínima la fija lo que el renglón carga:
46px en la lista de personas (una línea), 52px en "Últimos pagos" y 58px en "Por
iglesia" (Inicio), 54px en el historial de pagos, 62px en el buscador del cobro y
en las iglesias de Ajustes, 66px en los tipos de cupo.

**La barra de herramientas de una línea.** En Personas, filtrar ocupa **una fila de
44px**: buscador flexible (mínimo 220px) + un `FiltroMenu` por criterio (Cómo va ·
Cupo · Pastor · Iglesia) + el control de Orden al final + "Limpiar" cuando hay algo
puesto. Sustituyó a un panel de cinco filas de píldoras con columna de etiquetas
que medía ~450px de alto y que empeoraba con cada iglesia nueva. La regla que
queda: **un control de filtro mide lo mismo con tres opciones que con cincuenta.**

**Las columnas de la lista de personas.** Un renglón es **una sola línea**: Nombre
(flexible, mínimo 150px, con `truncate`) · Iglesia (220px) · Ha pagado (112px,
derecha) · Su cupo (112px, derecha) · Cómo va (128px). Los dos montos van en
columnas separadas, cada una alineada consigo misma: pegados en un solo bloque, lo
pagado bailaba según lo largo que fuera el precio. Cuando alguien no está inscrito,
las dos columnas de dinero se funden en una que dice "Sin inscribir".

**Prioridad de columnas al angostar.** Las columnas se caen por prioridad, no
todas a la vez: Iglesia aparece desde `xl`, "Su cupo" desde `md`, y el encabezado
de columnas desde `sm`. Nombre, "Ha pagado" y "Cómo va" no se caen nunca — son la
respuesta a "¿cuánto pagó fulano?".

**Rejillas confirmadas.** Solo existen cinco formas:
1. Pantalla de una columna (Ajustes, Comprobante a 560px, Reporte).
2. Contenido + rail auxiliar de 340px **a la derecha**
   (`lg:grid-cols-[minmax(0,1fr)_340px]` en Registrar pago, **solo cuando hay algo
   que poner en el rail**: el recibo del último pago o el instructivo de tres pasos
   la primera vez).
3. Registrar pago sin rail: **centrado a 680px** (`mx-auto max-w-[680px]`), título
   incluido. Una columna sola pegada a la izquierda con medio ancho vacío al lado
   se lee como un error de maquetación.
4. Rail de 340px **a la izquierda** + contenido
   (`lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]` en la ficha de persona).
5. Inicio no usa rejilla de pantalla: es **una hoja** y la rejilla vive *dentro*
   de ella (`lg:grid-cols-2` con `lg:divide-x`).

Las formas 2 y 4 llevan siempre **`items-start`** y `gap-5`, para que cada columna
mida lo que necesite en vez de estirarse a la altura de la vecina.

**La ficha de persona: cuenta a la izquierda, historial a la derecha.** Es la
rejilla 4. A la izquierda, una hoja angosta de 340px (`.hoja h-fit p-5`) con la
cuenta: rótulo ("Le falta" mientras deba, "Pagó en total" cuando ya cerró) y
`ChipEstado` en la misma línea, el saldo en `cifraEnorme`, la barra de progreso de
10px, y un `dl` en `menuda` separado por un hairline con Precio del cupo, Ha pagado
y Abonos —dato a la izquierda, valor a la derecha—; debajo, los avisos que
correspondan y las dos acciones apiladas a todo el ancho ("Registrar abono" sólido
y "Cambiar tipo de cupo o precio" de texto). A la derecha, la hoja del historial.

**El renglón del historial es compacto.** Un pago es **una sola fila** de 54px
(`px-5 py-2`): columna de monto de 108px alineada a la derecha (tachado y en tinta
tercera si está anulado), y a su lado, en la columna flexible, la fecha larga
arriba —con la fecha relativa detrás en tinta tercera— y la forma de pago, la nota
o el motivo de la anulación debajo en `menuda`. Cierran la fila la píldora
"Anulado" (par `sinpagos`) cuando lo está, o los dos botones de icono de 44px
(comprobante y anular) cuando el pago está vivo. La versión anterior repartía lo
mismo en cuatro columnas fijas y una fila más alta; con un historial largo, apilar
menos aire por pago es lo que deja ver la cuenta completa de un vistazo.

**Comportamiento responsivo: estructural, no tipográfico.** Los únicos cambios por
ancho son colapsar rejillas a una columna y esconder columnas secundarias por
prioridad. El tamaño de letra nunca cambia.

**Impresión.** El comprobante y el reporte se imprimen desde la misma hoja: `@page`
de 14mm, raíz a 12pt, fondo `{colors.papel-impreso}`, `.no-imprimir` oculta el
lomo, la navegación y los botones, y la `.hoja` cambia su sombra por un borde de
1px `{colors.linea-impresa}`. No hay una vista de impresión aparte; la hoja *es*
el documento.

### Named Rules

**La regla de la hoja sola.** Nunca una `.hoja` dentro de otra `.hoja`. Si un
bloque necesita subdividirse, se subdivide con hairlines, con `{colors.hoja-2}` o
con espacio — nunca con una superficie nueva. La hoja de Inicio es el ejemplo
mayor: tres franjas muy distintas y **una sola superficie**.

**La regla de la hoja que sostiene.** La hoja no es un marco decorativo alrededor
de un número: es el suelo sobre el que el número se apoya. **Una cifra, por grande
que sea, va sobre una hoja.** Se intentó justo lo contrario —sacar lo recaudado de
Inicio a la mesa desnuda, sin superficie, con el argumento de que un solo número no
se gana una caja— y el usuario lo revirtió: sin la hoja debajo, la cifra quedaba
flotando y la pantalla se descosía, porque perdía lo único que ataba el titular,
el resumen y las dos listas a un mismo objeto. El contrato de dirección lo deja
escrito: quitar la superficie de la hoja **fue un paso de más y se revirtió**. No
se vuelve a intentar. Lo que sí se quitó para siempre es el ornamento de época
(raya de margen, trama alterna, folio), no el papel.

**La regla de la raya y el aire.** Una fila se separa de la siguiente con una raya
de 1px y con espacio, no con relleno de fondo. Raya + trama alterna + columnas a la
vez es una hoja de cálculo, no un libro. (La única alternancia que queda en la app
es la tabla del **reporte impreso**, donde la trama ayuda a seguir la fila con el
dedo en papel; no es licencia para traerla de vuelta a la pantalla.)

**La regla del control de tamaño fijo.** Ningún control puede crecer con los datos.
Filtros y selectores son botones de una línea que abren un menú; el menú es lo que
crece, y crece hacia la capa superior del navegador, no hacia abajo empujando la
pantalla. Prueba concreta: si al agregar la iglesia número veinte una pantalla
cambia de alto, ese control está mal hecho.

**La regla de las cuatro pestañas.** El lomo lleva exactamente cuatro entradas
(Inicio, Personas, Registrar pago, Ajustes). Una pantalla nueva se cuelga de una
de las cuatro; no se agrega una quinta.

## Elevation & Depth

El sistema es **plano y se define por trazo**. La profundidad la da el papel, no
la luz. La jerarquía es de tres niveles: la mesa (`{colors.papel}`, sin nada), la
hoja (borde de 1px más un filo de sombra que apenas la despega) y **la capa
superior del navegador** —diálogos y menús de popover—, que es lo único que de
verdad flota por encima del libro. Todo lo demás (renglones, chips, campos,
botones) es plano y se separa con hairlines o con relleno. Los botones no se
levantan al hover: cambian de color y se hunden un 2% al presionar
(`active:scale-[0.98]`).

### Shadow Vocabulary

- **hoja** (`border: 1px solid var(--linea)` + `box-shadow: 0 1px 2px rgba(58,42,28,0.04)`):
  el reposo de toda superficie de contenido. El borde es lo que la define; la
  sombra solo evita que se vea pegada como una calcomanía.
- **dialogo** (`0 12px 24px -8px rgba(40,28,18,0.18), 0 32px 64px -24px rgba(40,28,18,0.32)`):
  la sombra de la capa superior. La usan el `<dialog>` (con `::backdrop` de
  `rgba(40,28,18,0.42)`) **y los menús de popover** de `FiltroMenu` y `Selector`
  (con `::backdrop` transparente). Es la misma sombra a propósito: las dos cosas
  están al mismo nivel real sobre el libro; lo que las distingue es el velo, no la
  profundidad.
- **toast** (`0 2px 4px rgba(58,42,28,0.06), 0 14px 32px -14px rgba(58,42,28,0.28)`):
  el aviso de Sonner, que flota sobre todo, incluso sobre el diálogo.
- **botón sólido** (`0 1px 2px rgba(58,42,28,0.12)`): un filo de 1px bajo el botón
  principal, para que se lea como una pieza y no como una mancha.

### Named Rules

**La regla del trazo antes que la luz.** Una superficie se delimita con una raya;
la sombra solo se usa cuando algo está de verdad por encima del libro (diálogo,
menú, toast). Si un bloque nuevo pide sombra para verse separado, lo que le falta
es una raya o aire.

**La regla del velo, no de la sombra.** Lo que separa un menú de un diálogo no es
cuánto flota sino si oscurece el libro: el diálogo interrumpe y lleva velo; el
menú es un control y su `::backdrop` es transparente. Un menú con velo convierte
elegir una iglesia en un acto solemne.

**La regla de la sombra de tinta.** Las sombras nunca son negras: su color es
`rgba(58,42,28,…)` (o `rgba(40,28,18,…)` en la capa superior), la sombra que
proyecta papel sobre papel. Siempre llevan desplazamiento vertical real y difusión
suave; nunca un halo plano centrado ni un desplazamiento duro.

## Shapes

Tres radios y nada más: **10px** para la hoja, el diálogo y el menú de popover (el
corte de una hoja de libreta), **8px** para las piezas que se tocan —botones,
campos, selectores, botones de filtro, botones de icono— y **999px** para lo que es
un contador o una marca: chips de estado, barras de progreso, puntos de color, el
número de paso. El foco del teclado redondea a 4px.

Los bordes son de 1px y solo existen en dos pesos, con el reparto que fija *La
regla de las dos rayas*: `{colors.linea}` para estructura y cromo,
`{colors.linea-fuerte}` para el contorno de un control de formulario. Un borde de
`{colors.accion}` significa siempre "esto está enfocado, abierto o seleccionado",
nunca decoración.

Las barras de progreso son la silueta recurrente del sistema: cápsula de 8px de
alto por defecto (`BarraProgreso`), 10px en la ficha de persona y en el recibo del
cobro, y 12px en la barra a todo el ancho de la cabecera de Inicio, que es la más
gruesa porque es la única que cruza la hoja entera. Canal `{colors.linea}`, relleno con la
*marca* del estado, y crecimiento por `transform: scaleX()` desde el origen
izquierdo. Las listas no llevan barras: dos columnas de cifras dicen lo mismo y no
dejan nada colgando debajo del renglón.

Los iconos son un juego dibujado a mano de 21 piezas en `src/components/Iconos.tsx`:
caja de 24, trazo 1.6, remates y uniones redondeados, `fill: none`,
`stroke: currentColor`, tamaño de uso 14–20px. No hay emojis ni librería de
iconos.

## Components

### Buttons

Carácter: piezas de papel grueso. Cambian de color, no de altura.

- **Forma:** radio de 8px (`{rounded.pieza}`), altura mínima 44px, 52px en la
  variante `grande` (que además sube a `guia`). Peso 500, icono opcional a la
  izquierda con 8px de separación.
- **principal:** fondo `{colors.accion}`, texto blanco, filo de 1px. Es el único
  botón sólido y hay **uno por pantalla**: "Registrar pago", "Guardar pago",
  "Agregar persona", el confirmar de un diálogo.
- **contorno:** fondo `{colors.hoja}` con borde `{colors.linea-fuerte}`; al hover
  el borde sube a `{colors.tinta-3}` y el fondo a `{colors.hoja-2}`. La acción
  secundaria de igual peso ("Agregar persona" junto a "Registrar pago" en Inicio,
  "Cambiar cupo o precio", los montos rápidos del cobro).
- **suave:** fondo `rgba(138,51,64,0.07)` (0.12 al hover), texto de acción, sin
  borde. Para un atajo sugerido ("Saldar: RD$ 1,200").
- **texto:** sin fondo ni borde, texto `{colors.tinta-2}`, hover con un lavado
  neutro `rgba(36,31,27,0.05)`. Para salidas, cancelaciones y las acciones de
  cabecera de la ficha ("Editar", "Archivar", "Cambiar", "Limpiar").
- **Estados:** hover cambia fondo o borde en 150ms con la curva `salida`; `active`
  escala a 0.98; deshabilitado baja a 45% de opacidad y desactiva el puntero; en
  carga, el icono se sustituye por un anillo giratorio de 17px y el botón se
  deshabilita solo.

### Chips

Solo queda **una** familia de chip, y eso es una decisión, no una omisión: los
chips de filtro y los "filtros puestos" se eliminaron con el panel de filtros.

- **ChipEstado** (informativo, el único chip del sistema): cápsula con el par
  fondo/tinta del estado, punto de 7px con la *marca*, `text-menuda` peso 500,
  `px-3 py-1`, `gap-2`. **Siempre** lleva el texto del estado. No es pulsable, no
  cambia de tamaño, y su orden de aparición es siempre Pagado → Abonando → Sin
  pagos.
- La etiqueta "Anulado" del historial es la única cápsula que no es un ChipEstado:
  usa el par `sinpagos` a `text-menuda` peso 500 y vive en la columna de forma de
  pago, porque describe el pago, no el estado de la persona.

### Cards / Containers

No hay tarjetas: hay **hojas**. Radio de 10px, fondo `{colors.hoja}`, borde de 1px
`{colors.linea}` y un filo de sombra. El padding interior es de 20px (24px en la
hoja de Inicio, 28px en los documentos imprimibles); las hojas con lista usan
`overflow-hidden` y llevan el padding a cada renglón. La cabecera de una hoja con
lista es una franja de 44–50px con título en peso 600 y, a la derecha, un enlace en
`menuda` con el icono de avance; debajo puede ir una fila de rótulos de columna
separada por hairline.

### Inputs / Fields

Carácter: la línea donde se escribe, no una caja hundida.

- **Estilo:** altura mínima 46px, radio 8px, fondo `{colors.hoja}` (o
  `{colors.hoja-2}` cuando es un buscador dentro de una hoja o el campo de monto),
  borde de 1px `{colors.linea-fuerte}`, placeholder en `{colors.tinta-3}`.
  Etiqueta encima en `menuda`, peso 500, `{colors.tinta-2}`.
- **Hover:** el borde sube a `{colors.tinta-3}`.
- **Foco:** borde `{colors.accion}` más un anillo de 2px `rgba(138,51,64,0.18)`.
  El `:focus-visible` global es un contorno de 2px del color de acción con 2px de
  separación y radio 4px, y nunca se anula.
- **Error:** borde `{colors.accion}`, `aria-invalid`, y bajo el campo un mensaje en
  `menuda` del color de acción precedido del icono de aviso. El mensaje dice qué
  hacer ("Escribe cuánto está abonando, por ejemplo 1,000"), nunca qué falló.
- **Ayuda:** en `menuda` `{colors.tinta-2}` bajo el campo; se sustituye por el
  error cuando lo hay.
- **Campo de monto:** el único input en `cifraGrande`, sobre `{colors.hoja-2}`,
  con el "RD$" fijo a la izquierda en `guia` peso 500 y el texto sangrado 4.2rem.
- **Buscador de la barra de herramientas:** 44px de alto, `guia`, icono de 20px a
  la izquierda con sangría de 44px, borde `{colors.linea}` (no el fuerte: es cromo)
  y el mismo foco de acción. Es lo único que está siempre a la vista en Personas,
  porque buscar es lo que ella hace veinte veces al día.
- **Campo de fecha:** nunca muestra el formato del navegador. En reposo es un botón
  de 46px que dice la fecha escrita en español ("Hoy, 16 de agosto de 2026") con un
  "Cambiar" a la derecha; el `input[type=date]` real solo aparece al tocarlo.
- **Sin flechitas:** los spinners nativos de `input[type=number]` están anulados;
  los montos se escriben.

### Navigation

El lomo del libro: `{colors.lomo}` sólido, 236px, alto completo, `sticky` y
`.no-imprimir`. Arriba, "Tesorera" en `titulo` blanco y debajo, en `menuda` al 72%
de opacidad, el nombre del evento y la cuenta regresiva. Un hairline al 16% separa
la cabecera de las pestañas.

Cada entrada es una fila de 46px con radio de 8px, icono de 20px y texto de 1rem.
En reposo el texto va al 82% del `{colors.lomo-texto}`; en hover, fondo blanco al
7% y texto blanco; activa, fondo `{colors.lomo-alto}`, texto blanco en peso 600 y
una marca de 3×24px en `{colors.lomo-pestana}` pegada al borde izquierdo, que
aparece por opacidad en 150ms. Al pie, en `menuda` al 66%, la nota permanente "Se
respalda sola al abrir".

### Dialogs

`<dialog>` nativo: se encarga solo del foco, del `Escape` y de la capa superior.
Ancho por defecto 460px (480–520px en formularios), alto máximo 86vh, radio 10px,
fondo `{colors.hoja}`, sombra `dialogo`, backdrop `rgba(40,28,18,0.42)`. Cabecera
con título en `guia` peso 600 y un botón de cerrar de 44px; **el cuerpo hace scroll
y el pie se queda quieto**, para que el botón de guardar no se vaya de la pantalla
cuando el formulario crece. Pie opcional con fondo `{colors.hoja-2}` y hairline
superior.

`Confirmacion` es la única forma de pedir permiso: el botón de salida dice "No,
dejarlo así" y el de confirmar dice exactamente lo que va a pasar ("Sí, anular
este pago"), nunca "Aceptar".

**`DialogoPersona`** es el formulario compartido de agregar persona, y vive fuera
de las pantallas porque se abre desde dos sitios: la lista de Personas y el
buscador del cobro cuando llega alguien que todavía no está inscrito. Arrastra el
nombre ya escrito en el buscador, avisa de un posible repetido *mientras* se
escribe (no después de guardar, cuando el duplicado ya existe), y esconde teléfono
y notas en un `<details>` de 44px. Es la prueba de que un formulario compartido no
necesita dos maquetaciones.

### FiltroMenu (componente insignia)

El control de filtro de la barra de herramientas. Un botón compacto de 44px (radio
8px, `menuda`, máximo 280px, `truncate`) que abre un menú con la API nativa
`popover`: capa superior, `Escape` y cierre al tocar afuera sin escribir una línea
de JavaScript para ello. El panel se posiciona a mano bajo el botón y se pega al
borde derecho de la ventana si no cabe.

Las decisiones que hay que respetar al tocarlo:

- **El filtro activo se dice dentro del botón**, en la forma "Iglesia: Getsemaní",
  con la etiqueta a opacidad reducida y el valor en peso 500. Un filtro que no se
  ve puesto es una lista que "perdió" gente.
- **La × vive dentro del botón**, como control redondo de 28px con
  `aria-label="Quitar el filtro …"`. Quitar un filtro es un gesto distinto de
  abrirlo, y por eso es un blanco distinto. Cuando no hay filtro puesto, ese sitio
  lo ocupa la flecha de desplegar.
- **Los conteos viven dentro del menú**, a la derecha de cada opción, en `menuda`
  tinta tercera y tabulares. En el botón serían ruido; en el menú son lo que ayuda
  a elegir.
- **El buscador aparece solo por encima de 8 opciones** (`umbralBusqueda`), como
  franja de 44px sobre la lista, y enfoca solo al abrir. `Enter` elige el primer
  resultado.
- **`permiteTodas={false}` para el orden.** El orden siempre tiene un valor, así
  que no lleva "Todas", no se puede quitar y **no se pinta como filtro activo**:
  un control permanentemente encendido enseña a ignorar el color de activo.

### Selector (componente insignia)

Elegir una opción dentro de un formulario. Es **siempre** un campo de una línea de
46px que abre el mismo menú de popover; se reescribió por completo desde la versión
adaptativa (rejilla de botones por debajo de un umbral, campo por encima). El
motivo está en su docblock y es medible: tres iglesias más cuatro tipos de cupo se
comían 500px de diálogo, y empeoraba con cada iglesia nueva. Hoy el formulario mide
lo mismo con tres opciones que con cincuenta y se lee de arriba abajo como
cualquier formulario. Abre hacia arriba si abajo no cabe, y lleva la etiqueta,
ayuda y error del sistema de campos.

**La regla del detalle que confirma y el detalle que elige.** Un dato secundario
de una opción se coloca según para qué sirve, no según el sitio que sobre:

- Un **detalle numérico** (el precio del cupo) se repite en **los dos** sitios: en
  el campo cerrado y a la derecha en el menú. En el campo confirma lo que se va a
  pagar; en el menú se compara en columna, alineado y tabular.
- Un **detalle de texto** (el pastor de la iglesia) vive **solo en el menú**, en una
  segunda línea bajo el nombre. Ayuda a *elegir* entre dos iglesias parecidas —que
  es justo cuando uno se equivoca—, pero no hace falta para confirmar, y en la
  misma línea truncaba el nombre de la iglesia, que es lo que ella lee.

La opción elegida se marca por partida triple: fondo de acción al 8%, peso 500 y el
icono de cheque — color, peso y forma, nunca color solo.

### La barra de progreso (componente insignia)

Es el instrumento de la app y su único momento con autoría. Canal en
`{colors.linea}`, relleno con la *marca* del estado, animado con
`transform: scaleX(proporción)` desde `origin-left` en **420ms** con la curva
`salida`. Nunca se anima `width`.

Al guardar un pago, el recibo monta la barra con el valor **anterior** y en el
siguiente frame la sube al nuevo: la usuaria ve entrar su abono. Es la única
animación de la app que dura más de 250ms, y es deliberada.

El color del relleno **siempre sale de `calcularEstado(pagado, precio)`**, incluso
en las barras agregadas. La barra de Inicio no es verde por ser un total: es verde
solo cuando de verdad está cobrado completo, ámbar mientras se abona y gris cuando
no hay nada. Esa barra es la única que no pasa por el componente: está escrita a
mano en `Inicio.tsx` para poder medir 12px y ocupar el ancho de la hoja, pero
respeta el mismo canal, el mismo `scaleX` de 420ms y el mismo origen del color.

### Nota y Aviso

Dos niveles distintos, y la diferencia importa porque la app avisa mucho:

- **`Nota`** (el patrón por defecto): **es un patrón, no un componente** — se
  escribe en la propia pantalla, sin caja y sin color de fondo: `IconoAviso` de
  15px en tinta tercera + texto en `menuda` tinta segunda, en un `<p>` con
  `flex items-start gap-1.5`. Para lo que informa y no alarma. Su instancia viva es
  la nota al pie de Inicio ("Incluye RD$ … de pagos de más, por eso lo recaudado y
  lo que falta no suman justo la meta"), escrita directamente en `Inicio.tsx`. Ahí
  una caja de color competiría con la cifra que tiene que mandar en la pantalla.
- **`Aviso`** (`src/components/Piezas.tsx`): caja de color, radio 8px, `menuda`,
  icono de 16px. Tono `neutro` en verde azulado apagado y tono `ojo` en ámbar. Se
  reserva para lo que sí interrumpe o corrige la lectura de la cuenta: persona
  archivada (`ojo`), posible nombre repetido mientras se escribe, evento sin tipos
  de cupo, los avisos de Ajustes al cambiar precios en masa, y en la ficha de
  persona el excedente pagado de más y el precio puesto a mano (`neutro`).

Si dudas cuál usar: si la usuaria puede seguir trabajando sin leerlo, es `Nota`.
El mismo hecho puede pedir los dos niveles según dónde aparezca — el excedente es
`Nota` al pie del total de Inicio y `Aviso` dentro de la cuenta de una persona,
porque ahí sí explica un número que no cuadra.

### Estado vacío

Nunca dice "no hay nada": dice qué hacer. Un dibujo de 72×52 de hoja reglada en
blanco (con su raya de margen en rúbrica al 30% — el único resto de ornamento que
queda, y a escala de dibujo, no de interfaz), título en `guia` peso 600, una
explicación de máximo 38 caracteres de ancho en `{colors.tinta-2}`, y un botón que
ejecuta el siguiente paso. Los vacíos con filtros puestos ofrecen dos salidas
concretas: "Agregar a '…'" con el nombre que se buscó, y "Quitar filtros".

### La marca

`marca/tesorera.svg` es el mismo objeto que la app: el libro de caja
encuadernado. Cubierta de tela `{colors.lomo}` con esquinas de 112/512 de radio,
lomo cosido a la izquierda con dos nervios, hoja de `{colors.hoja}` y la raya de
margen en `{colors.rubrica}` a 12/512 de ancho —gruesa a propósito, porque a 32px
una raya de 1px desaparece— con tres renglones escritos, el último más corto: una
cuenta a medias.

De ahí salen los PNG (16, 32, 48, 64, 128, 180, 192, 256, 512) y
`marca/tesorera.ico` mediante `marca/hacer-ico.mjs`. Lo que sirve la app vive en
`public/marca/`, declarado en `index.html` y en `public/tesorera.webmanifest`
(`display: standalone`, `background_color` el papel, `theme_color` el lomo). Los
iconos existen para que Windows use el libro en la ventana y en la barra de
tareas, no el icono de Chrome.

### Motion

- **Duración ordinaria:** 140ms para el menú de popover; 150ms para cambios de
  color y estado; 180ms para el diálogo; 260ms para la entrada de un renglón;
  300ms para la entrada de una hoja; **420ms solo para la barra de progreso**.
- **Curvas:** tres, y solo tres, declaradas como variables — `--salida`
  (`cubic-bezier(0.23,1,0.32,1)`, la de casi todo), `--entrasale`
  (`cubic-bezier(0.77,0,0.175,1)`) y `--gaveta` (`cubic-bezier(0.32,0.72,0,1)`).
  Nada de `ease`, `linear` ni curvas de fábrica en animaciones nuevas.
- **Entradas:** las listas usan `.entra-renglon` (opacidad + 5px de subida, con
  retardo escalonado de 26ms por índice vía `--i`, tope de 10–12 elementos); las
  pantallas usan `.entra-hoja` (opacidad + 7px). Nada nace desde cero: siempre
  desde un estado casi visible.
- **Diálogo:** escala de 0.97 a 1 con 6px de subida, con `@starting-style` y
  `allow-discrete` sobre `overlay`/`display`; el backdrop hace fundido aparte.
- **Menú (`.menu-filtro`):** opacidad + 4px de bajada en 140ms, con
  `@starting-style` y `allow-discrete`. Más corto que el diálogo a propósito: un
  menú es un control, no una interrupción.
- **Movimiento reducido:** con `prefers-reduced-motion`, las entradas conservan la
  opacidad y pierden el desplazamiento, y todo lo demás cae a 0.01ms.
- **Prohibido:** rebote, elástico, parallax, y animar `width`, `height` o
  `top/left`.

### Toasts

Sonner abajo a la derecha con 20px de separación, vestido con los tokens del
sistema: fondo `{colors.hoja}`, borde `{colors.linea-fuerte}`, radio 10px, sombra
de toast, Fira Sans a 0.9375rem. El título lleva el monto y el nombre; la
descripción dice qué queda ("Le faltan RD$ 800", "Quedó pagado completo"). El toast
del pago guardado dura 8s y trae "Deshacer": la corrección más rápida posible antes
de tener que ir a la ficha a anular.

## Do's and Don'ts

### Do:

- **Do** construir toda lista como renglones (`.renglon`) dentro de una sola
  `.hoja`, separados por el hairline de `{colors.linea}` y por aire.
- **Do** definir cualquier superficie nueva con una raya de 1px, no con una sombra.
- **Do** poner toda cifra sobre una hoja, incluida la que manda la pantalla; sobre
  el papel de la mesa solo van el `h1` con su bajada y el enlace de volver.
- **Do** subdividir una hoja grande por dentro —hairlines, `{colors.hoja-2}`,
  `lg:divide-x`— antes que partirla en varias superficies.
- **Do** usar el componente `Monto` para cualquier cantidad de dinero, y `.cifra`
  para cualquier número comparable.
- **Do** derivar el color de toda barra de progreso —incluidas las agregadas— de
  `calcularEstado(pagado, precio)`.
- **Do** dejar exactamente un botón sólido `principal` por pantalla, y que su texto
  diga la acción concreta ("Guardar pago", no "Aceptar").
- **Do** acompañar todo color de estado con su texto y su `aria-valuetext`.
- **Do** resolver cualquier lista larga de opciones con `Selector` o `FiltroMenu`,
  para que el control mida lo mismo con tres opciones que con cincuenta.
- **Do** colocar un detalle numérico en el campo *y* en el menú (confirma y se
  compara), y un detalle de texto solo en el menú, en segunda línea (ayuda a
  elegir).
- **Do** dejar que `<dialog>` y `popover` hagan el foco, el `Escape` y el cierre al
  tocar afuera; el sistema no reimplementa modales.
- **Do** caer columnas por prioridad al angostar (Iglesia desde `xl`, "Su cupo"
  desde `md`), nunca todas a la vez.
- **Do** mantener 44px de alto mínimo en todo lo que se toca —hoy sin una sola
  violación— y el `:focus-visible` de 2px del color de acción visible siempre.
- **Do** verificar cualquier color de texto nuevo contra AA sobre `{colors.hoja}`,
  `{colors.hoja-2}` **y** `{colors.papel}`, no solo sobre el fondo más claro.
- **Do** escribir cada estado vacío como una instrucción con su botón.
- **Do** guardar en `src/lib/preferencias.ts` (localStorage) lo que solo es
  comodidad —la última iglesia y el último tipo de cupo elegidos, que ahorran dos
  toques por persona al inscribir a media iglesia de un tirón— y solo eso: si se
  pierde, no pasa nada.
- **Do** dibujar cualquier icono nuevo en la caja de 24 con trazo 1.6 y remates
  redondos, dentro de `src/components/Iconos.tsx`.
- **Do** marcar con `.no-imprimir` todo lo que no debe salir en papel, y usar
  `{colors.papel-impreso}` / `{colors.linea-impresa}` para lo que sí sale.
- **Do** animar posición y tamaño con `transform` y `opacity`, con una de las tres
  curvas del sistema.

### Don't:

- **Don't** poner una clase de `display` de Tailwind (`flex`, `grid`, `block`) en
  un `<dialog>`. Esa regla de autor le gana al `dialog:not([open]) { display: none }`
  del navegador y **todo diálogo cerrado se queda ocupando su altura en la
  página**, invisible pero clicable (llegó a inflar la página a 3998px para 3239px
  de contenido). El `display: flex` se declara **solo** en `dialog.dialogo[open]`
  dentro de `src/estilos.css`; en el JSX van `flex-col` y las demás utilidades,
  nunca `flex`.
- **Don't** anidar una `.hoja` dentro de otra, ni convertir un renglón en tarjeta
  con sombra o borde propio.
- **Don't** devolver el ornamento de libro viejo: ni trama alterna en los renglones
  de pantalla, ni la raya roja de margen junto a una lista, ni versalitas
  espaciadas. Se quitaron a propósito y el encargo del usuario es explícito:
  moderno, no "hecho para viejitos".
- **Don't** sacar una cifra de su hoja para "darle aire". Ya se probó en Inicio y
  se revirtió por pedido del usuario: el número quedaba flotando sobre la mesa y la
  pantalla se descosía. La hoja no le quita importancia a la cifra; es lo que la
  sostiene y lo que une el titular con el resumen y las listas.
- **Don't** convertir el resumen de Inicio en una retícula de tarjetitas de
  panel de control: las cuatro cuentas son un renglón de totales dentro de la misma
  hoja, sobre `{colors.hoja-2}` y entre dos hairlines.
- **Don't** volver a una rejilla de píldoras o de botones para elegir entre datos
  que crecen (iglesias, tipos de cupo, pastores): no escala y se come la pantalla.
- **Don't** poner el conteo de resultados en la cara de un botón de filtro, ni
  pintar como filtro activo un control que siempre tiene valor (el orden).
- **Don't** ponerle velo (`::backdrop` opaco) a un menú: el velo es del diálogo.
- **Don't** usar rojo para un estado de pago ni para una persona que debe. El único
  rojo de la app es el vino de acción, y pertenece a los botones.
- **Don't** dar a una iglesia (ni a ninguna identidad) un color verde o ámbar: esos
  dos tonos ya están comprometidos con "Pagado" y "Abonando".
- **Don't** introducir un segundo color de acento, un degradado, ni un color fuera
  de las variables de `src/estilos.css` (con la única excepción declarada de la
  paleta de iglesias en `Piezas.tsx`).
- **Don't** bajar un texto por debajo de `micro`, ni usar `micro` para algo que no
  se pueda leer en otro lado de la misma pantalla.
- **Don't** cambiar el tamaño de letra por ancho de pantalla ni introducir `clamp`:
  la escala es fija por decisión, para un solo dispositivo.
- **Don't** usar emojis, glifos de texto (`›`, `×`, `✓`) ni una librería de iconos
  como reemplazo del juego dibujado a mano.
- **Don't** escribir una cifra sin cifras tabulares, ni un monto sin el "RD$"
  del componente `Monto`, ni redefinir a mano la proporción del símbolo.
- **Don't** guardar en localStorage nada que sea un dato del negocio: los pagos,
  las personas y las inscripciones viven en SQLite y solo ahí.
- **Don't** animar `width` en una barra de progreso, ni pasar de 250ms en nada que
  no sea esa barra al guardar un pago.
- **Don't** usar rebote, elástico o parallax, ni ignorar `prefers-reduced-motion`.
- **Don't** poner una palabra en inglés ni jerga técnica en ninguna superficie
  visible, incluidos los mensajes de error.
- **Don't** agregar una quinta entrada al lomo: una pantalla nueva se cuelga de una
  de las cuatro.
- **Don't** confirmar una acción seria con "Aceptar"/"Cancelar": el botón dice lo
  que va a pasar y la salida dice "No, dejarlo así".
