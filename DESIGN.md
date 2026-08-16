---
name: Tesorera
description: El libro de caja abierto — lomo de tela, hoja de papel definida por una raya fina, y columnas de cifras para llevar los abonos de la convención.
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
  chip-filtro:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.redondo}"
    padding: "0 14px"
    height: "44px"
    typography: "{typography.menuda}"
  chip-filtro-activo:
    backgroundColor: "rgba(138, 51, 64, 0.09)"
    textColor: "{colors.accion}"
    rounded: "{rounded.redondo}"
    padding: "0 14px"
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

**Creative North Star: "El libro de caja"**

La app no es un panel de control: es el libro de contabilidad encuadernado que la
tesorera ya sabe leer, abierto sobre la mesa. A la izquierda, el lomo de tela
oxblood con las cuatro pestañas del libro; a la derecha, la hoja de papel cálido
donde se escribe. Esa metáfora define la estructura de cada pantalla: donde un
dashboard genérico pondría una retícula de tarjetas, aquí hay una sola hoja con
renglones separados por rayas finas y columnas de cifras alineadas.

La hoja se define por **una raya fina, no por una sombra**. Es la corrección
mayor de esta revisión: la sombra marcada hacía flotar todo y la pantalla se
sentía recargada de superficies. Hoy la `.hoja` lleva `border: 1px solid` de la
raya y apenas un filo de sombra; los renglones perdieron la trama alterna (raya +
trama + columnas a la vez es una hoja de cálculo de los noventa); y la raya roja
de margen dejó de dibujarse en pantalla. El libro se lee ahora por rayas y aire.

La densidad es de herramienta de trabajo: texto base de 18px sobre una raíz de
17px, renglones de 46–66px según lo que carguen, botones de 44px, y todo lo
importante cabe en 1366×768 sin scroll horizontal. La escala es **fija, no
fluida**: hay un solo dispositivo de destino y la estabilidad de las columnas
vale más que la adaptabilidad. Los dos escalones chicos de la escala crecieron a
propósito (14px y 16px, no 11px y 13px) porque quien lee esto lee con lentes: un
rótulo bonito que ella no distingue es un rótulo inservible.

El contenido son los números. Toda la dramaturgia tipográfica está reservada al
dinero: los pasos de texto son vecinos cercanos (16 → 18 → 20 → 24px) mientras
las cifras saltan a 30, 42 y 59px. El color se administra con avaricia: un solo
acento (la familia oxblood) reservado para acciones, y tres colores de estado que
existen únicamente para decir cómo va un pago, siempre acompañados de su texto.

**Key Characteristics:**

- Lomo de tela a la izquierda (236px) + hoja de papel a la derecha; una sola hoja
  por bloque, nunca una hoja dentro de otra.
- La hoja es un rectángulo delimitado por hairline, no una tarjeta que flota.
- Renglones separados por una raya fina y por aire; sin trama alterna.
- Una sola familia tipográfica (Fira Sans) con cifras tabulares obligatorias, y
  rótulos en minúscula (nunca versalitas espaciadas).
- Un solo acento (oxblood) para acciones; verde/ámbar/gris solo para estado de pago.
- Escala fija en rem sobre raíz de 17px; sin modo oscuro, sin tipografía fluida.
- Movimiento breve y de una sola curva; la barra de progreso al guardar es el
  único momento con autoría.

## Colors

Una paleta de papel envejecido e imprenta: tierras cálidas y desaturadas, con un
solo rojo vinoso que carga todas las acciones y tres colores de estado prestados
del semáforo pero rebajados a tinta de libro.

### Primary

- **Vino de acción** (`{colors.accion}`): el único acento de la app. Botón sólido
  principal, borde y texto de lo seleccionado, borde y anillo de foco de los
  campos, enlaces dentro del texto, `caret-color` y `accent-color` del documento.
  Su versión oscura (`{colors.accion-alto}`) es exclusivamente el hover del botón
  sólido. Aparece además al 5–16% de opacidad como fondo de opción resaltada, de
  píldora seleccionada y de hover de renglón en Inicio.
- **Tela del lomo** (`{colors.lomo}`): la encuadernación. Solo la barra lateral de
  navegación, la cubierta de la marca y el `theme-color` de la ventana.
  `{colors.lomo-alto}` es la pestaña activa; `{colors.lomo-texto}` la tinta sobre
  la tela; `{colors.lomo-pestana}` la marca de 3×24px que señala la pestaña
  marcada del libro.
