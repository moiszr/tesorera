---
name: Tesorera
description: El libro de caja encuadernado — lomo de tela, hoja de papel y columnas de cifras para llevar los abonos de la convención.
colors:
  papel: "#f3efe6"
  hoja: "#fffdf8"
  hoja-2: "#faf7f0"
  tinta: "#241f1b"
  tinta-2: "#6b6259"
  tinta-3: "#948a80"
  linea: "#e6dfd2"
  linea-fuerte: "#d3c8b6"
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
  iglesia-oliva: "#5f6b3a"
  iglesia-arcilla: "#8a5a3c"
  iglesia-ciruela: "#6d4560"
  iglesia-mar: "#2f6068"
  iglesia-ocre: "#8a6f26"
typography:
  micro:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.08em"
  menuda:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: "1.15rem"
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
  renglon: "10px"
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
  campo-focus:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
  campo-monto:
    backgroundColor: "{colors.hoja-2}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "12px 16px 12px 67px"
    typography: "{typography.cifraGrande}"
  chip-pagado:
    backgroundColor: "{colors.pagado-fondo}"
    textColor: "{colors.pagado-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 10px"
    typography: "{typography.menuda}"
  chip-abonando:
    backgroundColor: "{colors.abonando-fondo}"
    textColor: "{colors.abonando-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 10px"
    typography: "{typography.menuda}"
  chip-sinpagos:
    backgroundColor: "{colors.sinpagos-fondo}"
    textColor: "{colors.sinpagos-tinta}"
    rounded: "{rounded.redondo}"
    padding: "4px 10px"
    typography: "{typography.menuda}"
  chip-filtro:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.redondo}"
    padding: "0 12px"
    height: "44px"
  chip-filtro-activo:
    backgroundColor: "rgba(138, 51, 64, 0.09)"
    textColor: "{colors.accion}"
    rounded: "{rounded.redondo}"
    padding: "0 12px"
    height: "44px"
  lomo:
    backgroundColor: "{colors.lomo}"
    textColor: "{colors.lomo-texto}"
    width: "224px"
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
donde se escribe. Esa metáfora no es decoración: define la estructura de cada
pantalla. Donde un dashboard genérico pondría una retícula de tarjetas, aquí hay
renglones separados por rayas finas, encabezados de columna en mayúsculas
pequeñas y una raya roja de margen que marca dónde empieza el cuerpo de la tabla.

La densidad es de herramienta de trabajo, no de landing: texto base de 18px sobre
una raíz de 17px, filas de 62px, botones de 44px, y todo lo importante cabe en
1366×768 sin scroll horizontal. La escala tipográfica es **fija, no fluida**,
porque hay un solo dispositivo de destino y la estabilidad de las columnas vale
más que la adaptabilidad. El color se administra con avaricia: un solo acento
(la familia oxblood) reservado para acciones, y tres colores de estado que
existen únicamente para decir cómo va un pago — siempre acompañados de su texto.

El contenido son los números. Toda la dramaturgia de la escala tipográfica está
reservada al dinero: los pasos de texto son vecinos cercanos (18 → 20 → 24px)
mientras que las cifras saltan a 30, 42 y 59px. Lo que la usuaria necesita ver de
lejos —lo recaudado, lo que falta— es lo único que crece.

**Key Characteristics:**

- Lomo de tela a la izquierda (224px) + hoja de papel a la derecha; una sola hoja
  por bloque, nunca una hoja dentro de otra.
- Renglones con hairline y alternancia tenue en lugar de tarjetas.
- Una sola familia tipográfica (Fira Sans) con cifras tabulares obligatorias.
- Un solo acento (oxblood) para acciones; verde/ámbar/gris solo para estado de pago.
- Escala fija en rem sobre raíz de 17px; sin modo oscuro, sin tipografía fluida.
- Movimiento breve y de una sola curva; la barra de progreso al guardar es el único
  momento con autoría.

## Colors

Una paleta de papel envejecido e imprenta: tierras cálidas y desaturadas, con un
solo rojo vinoso que carga todas las acciones y tres colores de estado prestados
del semáforo pero rebajados a tinta de libro.