- **Rúbrica** (`{colors.rubrica}`): la raya roja de margen del libro mayor.
  **Ya no se dibuja sobre ninguna lista.** El artefacto `.margen-rubrica` fue
  eliminado: una raya roja vertical corriendo por cada tabla competía con las
  columnas de cifras y era decoración de época, no estructura. Sobrevive en dos
  lugares y solo en dos: el dibujo del estado vacío (al 30% de opacidad) y la
  franja de margen de la marca. La variable sigue declarada porque esos dos usos
  la necesitan; no es un color disponible para superficies nuevas.

### Secondary

Los tres colores de estado de pago. Cada uno es una tríada fondo/tinta/marca y no
significa nada fuera del estado de un pago.

- **Pagado** (`{colors.pagado-fondo}` / `{colors.pagado-tinta}` /
  `{colors.pagado-marca}`): verde de tinta, no de éxito de app. La *marca* es el
  relleno de las barras de progreso; el par fondo/tinta viste el chip y la banda
  de "Pago guardado".
- **Abonando** (`{colors.abonando-fondo}` / `{colors.abonando-tinta}` /
  `{colors.abonando-marca}`): ámbar de papel. Es también el tono del aviso que
  pide atención (`Aviso tono="ojo"`).
- **Sin pagos** (`{colors.sinpagos-fondo}` / `{colors.sinpagos-tinta}` /
  `{colors.sinpagos-marca}`): gris cálido neutro. Viste también la etiqueta
  "ANULADO" del historial.

Las tres tríadas pasan AA sobre su propio fondo (5.96:1 a 6.82:1) y sobre las
tres superficies de la app.

### Tertiary

- **Aviso tranquilo** (`{colors.aviso-fondo}` / `{colors.aviso-tinta}`): verde
  azulado apagado. Es el tono de las notas del sistema que informan sin alarmar:
  excedente pagado de más, precio puesto a mano. Nunca es un error.
- **Colores de iglesia** (`{colors.iglesia-indigo}`, `{colors.iglesia-pizarra}`,
  `{colors.iglesia-arcilla}`, `{colors.iglesia-ciruela}`,
  `{colors.iglesia-tabaco}`, `{colors.iglesia-humo}`): seis opciones cerradas,
  todas oscurecidas y desaturadas al mismo nivel para que ninguna grite más que
  otra. Viven en `src/components/Piezas.tsx`, no en `estilos.css`, porque son
  datos de una iglesia y no superficies del sistema. Solo aparecen como punto de
  8–10px junto al nombre de una iglesia; jamás como fondo de bloque.

### Neutral

- **Papel de la mesa** (`{colors.papel}`): el fondo del documento, la mesa donde
  reposa el libro. Nunca lleva contenido directamente.
- **Hoja** (`{colors.hoja}`): la superficie escrita. Toda la información vive
  sobre esta. También el fondo de campos y diálogos.
- **Hoja segunda** (`{colors.hoja-2}`): la superficie recesiva dentro de una hoja.
  Ya no es la alternancia de filas: hoy viste el renglón de resumen de Inicio, el
  pie del diálogo, el estado de cuenta del comprobante, la franja de archivados de
  Ajustes, el fondo del campo de monto y del buscador de personas, y el hover de
  renglón en la lista de personas.
- **Tinta** (`{colors.tinta}`): texto principal, 14.2–16.1:1 sobre los tres
  fondos. **Tinta segunda** (`{colors.tinta-2}`): rótulos, bajadas, texto de apoyo
  y el "RD$" que precede a una cifra, 6.9–7.8:1. **Tinta tercera**
  (`{colors.tinta-3}`): placeholders, marcas de agua y texto de un pago anulado,
  4.5–5.1:1. Los tres escalones se recalibraron en esta revisión precisamente
  para que ninguno bajara de 4.5:1 sobre `{colors.hoja}`, `{colors.hoja-2}` **ni**
  `{colors.papel}`.
- **Raya** (`{colors.linea}`): el hairline que delimita la hoja, separa los
  renglones y hace de canal vacío en las barras de progreso. **Raya fuerte**
  (`{colors.linea-fuerte}`): el borde de campos y botones de contorno, y el
  pulgar de la barra de scroll.
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

- **cifraEnorme** (600, 3.5rem ≈ 59px, interlineado 1): el número mandón de la
  pantalla. Solo dos lugares: lo recaudado en Inicio y el saldo en la ficha de una
  persona. Una sola por pantalla.
- **cifraGrande** (600, 2.5rem ≈ 42px): el campo donde se escribe el monto del
  abono. Es el único *input* de este tamaño en la app.
- **cifra** (600, 1.75rem ≈ 30px): cifras de segundo nivel — "Le falta", "Abonó",
  los cuatro conteos del evento, el total del comprobante.
- **titulo** (600, 1.4375rem ≈ 24px, tracking −0.011em): el `h1` de cada pantalla.
  Uno por pantalla; también es el rótulo "Tesorera" del lomo.
- **guia** (500, 1.1875rem ≈ 20px): montos en fila, nombre de la persona elegida,
  título de diálogo, campos de búsqueda. El escalón "un poco más importante".
- **base** (400, 1.0625rem ≈ 18px, interlineado 1.55): el texto de lectura y el
  cuerpo de las filas. Es el mínimo de lectura de la app.
- **menuda** (400, 0.9375rem ≈ 16px): rótulos, metadatos de fila, ayudas bajo los
  campos, texto de chips y de píldoras. Creció desde 14px en esta revisión; sigue
  sin cargar información que no exista en otro lado.
- **micro** (600, 0.8125rem ≈ 14px, tracking 0.06em): el escalón más chico que
  existe, y ahora casi no se usa: el conteo dentro de un chip de filtro, la
  etiqueta "ANULADO" del historial y el número de paso del flujo de cobro. **Ya
  no es la clase `.rotulo`.**

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
porcentajes, números de paso. Si una columna de números no cuadra al scrollear, es
que alguien olvidó `.cifra`.

**La regla del "RD$" pequeño.** El símbolo de moneda nunca compite con el número.
El componente `Monto` es el dueño único de esa proporción y la ajusta por escalón:
`0.5em` en `cifra`, `0.46em` en `cifraGrande`, `0.42em` en `cifraEnorme`, y tamaño
pleno en los escalones de texto — siempre en tinta segunda, peso 500, alineado a
la línea base. Ninguna pantalla rehace esos valores a mano. La única excepción
legítima es el prefijo del **campo** de monto, que es una etiqueta dentro de un
input y no un valor.

**La regla del drama reservado.** Los escalones de texto son vecinos (16 → 18 →
20 → 24px); los saltos grandes pertenecen solo al dinero (30 → 42 → 59px). Si un
título de sección quiere ser enorme, la respuesta es no: el número es el
contenido.

## Layout

**El libro abierto.** Toda la app vive en un `flex` de dos partes: el lomo, una
`nav` de 236px de ancho y alto de pantalla completa (`sticky`, `h-screen`), y el
cuerpo, que ocupa el resto con 28px de padding horizontal (36px a partir de `xl`)
y 24px vertical. El contenido del cuerpo se centra con un ancho máximo de 1120px:
en la laptop de destino eso llena la pantalla, y en un monitor grande el libro no
se estira.

**La hoja como unidad.** Cada bloque de contenido es una `.hoja`: fondo
`{colors.hoja}`, radio de 10px, **borde de 1px `{colors.linea}`** y un filo de
sombra casi imperceptible. Las hojas se separan entre sí con 20px (`gap-5` /
`space-y-5`). El padding interior es de 20px (24px en la hoja de Inicio, 28px en
comprobante y reporte); las hojas con lista llevan `overflow-hidden` y trasladan
el padding a cada renglón para que las rayas lleguen de borde a borde.

**El renglón, no la tarjeta.** Las listas son `<ul>` cuyos `<li>` llevan
`.renglon`: una raya inferior de `{colors.linea}` y nada más — sin raya en el
último, **sin trama alterna**. La altura mínima la fija lo que el renglón carga:
46px en la lista de personas (una línea), 52px en los últimos pagos, 58px en el
resumen por iglesia y en las iglesias de Ajustes, 62px en el buscador del flujo de
cobro, 64px en el historial de pagos, 66px en los tipos de cupo.