### Primary

- **Vino de acción** (`{colors.accion}`): el único acento de la app. Botón sólido
  principal, borde y texto de lo seleccionado, borde y anillo de foco de los
  campos, enlaces dentro del texto, `caret-color` y `accent-color` del documento.
  Su versión oscura (`{colors.accion-alto}`) es exclusivamente el hover del botón
  sólido. Aparece además al 5–12% de opacidad como fondo de hover de renglón,
  de opción resaltada y de píldora seleccionada.
- **Tela del lomo** (`{colors.lomo}`): la encuadernación. Solo la barra lateral de
  navegación y el favicon. `{colors.lomo-alto}` es la pestaña activa;
  `{colors.lomo-texto}` la tinta sobre la tela; `{colors.lomo-pestana}` la marca
  de 3px que señala la pestaña marcada del libro.
- **Rúbrica** (`{colors.rubrica}`): la raya roja de margen del libro mayor. Se usa
  **solo al 28% de opacidad**, a 44px del borde interior, y solo en listas
  tabulares (`.margen-rubrica`). Es estructural: dice dónde empieza el cuerpo de
  la tabla. Nunca se usa como color de texto ni de relleno.

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

### Tertiary

- **Aviso tranquilo** (`{colors.aviso-fondo}` / `{colors.aviso-tinta}`): verde
  azulado apagado. Es el tono de las notas del sistema que informan sin alarmar:
  excedente pagado de más, precio puesto a mano. Nunca es un error.
- **Colores de iglesia** (`{colors.iglesia-indigo}`, `{colors.iglesia-oliva}`,
  `{colors.iglesia-arcilla}`, `{colors.iglesia-ciruela}`, `{colors.iglesia-mar}`,
  `{colors.iglesia-ocre}`): seis opciones cerradas, todas oscurecidas y
  desaturadas al mismo nivel para que ninguna grite más que otra. Solo aparecen
  como punto de 8–10px junto al nombre de una iglesia; jamás como fondo de bloque.

### Neutral

- **Papel de la mesa** (`{colors.papel}`): el fondo del documento, la mesa donde
  reposa el libro. Nunca lleva contenido directamente.
- **Hoja** (`{colors.hoja}`): la superficie escrita. Toda la información vive
  sobre esta. También el fondo de campos y diálogos.
- **Renglón alterno** (`{colors.hoja-2}`): la alternancia tenue de las filas
  pares, el fondo de los campos de búsqueda y del pie de los diálogos.
- **Tinta** (`{colors.tinta}`): texto principal. **Tinta segunda**
  (`{colors.tinta-2}`): rótulos, bajadas, texto de apoyo y el "RD$" que precede a
  una cifra. **Tinta tercera** (`{colors.tinta-3}`): marcas de agua, números de
  fila, placeholders, y el texto de un pago anulado.
- **Raya** (`{colors.linea}`): el hairline entre renglones y el canal vacío de las
  barras de progreso. **Raya fuerte** (`{colors.linea-fuerte}`): el borde de
  campos y botones de contorno, y el encabezado de columna.

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
- **menuda** (400, 0.8125rem ≈ 14px): metadatos de fila, ayudas bajo los campos,
  texto de chips y píldoras. Nunca carga información que exista solo aquí.
- **micro** (600, 0.6875rem ≈ 12px, tracking 0.08em, MAYÚSCULAS): la clase
  `.rotulo`. Es el encabezado de columna del libro mayor y la etiqueta de un dato
  ("Recaudado", "Le falta", "Forma de pago"). Es un rótulo de dato, no un
  antetítulo decorativo: siempre está pegado al valor que nombra.

### Named Rules

**La regla de las cifras tabulares.** Todo número que la usuaria pueda comparar
con otro lleva la clase `.cifra` (`tabular-nums lining-nums`). Montos, conteos,
porcentajes, números de fila. Si una columna de números no cuadra al scrollear, es
que alguien olvidó `.cifra`.