**Las columnas de la lista de personas.** Un renglón es **una sola línea**, y sus
columnas están fijadas: Nombre (flexible, con `truncate`) · Iglesia (248px) · Ha
pagado (112px, alineada a la derecha) · Su cupo (112px, alineada a la derecha) ·
Cómo va (128px). Los dos montos van en **columnas separadas, cada una alineada
consigo misma**: pegados en un solo bloque, lo pagado bailaba de izquierda a
derecha según lo largo que fuera el precio. Cuando alguien no está inscrito, las
dos columnas de dinero se funden en una sola de 224px que dice "Sin inscribir".

**Buscar delante, filtrar detrás.** El campo de búsqueda está siempre a la vista
porque es lo que ella hace veinte veces al día; los filtros viven detrás de un
botón "Filtros" que despliega su propia hoja con las filas de píldoras (Cómo va ·
Tipo de cupo · Iglesia · Orden). Con el panel cerrado, los filtros puestos se
quedan a la vista como píldoras removibles: un filtro escondido que ella no ve es
una lista que "perdió" gente.

**Rejillas confirmadas.** Solo existen tres formas:
1. Pantalla de una columna (Ajustes, Comprobante, Reporte).
2. Contenido + rail auxiliar de 340px (`lg:grid-cols-[minmax(0,1fr)_340px]` en
   Registrar pago; el rail a la izquierda en la ficha de persona).
3. **Inicio es una sola hoja**, no cuatro apiladas: cabecera con lo recaudado y la
   barra, un renglón de resumen con los cuatro conteos entre dos rayas sobre
   `{colors.hoja-2}`, y debajo el doblez del libro — `grid lg:grid-cols-2
   lg:divide-x lg:divide-linea`, "Últimos pagos" a la izquierda y "Por iglesia" a
   la derecha.

**Comportamiento responsivo: estructural, no tipográfico.** Los únicos cambios por
ancho son colapsar las rejillas a una columna y ocultar columnas secundarias de la
lista de personas (Iglesia y "Cómo va" desaparecen bajo `sm`). El tamaño de letra
nunca cambia.

**Impresión.** El comprobante y el reporte se imprimen desde la misma hoja: `@page`
de 14mm, raíz a 12pt, fondo `{colors.papel-impreso}`, `.no-imprimir` oculta el
lomo, la navegación y los botones, y la `.hoja` cambia su sombra por un borde de
1px `{colors.linea-impresa}`. No hay una vista de impresión aparte; la hoja *es*
el documento.

### Named Rules

**La regla de la hoja sola.** Nunca una `.hoja` dentro de otra `.hoja`. Si un
bloque necesita subdividirse, se subdivide con hairlines, con `{colors.hoja-2}` o
con espacio — nunca con una superficie nueva.

**La regla de la raya y el aire.** Una fila se separa de la siguiente con una raya
de 1px y con espacio, no con relleno de fondo. Raya + trama alterna + columnas a
la vez es una hoja de cálculo, no un libro. (La única alternancia que queda en la
app es la tabla del **reporte impreso**, donde la trama ayuda a seguir la fila con
el dedo en papel; no es licencia para traerla de vuelta a la pantalla.)

**La regla de las cuatro pestañas.** El lomo lleva exactamente cuatro entradas
(Inicio, Personas, Registrar pago, Ajustes). Una pantalla nueva se cuelga de una
de las cuatro; no se agrega una quinta.

## Elevation & Depth

El sistema es **plano y se define por trazo**. La profundidad la da el papel, no
la luz, y desde esta revisión la jerarquía es: la mesa (`{colors.papel}`, sin
nada), la hoja (borde de 1px más un filo de sombra de 1px que apenas la despega) y
el diálogo (la única sombra realmente profunda de la app). Todo lo demás
—renglones, chips, campos, botones— es plano y se separa con hairlines o con
relleno. Los botones no se levantan al hover: cambian de color y se hunden un 2%
al presionar (`active:scale-[0.98]`).

### Shadow Vocabulary

- **hoja** (`border: 1px solid var(--linea)` + `box-shadow: 0 1px 2px rgba(58,42,28,0.04)`):
  el reposo de toda superficie de contenido. El borde es lo que la define; la
  sombra solo evita que se vea pegada como una calcomanía.
- **dialogo** (`box-shadow: 0 12px 24px -8px rgba(40,28,18,0.18), 0 32px 64px -24px rgba(40,28,18,0.32)`):
  solo para `<dialog>`, acompañada de un `::backdrop` de `rgba(40,28,18,0.42)`.
  Es la única sombra profunda que el sistema autoriza, y existe porque el diálogo
  sí está por encima del libro.
- **toast** (`box-shadow: 0 2px 4px rgba(58,42,28,0.06), 0 14px 32px -14px rgba(58,42,28,0.28)`):
  el aviso de Sonner, que flota sobre todo y necesita despegarse de verdad.
- **botón sólido** (`box-shadow: 0 1px 2px rgba(58,42,28,0.12)`): un filo de 1px
  bajo el botón principal, para que se lea como una pieza y no como una mancha.

### Named Rules

**La regla del trazo antes que la luz.** Una superficie se delimita con una raya;
la sombra solo se usa cuando algo está de verdad por encima del libro (diálogo,
toast). Si un bloque nuevo pide sombra para verse separado, lo que le falta es
una raya o aire.

**La regla de la sombra de tinta.** Las sombras nunca son negras: su color es
`rgba(58,42,28,…)` (o `rgba(40,28,18,…)` en el diálogo), la sombra que proyecta
papel sobre papel. Siempre llevan desplazamiento vertical real y difusión suave;
nunca un halo plano centrado ni un desplazamiento duro.

## Shapes

Tres radios y nada más: **10px** para la hoja y el diálogo (el corte de una hoja
de libreta), **8px** para las piezas que se tocan —botones, campos, píldoras
cuadradas, botones de icono— y **999px** para lo que es un contador o una marca:
chips de estado, chips de filtro, barras de progreso, puntos de color, el número
de paso. El foco del teclado redondea a 4px.

Los bordes son de 1px y solo existen en dos pesos: `{colors.linea}` para delimitar
una hoja y separar renglones e información dentro de ella, `{colors.linea-fuerte}`
para delimitar algo interactivo (campo, botón de contorno). Un borde de
`{colors.accion}` significa siempre "esto está enfocado o seleccionado", nunca
decoración.

Las barras de progreso son la silueta recurrente del sistema: cápsula de 8px de
alto por defecto, 10px en la ficha de persona y en el recibo del cobro, 12px en la
barra grande de Inicio. Canal `{colors.linea}`, relleno con la *marca* del estado,
y crecimiento por `transform: scaleX()` desde el origen izquierdo. Las listas ya
no llevan barras: dos columnas de cifras dicen lo mismo y no dejan nada colgando
debajo del renglón.

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
- **principal:** fondo `{colors.accion}`, texto blanco (7.99:1), filo de 1px. Es
  el único botón sólido y hay **uno por pantalla**: "Registrar pago", "Guardar
  pago", "Agregar persona", el confirmar de un diálogo.
- **contorno:** fondo `{colors.hoja}` con borde `{colors.linea-fuerte}`; al hover
  el borde sube a `{colors.tinta-3}` y el fondo a `{colors.hoja-2}`. La acción
  secundaria de igual peso.
- **suave:** fondo `rgba(138,51,64,0.07)` (0.12 al hover), texto de acción, sin
  borde. Para un atajo sugerido ("Saldar: RD$ 1,200") y para el botón "Filtros"
  cuando hay filtros puestos.
- **texto:** sin fondo ni borde, texto `{colors.tinta-2}`. Para salidas y
  cancelaciones ("Cambiar", "No, dejarlo así").
- **Estados:** hover cambia fondo o borde en 150ms con la curva `salida`; `active`
  escala a 0.98; deshabilitado baja a 45% de opacidad y desactiva el puntero; en
  carga, el icono se sustituye por un anillo giratorio de 17px y el botón se
  deshabilita solo.

### Chips

Tres familias distintas que no deben mezclarse.

- **ChipEstado** (informativo): cápsula con el par fondo/tinta del estado, punto de
  7px con la *marca*, y **siempre** el texto del estado. Hoy respira más:
  `text-menuda`, `gap-2`, `px-3 py-1`. No es pulsable, no cambia de tamaño, y su
  orden de aparición es siempre Pagado → Abonando → Sin pagos.
- **Chip de filtro** (interactivo, dentro del panel de Filtros): cápsula de
  **44px** de alto, `px-3.5`, `text-menuda`. En reposo, borde `{colors.linea}` y
  texto `{colors.tinta-2}`; activo, borde `{colors.accion}`, fondo
  `rgba(138,51,64,0.09)` y texto de acción, con `aria-pressed`. Lleva el conteo de
  resultados en `micro` a la derecha y un punto de color cuando representa una
  iglesia.