**La regla del "RD$" pequeño.** El símbolo de moneda nunca compite con el número:
va en `{colors.tinta-2}`, peso 500 y —en cifras grandes— a la mitad del tamaño
(`0.5em`) alineado a la línea base. El componente `Monto` ya lo hace; úsalo en vez
de escribir el símbolo a mano.

**La regla del drama reservado.** Los escalones de texto son vecinos (18 → 20 →
24px); los saltos grandes de la escala pertenecen solo al dinero (30 → 42 → 59px).
Si un título de sección quiere ser enorme, la respuesta es no: el número es el
contenido.

## Layout

**El libro abierto.** Toda la app vive en un `flex` de dos partes: el lomo, una
`nav` fija de 224px de ancho y alto de pantalla completa (`sticky`, `h-screen`), y
el cuerpo, que ocupa el resto con 28px de padding horizontal (36px a partir de
`xl`) y 24px vertical. El contenido del cuerpo se centra con un ancho máximo de
1120px: en la laptop de destino eso llena la pantalla, y en un monitor grande el
libro no se estira.

**La hoja como unidad.** Cada bloque de contenido es una `.hoja`: fondo
`{colors.hoja}`, radio de 10px y sombra de pliego. Las hojas se separan entre sí
con 20px (`gap-5` / `mb-5`). El padding interior es de 20px (o 24px en la hoja
principal de Inicio); las listas anulan el padding y lo trasladan a cada renglón
(20px horizontales) para que las rayas lleguen de borde a borde.

**El renglón, no la tarjeta.** Las listas son `<ul>` de `.renglon`: hairline
inferior de `{colors.linea}`, sin raya en el último, y fondo `{colors.hoja-2}` en
los pares. Altura mínima de 62px por fila (54px en listas compactas, 64px en el
historial de pagos). Las listas tabulares llevan además `.margen-rubrica`: la raya
roja vertical a 44px del borde, que corre por todo el bloque.

**Rejillas confirmadas.** Solo existen tres formas:
1. Pantalla de una columna (Ajustes, Comprobante, Reporte).
2. Contenido + rail auxiliar de 340px (`lg:grid-cols-[minmax(0,1fr)_340px]` en
   Registrar pago; invertido en la ficha de persona).
3. Dos columnas asimétricas 1.15fr / 1fr en Inicio.
La banda de conteos usa `grid-cols-2 sm:grid-cols-4` con `divide-x divide-linea`.

**Comportamiento responsivo: estructural, no tipográfico.** Los únicos cambios por
ancho son colapsar las rejillas a una columna y ocultar columnas secundarias de la
lista (`#` y "Cómo va" desaparecen bajo `sm`). El tamaño de letra nunca cambia.

**Impresión.** El comprobante y el reporte se imprimen desde la misma hoja: `@page`
de 14mm, raíz a 12pt, fondo blanco, `.no-imprimir` oculta el lomo, la navegación y
los botones, y la `.hoja` cambia su sombra por un borde de 1px. No hay una vista de
impresión aparte; la hoja *es* el documento.

### Named Rules

**La regla de la hoja sola.** Nunca una `.hoja` dentro de otra `.hoja`. Si un
bloque necesita subdividirse, se subdivide con hairlines, con `{colors.hoja-2}` o
con espacio — nunca con una superficie elevada nueva.

**La regla de las cuatro pestañas.** El lomo lleva exactamente cuatro entradas
(Inicio, Personas, Registrar pago, Ajustes). Una pantalla nueva se cuelga de una
de las cuatro; no se agrega una quinta.

## Elevation & Depth

El sistema es casi plano y la profundidad la da el papel, no la luz. Hay
exactamente tres niveles: la mesa (`{colors.papel}`, sin sombra), la hoja (una
sombra doble muy suave que la despega apenas de la mesa) y el diálogo (la única
sombra realmente profunda de la app). Todo lo demás —renglones, chips, campos,
botones— es plano y se separa con hairlines o con relleno. Los botones no se
levantan al hover: cambian de color y se hunden un 2% al presionar
(`active:scale-[0.98]`).

### Shadow Vocabulary