- **Filtro puesto** (removible, cuando el panel está cerrado): cápsula de acento
  con el texto del filtro y un botón redondo con el icono de cerrar, que dice
  `aria-label="Quitar el filtro …"`. Comunica lo mismo que el chip activo, pero su
  gesto es quitar, no alternar.

### Cards / Containers

No hay tarjetas: hay **hojas**. Radio de 10px, fondo `{colors.hoja}`, borde de 1px
`{colors.linea}` y un filo de sombra. El padding interior es de 20px (24px en
Inicio, 28px en los documentos imprimibles); las hojas con lista usan
`overflow-hidden` y llevan el padding a cada renglón. La cabecera de una hoja con
lista es una franja con hairline inferior, título en peso 600 y, a la derecha, un
enlace en `menuda` con el icono de avance.

### Inputs / Fields

Carácter: la línea donde se escribe, no una caja hundida.

- **Estilo:** altura mínima 46px, radio 8px, fondo `{colors.hoja}` (o
  `{colors.hoja-2}` cuando el campo es un buscador o el campo de monto dentro de
  una hoja), borde de 1px `{colors.linea-fuerte}`, placeholder en
  `{colors.tinta-3}`. Etiqueta encima en `menuda`, peso 500, `{colors.tinta-2}`.
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
Ancho por defecto 460px (520px en formularios), radio 10px, fondo `{colors.hoja}`,
sombra `dialogo`, backdrop `rgba(40,28,18,0.42)`. Cabecera con título en `guia`
peso 600 y un botón de cerrar; pie opcional con fondo `{colors.hoja-2}`, hairline
superior y los botones alineados a la derecha.

`Confirmacion` es la única forma de pedir permiso: el botón de salida dice "No,
dejarlo así" y el de confirmar dice exactamente lo que va a pasar ("Sí, anular
este pago"), nunca "Aceptar".

### La barra de progreso (componente insignia)

Es el instrumento de la app y su único momento con autoría. Canal en
`{colors.linea}`, relleno con la *marca* del estado, animado con
`transform: scaleX(proporción)` desde `origin-left` en **420ms** con la curva
`salida`. Nunca se anima `width`.

Al guardar un pago, el recibo monta la barra con el valor **anterior** y en el
siguiente frame la sube al nuevo: la usuaria ve entrar su abono. Es la única
animación de la app que dura más de 250ms, y es deliberada.

El color del relleno **siempre sale de `calcularEstado(pagado, precio)`**, incluso
en las barras agregadas. La barra grande de Inicio no es verde por ser un total:
es verde solo cuando de verdad está cobrado completo, ámbar mientras se abona y
gris cuando no hay nada. Pintar de verde un progreso a medias es mentirle a quien
mira la pantalla de lejos.

### Estado vacío