- **pliego** (`box-shadow: 0 1px 2px rgba(58,42,28,0.05), 0 8px 24px -12px rgba(58,42,28,0.16)`):
  la sombra de la `.hoja`. Estado de reposo de toda superficie de contenido.
- **levanta** (`box-shadow: 0 2px 4px rgba(58,42,28,0.06), 0 14px 32px -14px rgba(58,42,28,0.22)`):
  un escalón más; es la sombra del toast de Sonner.
- **dialogo** (`box-shadow: 0 12px 24px -8px rgba(40,28,18,0.18), 0 32px 64px -24px rgba(40,28,18,0.32)`):
  solo para `<dialog>`, acompañada de un `::backdrop` de `rgba(40,28,18,0.42)`.
- **botón sólido** (`box-shadow: 0 1px 2px rgba(58,42,28,0.12)`): un filo de 1px
  bajo el botón principal, para que se lea como una pieza y no como una mancha.

### Named Rules

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

Los bordes son de 1px y solo existen en dos pesos: `{colors.linea}` para separar
renglones e información dentro de una hoja, `{colors.linea-fuerte}` para
delimitar algo interactivo (campo, botón de contorno) o encabezar una columna.
Un borde de `{colors.accion}` significa siempre "esto está enfocado o
seleccionado", nunca decoración.

Las barras de progreso son la silueta recurrente del sistema: cápsula de 1.5px a
12px de alto según el contexto (1px en fila de lista, 8px por defecto, 10px en
ficha y recibo, 12px en Inicio), canal `{colors.linea}`, relleno con la *marca*
del estado, y crecimiento por `transform: scaleX()` desde el origen izquierdo.

Los iconos son un juego dibujado a mano: caja de 24, trazo 1.6, remates y uniones
redondeados, `fill: none`, `stroke: currentColor`, tamaño de uso 15–20px. **No hay
emojis ni glifos de texto usados como iconos** en ninguna parte de la app.

## Components

### Buttons

Carácter: piezas de papel grueso. Cambian de color, no de altura.

- **Forma:** radio de 8px (`{rounded.pieza}`), altura mínima 44px, 52px en la
  variante `grande` (que además sube a `guia`). Peso 500, icono opcional a la
  izquierda con 8px de separación.
- **principal:** fondo `{colors.accion}`, texto blanco, filo de 1px. Es el único
  botón sólido y hay **uno por pantalla**: "Registrar pago", "Guardar pago",
  "Agregar persona", el confirmar de un diálogo.
- **contorno:** fondo `{colors.hoja}` con borde `{colors.linea-fuerte}`. La acción
  secundaria de igual peso ("Agregar persona" junto a "Registrar pago").
- **suave:** fondo `rgba(138,51,64,0.07)`, texto de acción, sin borde. Para un
  atajo sugerido, como "Saldar: RD$ 1,200".
- **texto:** sin fondo ni borde, texto `{colors.tinta-2}`. Para salidas y
  cancelaciones ("Cambiar", "No, dejarlo así").
- **Estados:** hover cambia fondo o borde en 150ms con la curva `salida`; `active`
  escala a 0.98; deshabilitado baja a 45% de opacidad y desactiva el puntero; en
  carga, el icono se sustituye por un anillo giratorio de 17px y el botón se
  deshabilita solo.

### Chips

Dos familias distintas que no deben mezclarse.

- **ChipEstado** (informativo): cápsula con el par fondo/tinta del estado, punto de
  7px con la *marca*, y **siempre** el texto del estado. No es pulsable, no cambia
  de tamaño, y su orden de aparición es siempre Pagado → Abonando → Sin pagos.
- **Chip de filtro** (interactivo): cápsula con borde. En reposo, borde
  `{colors.linea}` y texto `{colors.tinta-2}`; activo, borde `{colors.accion}`,
  fondo `rgba(138,51,64,0.09)` y texto de acción, con `aria-pressed`. Lleva el
  conteo de resultados en `micro` a la derecha. *Nota: hoy se dibujan a 36px de
  alto, por debajo del mínimo de 44px que manda el sistema; se corrige al alza,
  no se documenta el 36 como norma.*