Nunca dice "no hay nada": dice qué hacer. Un dibujo de 72×52 de hoja reglada en
blanco (con su raya de margen en rúbrica al 30%), título en `guia` peso 600, una
explicación de máximo 38 caracteres de ancho en `{colors.tinta-2}`, y un botón que
ejecuta el siguiente paso ("Registrar el primer pago", "Agregar la primera
persona").

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

- **Duración ordinaria:** 150ms para cambios de color y estado; 180ms para el
  diálogo; 260ms para la entrada de un renglón; 300ms para la entrada de una hoja;
  **420ms solo para la barra de progreso**.
- **Curvas:** tres, y solo tres, declaradas como variables — `--salida`
  (`cubic-bezier(0.23,1,0.32,1)`, la de casi todo), `--entrasale`
  (`cubic-bezier(0.77,0,0.175,1)`) y `--gaveta` (`cubic-bezier(0.32,0.72,0,1)`).
  Nada de `ease`, `linear` ni curvas de fábrica en animaciones nuevas.
- **Entradas:** las listas usan `.entra-renglon` (opacidad + 5px de subida, con
  retardo escalonado de 26ms por índice vía `--i`, tope de 12 elementos); las
  pantallas usan `.entra-hoja` (opacidad + 7px). Nada nace desde cero: siempre
  desde un estado casi visible.
- **Diálogo:** escala de 0.97 a 1 con 6px de subida, con `@starting-style` y
  `allow-discrete` sobre `overlay`/`display`; el backdrop hace fundido aparte.
- **Movimiento reducido:** con `prefers-reduced-motion`, las entradas conservan la
  opacidad y pierden el desplazamiento, y todo lo demás cae a 0.01ms.
- **Prohibido:** rebote, elástico, parallax, y animar `width`, `height` o
  `top/left`.

### Toasts

Sonner abajo a la derecha con 20px de separación, vestido con los tokens del
sistema: fondo `{colors.hoja}`, borde `{colors.linea-fuerte}`, radio 10px, sombra
de toast, Fira Sans a 0.9375rem. El título lleva el monto y el nombre; la
descripción dice qué queda ("Le faltan RD$ 800", "Quedó pagado completo").

## Do's and Don'ts

### Do:

- **Do** construir toda lista como renglones (`.renglon`) dentro de una sola
  `.hoja`, separados por el hairline de `{colors.linea}` y por aire.
- **Do** definir cualquier superficie nueva con una raya de 1px, no con una sombra.
- **Do** usar el componente `Monto` para cualquier cantidad de dinero, y `.cifra`
  para cualquier número comparable.
- **Do** derivar el color de toda barra de progreso —incluidas las agregadas— de
  `calcularEstado(pagado, precio)`.
- **Do** dejar exactamente un botón sólido `principal` por pantalla, y que su texto
  diga la acción concreta ("Guardar pago", no "Aceptar").
- **Do** acompañar todo color de estado con su texto y su `aria-valuetext`.
- **Do** mantener 44px de alto mínimo en todo lo que se toca y el `:focus-visible`
  de 2px del color de acción visible siempre.
- **Do** verificar cualquier color de texto nuevo contra AA sobre `{colors.hoja}`,
  `{colors.hoja-2}` **y** `{colors.papel}`, no solo sobre el fondo más claro.
- **Do** escribir cada estado vacío como una instrucción con su botón.
- **Do** dibujar cualquier icono nuevo en la caja de 24 con trazo 1.6 y remates
  redondos, dentro de `src/components/Iconos.tsx`.
- **Do** marcar con `.no-imprimir` todo lo que no debe salir en papel, y usar
  `{colors.papel-impreso}` / `{colors.linea-impresa}` para lo que sí sale.
- **Do** animar posición y tamaño con `transform` y `opacity`, con una de las tres
  curvas del sistema.

### Don't:

- **Don't** anidar una `.hoja` dentro de otra, ni convertir un renglón en tarjeta
  con sombra o borde propio.
- **Don't** devolver la trama alterna a los renglones de pantalla, ni traer de
  vuelta la raya roja de margen (`.margen-rubrica`) a una lista: se quitaron a
  propósito.
- **Don't** usar rojo para un estado de pago ni para una persona que debe. El único
  rojo de la app es el vino de acción, y pertenece a los botones.
- **Don't** dar a una iglesia (ni a ninguna identidad) un color verde o ámbar: esos
  dos tonos ya están comprometidos con "Pagado" y "Abonando".
- **Don't** introducir un segundo color de acento, un degradado, ni un color fuera
  de las variables de `src/estilos.css` (con la única excepción declarada de la
  paleta de iglesias en `Piezas.tsx`).
- **Don't** poner un rótulo en mayúsculas espaciadas: `.rotulo` es en minúscula
  por decisión de legibilidad.
- **Don't** bajar un texto por debajo de `micro`, ni usar `micro` para algo que no
  se pueda leer en otro lado de la misma pantalla.
- **Don't** cambiar el tamaño de letra por ancho de pantalla ni introducir `clamp`:
  la escala es fija por decisión, para un solo dispositivo.
- **Don't** usar emojis, glifos de texto (`›`, `×`, `✓`) ni una librería de iconos
  como reemplazo del juego dibujado a mano.
- **Don't** escribir una cifra sin cifras tabulares, ni un monto sin el "RD$"
  del componente `Monto`, ni redefinir a mano la proporción del símbolo.
- **Don't** animar `width` en una barra de progreso, ni pasar de 250ms en nada que
  no sea esa barra al guardar un pago.
- **Don't** usar rebote, elástico o parallax, ni ignorar `prefers-reduced-motion`.
- **Don't** poner una palabra en inglés ni jerga técnica en ninguna superficie
  visible, incluidos los mensajes de error.
- **Don't** agregar una quinta entrada al lomo: una pantalla nueva se cuelga de una
  de las cuatro.
- **Don't** confirmar una acción seria con "Aceptar"/"Cancelar": el botón dice lo
  que va a pasar y la salida dice "No, dejarlo así".