### Cards / Containers

No hay tarjetas: hay **hojas**. Radio de 10px, fondo `{colors.hoja}`, sombra
`pliego`, sin borde. El padding interior es de 20px (24px en la hoja principal de
Inicio); las hojas con lista usan `overflow-hidden` y llevan el padding a cada
renglón. La cabecera de una hoja con lista es una franja con hairline inferior,
título en peso 600 y, a la derecha, un enlace en `menuda` con el icono de avance.

### Inputs / Fields

Carácter: la línea donde se escribe, no una caja hundida.

- **Estilo:** altura mínima 46px, radio 8px, fondo `{colors.hoja}` (o
  `{colors.hoja-2}` cuando el campo es un buscador dentro de una hoja), borde de
  1px `{colors.linea-fuerte}`, placeholder en `{colors.tinta-3}`. Etiqueta encima
  en `menuda`, peso 500, `{colors.tinta-2}`.
- **Hover:** el borde sube a `{colors.tinta-3}`.
- **Foco:** borde `{colors.accion}` más un anillo de 2px `rgba(138,51,64,0.18)`.
  El `:focus-visible` global es un contorno de 2px del color de acción con 2px de
  separación, y nunca se anula.
- **Error:** borde `{colors.accion}`, `aria-invalid`, y bajo el campo un mensaje en
  `menuda` del color de acción precedido del icono de aviso. El mensaje dice qué
  hacer ("Escribe cuánto está abonando, por ejemplo 1,000"), nunca qué falló.
- **Ayuda:** en `menuda` `{colors.tinta-2}` bajo el campo; se sustituye por el
  error cuando lo hay.
- **Sin flechitas:** los spinners nativos de `input[type=number]` están anulados;
  los montos se escriben.

### Navigation

El lomo del libro: `{colors.lomo}` sólido, 224px, alto completo, `sticky` y
`.no-imprimir`. Arriba, "Tesorera" en `titulo` blanco y debajo, en `menuda` al 72%
de opacidad, el nombre del evento y la cuenta regresiva. Un hairline al 16% separa
la cabecera de las pestañas.

Cada entrada es una fila de 46px con radio de 8px, icono de 20px y texto de 1rem.
En reposo el texto va al 82% del `{colors.lomo-texto}`; en hover, fondo blanco al
7% y texto blanco; activa, fondo `{colors.lomo-alto}`, texto blanco en peso 600 y
una marca de 3×24px en `{colors.lomo-pestana}` pegada al borde izquierdo, que
aparece por opacidad en 150ms. Al pie, en `micro` al 45%, la nota permanente "Se
respalda sola al abrir".

### Dialogs

`<dialog>` nativo: se encarga solo del foco, del `Escape` y de la capa superior.
Ancho por defecto 460px (520px en formularios), radio 10px, fondo `{colors.hoja}`,
sombra `dialogo`, backdrop `rgba(40,28,18,0.42)`. Cabecera con título en `guia`
peso 600 y un botón de cerrar de 36px; pie opcional con fondo `{colors.hoja-2}`,
hairline superior y los botones alineados a la derecha.

`Confirmacion` es la única forma de pedir permiso: el botón de salida dice "No,
dejarlo así" y el de confirmar dice exactamente lo que va a pasar ("Anular este
pago"), nunca "Aceptar".

### La barra de progreso (componente insignia)

Es el instrumento de la app y su único momento con autoría. Canal en
`{colors.linea}`, relleno con la *marca* del estado, animado con
`transform: scaleX(proporción)` desde `origin-left` en **420ms** con la curva
`salida`. Nunca se anima `width`.

Al guardar un pago, el recibo monta la barra con el valor **anterior** y en el
siguiente frame la sube al nuevo: la usuaria ve entrar su abono. Es la única
animación de la app que dura más de 250ms, y es deliberada.

### Estado vacío

Nunca dice "no hay nada": dice qué hacer. Un dibujo de 72×52 de hoja reglada en
blanco (con su raya de margen), título en `guia` peso 600, una explicación de
máximo 38 caracteres de ancho en `{colors.tinta-2}`, y un botón que ejecuta el
siguiente paso ("Registrar el primer pago", "Agregar la primera persona").

### Motion

- **Duración ordinaria:** 150ms para cambios de color y estado; 180ms para el
  diálogo; 260ms para la entrada de un renglón; 300ms para la entrada de una hoja;
  **420ms solo para la barra de progreso**.
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
- **Movimiento reducido:** con `prefers-reduced-motion`, las entradas conservan la
  opacidad y pierden el desplazamiento, y todo lo demás cae a 0.01ms.
- **Prohibido:** rebote, elástico, parallax, y animar `width`, `height` o
  `top/left`.

### Toasts

Sonner abajo a la derecha con 20px de separación, vestido con los tokens del
sistema: fondo `{colors.hoja}`, borde `{colors.linea-fuerte}`, radio 10px, sombra
`levanta`, Fira Sans a 0.9375rem. El título lleva el monto y el nombre; la
descripción dice qué queda ("Le faltan RD$ 800", "Quedó pagado completo").

## Do's and Don'ts

### Do:

- **Do** construir toda lista como renglones (`.renglon`) dentro de una sola
  `.hoja`, con hairline de `{colors.linea}` y alternancia en `{colors.hoja-2}`.
- **Do** poner `.margen-rubrica` en toda lista tabular: la raya roja al 28% a 44px
  del borde es la firma del libro.
- **Do** usar el componente `Monto` para cualquier cantidad de dinero, y `.cifra`
  para cualquier número comparable.
- **Do** dejar exactamente un botón sólido `principal` por pantalla, y que su texto
  diga la acción concreta ("Guardar pago", no "Aceptar").
- **Do** acompañar todo color de estado con su texto y su `aria-valuetext`.
- **Do** mantener 44px de alto mínimo en todo lo que se toca y el `:focus-visible`
  de 2px del color de acción visible siempre.
- **Do** escribir cada estado vacío como una instrucción con su botón.
- **Do** dibujar cualquier icono nuevo en la caja de 24 con trazo 1.6 y remates
  redondos, dentro de `src/components/Iconos.tsx`.
- **Do** marcar con `.no-imprimir` todo lo que no debe salir en papel, y con
  `.solo-imprimir` lo que solo existe impreso.
- **Do** animar posición y tamaño con `transform` y `opacity`, con una de las tres
  curvas del sistema.

### Don't:

- **Don't** anidar una `.hoja` dentro de otra, ni convertir un renglón en tarjeta
  con sombra o borde propio.
- **Don't** usar rojo para un estado de pago ni para una persona que debe. El único
  rojo de la app es el vino de acción, y pertenece a los botones.
- **Don't** introducir un segundo color de acento, un degradado, ni un color fuera
  de las variables de `src/estilos.css`.
- **Don't** usar la rúbrica a opacidad plena, como texto, o fuera de una lista
  tabular.
- **Don't** cambiar el tamaño de letra por ancho de pantalla ni introducir `clamp`:
  la escala es fija por decisión, para un solo dispositivo.
- **Don't** usar emojis, glifos de texto (`›`, `×`, `✓`) ni una librería de iconos
  como reemplazo del juego dibujado a mano.
- **Don't** escribir una cifra sin cifras tabulares, ni un monto sin el "RD$"
  atenuado del componente `Monto`.
- **Don't** animar `width` en una barra de progreso, ni pasar de 250ms en nada que
  no sea esa barra al guardar un pago.
- **Don't** usar rebote, elástico o parallax, ni ignorar `prefers-reduced-motion`.
- **Don't** poner una palabra en inglés ni jerga técnica en ninguna superficie
  visible, incluidos los mensajes de error.
- **Don't** agregar una quinta entrada al lomo: una pantalla nueva se cuelga de una
  de las cuatro.
- **Don't** confirmar una acción seria con "Aceptar"/"Cancelar": el botón dice lo
  que va a pasar y la salida dice "No, dejarlo así".
