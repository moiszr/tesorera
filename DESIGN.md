---
name: Tesorera
description: Herramienta de cobro moderna — neutros fríos, superficies blancas, un solo acento morado en dos tonos y cifras tabulares; densidad de producto de datos, no de facsímil de cuaderno.
colors:
  fondo: "#f7f7f8"
  hoja: "#ffffff"
  hoja-2: "#fafafa"
  tinta: "#18181b"
  tinta-2: "#52525b"
  tinta-3: "#6b6b76"
  linea: "#e8e8ea"
  linea-fuerte: "#d4d4d8"
  papel-impreso: "#ffffff"
  linea-impresa: "#c9c9cf"
  lomo: "#f1f1f3"
  lomo-texto: "#52525b"
  accion: "#635bff"
  accion-texto: "#5a4fe8"
  accion-alto: "#544aeb"
  accion-suave: "#eeedff"
  accion-borde: "#c5c2ff"
  pagado-fondo: "#dcfce7"
  pagado-tinta: "#166534"
  pagado-marca: "#16a34a"
  abonando-fondo: "#fef3c7"
  abonando-tinta: "#b45309"
  abonando-marca: "#f59e0b"
  sinpagos-fondo: "#f4f4f5"
  sinpagos-tinta: "#52525b"
  sinpagos-marca: "#d4d4d8"
  aviso-fondo: "#eeedff"
  aviso-tinta: "#3f34a8"
  iglesia-purpura: "#7c3aed"
  iglesia-rosa: "#db2777"
  iglesia-cyan: "#0891b2"
  iglesia-pizarra: "#475569"
  iglesia-ciruela: "#a21caf"
  iglesia-grafito: "#57534e"
typography:
  micro:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.01em"
    fontFeature: "cv11 1, ss01 1"
  menuda:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.35rem"
    letterSpacing: "-0.006em"
    fontFeature: "cv11 1, ss01 1"
  base:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: "1.55"
    letterSpacing: "-0.009em"
    fontFeature: "cv11 1, ss01 1"
  guia:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: "1.45"
    letterSpacing: "-0.012em"
    fontFeature: "cv11 1, ss01 1"
  titulo:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: "1.28"
    letterSpacing: "-0.021em"
    fontFeature: "cv11 1, ss01 1"
  cifra:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: "1.15"
    letterSpacing: "-0.022em"
    fontFeature: "tnum 1, lnum 1, cv11 1, ss01 1"
  cifraGrande:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: "-0.026em"
    fontFeature: "tnum 1, lnum 1, cv11 1, ss01 1"
  cifraEnorme:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "-0.03em"
    fontFeature: "tnum 1, lnum 1, cv11 1, ss01 1"
rounded:
  foco: "4px"
  pieza: "6px"
  hoja: "8px"
  redondo: "999px"
spacing:
  fila: "12px"
  pieza: "16px"
  hoja: "20px"
  pagina: "28px"
  pagina-ancha: "36px"
components:
  hoja:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
    padding: "16px"
  metrica:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
    padding: "16px"
  metrica-destacada:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.accion}"
    rounded: "{rounded.hoja}"
    padding: "16px"
    typography: "{typography.cifraGrande}"
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
    backgroundColor: "rgba(99, 91, 255, 0.09)"
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
    backgroundColor: "rgba(99, 91, 255, 0.10)"
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
    backgroundColor: "rgba(99, 91, 255, 0.10)"
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
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.pieza}"
    padding: "0 10px"
    height: "44px"
    typography: "{typography.menuda}"
  lomo-entrada-activa:
    backgroundColor: "{colors.accion-suave}"
    textColor: "{colors.accion}"
    rounded: "{rounded.pieza}"
    padding: "0 10px"
    height: "44px"
    typography: "{typography.menuda}"
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

**Creative North Star: "La herramienta de cobro"**

Tesorera es una herramienta de datos moderna para cobrar. **No es un facsímil de
cuaderno**, y eso hay que decirlo fuerte porque el brief original ("libreta de
tesorería moderna") se leyó primero de forma literal —papel crema, lomo de tela
oxblood, trama alterna de renglones, raya de margen roja, cifras de 56px— y el
usuario lo rechazó tres veces por la misma razón: **se veía viejo**. Lo literal se
retiró por completo. Lo que quedó de aquella lectura es lo único que era estructura
y no disfraz: el renglón separado por una raya fina, la columna de cifras alineada
consigo misma, y la disciplina de no meter ornamento entre la usuaria y el número.

Hoy la identidad la cargan tres cosas y ninguna es una textura: **neutros fríos**
(lienzo `{colors.fondo}`, superficies blancas, rayas `{colors.linea}`), **un solo
acento morado** (`{colors.accion}`) reservado a las acciones, a la entrada activa
de la navegación y al progreso agregado, y **las cifras tabulares**. La barra lateral
es clara, del tono del lienzo y separada por una raya: el bloque de color saturado a
la izquierda era lo que más envejecía la pantalla —pesa mucho, compite con el
contenido y no lo hace ninguna herramienta actual—.

El acento **no** es el vino oxblood de las primeras versiones: el usuario pidió color
vivo, y el oxblood se retiró con el resto de la paleta cálida. El morado actual lo
eligió él directamente. Lo que sí es decisión de sistema —y hay que respetarla— es que
el acento viene en **dos tonos del mismo morado**, porque uno solo no da: el brillante
mide 4.70:1 sobre blanco puro pero **cae a 4.16 sobre la lateral y a 4.07 sobre su
propio fondo lavado**, es decir, no llega a AA como texto sobre las superficies donde
la app lo usa. Por eso el brillante es de **superficie** y el oscuro es de **texto**
(ver *La regla del acento en dos tonos*). Los estados de pago también subieron de
saturación en el mismo movimiento: un verde y un ámbar lavados se leían a documento
viejo.

La densidad es de herramienta de trabajo, no de landing: texto base de 18px sobre
raíz de 16px, renglones de 44–66px, barras de herramientas de 44px, todo dentro de
1366×768 sin scroll horizontal. La escala es **fija, no fluida**: hay un solo
dispositivo de destino y la estabilidad de las columnas vale más que la
adaptabilidad. Los dos escalones chicos son deliberadamente grandes (14px y 16px, no
11px y 13px) porque quien lee esto lee con lentes; eso es accesibilidad, no falta de
refinamiento.

El contenido son los números, pero **el drama tipográfico está contenido a
propósito**. La escala de dinero llega hasta 38px y ahí se detiene: la versión con
una cifra de 56px sobre el lienzo se probó y se retiró, porque no se leía mejor —solo
se veía desproporcionada—. Lo que da jerarquía hoy no es el tamaño extremo sino el
color: en la fila de métricas de Inicio, la que manda es la única escrita en el
acento y con el fondo lavado del acento. El resto del color se administra con
avaricia: tres tonos de estado que existen únicamente para decir cómo va un pago,
siempre acompañados de su texto.

**Key Characteristics:**

- Lateral clara de 236px del tono del lienzo, separada por un hairline; el acento
  solo aparece en la entrada activa. Nunca un bloque de color saturado.
- Superficies blancas sobre lienzo gris frío. Toda superficie de contenido es una
  `.hoja` definida por una raya de 1px, no por una sombra.
- Renglones de una o dos líneas separados por una raya fina. **Sin trama alterna,
  sin raya de margen, sin ornamento de época**: se retiró y no vuelve.
- Una sola familia tipográfica (Inter Variable) con cifras tabulares obligatorias, y
  rótulos en minúscula (nunca versalitas espaciadas).
- Un solo acento (morado) para acciones, entrada activa, progreso agregado y la
  métrica que manda; verde/ámbar/gris solo para estado de pago.
- Toda cifra vive sobre una hoja y va acompañada de un rótulo arriba y una línea de
  apoyo debajo: un número sin contexto no se publica.
- Los controles densos —filtros y selectores— son botones compactos que abren menús
  en la capa superior del navegador, nunca rejillas de píldoras que crecen con los
  datos.
- Escala fija en rem sobre raíz de 16px; sin modo oscuro, sin tipografía fluida.
- Movimiento breve y de una sola curva; la barra de progreso al guardar es el único
  momento con autoría.

## Colors

Neutros fríos de producto de datos —lienzo, blanco y dos grises de raya— con un
único morado que carga todas las acciones y tres colores de estado que solo dicen
cómo va un pago.

### Primary

- **Morado de superficie** (`{colors.accion}`): el acento brillante, y **solo para
  superficies**: fondo del botón sólido, relleno de la barra de progreso agregada
  mientras no esté completa, borde de lo seleccionado (opción elegida, filtro puesto,
  forma de pago elegida), borde y anillo de foco de los campos, `caret-color` y
  `accent-color` del documento. Mide 4.70:1 con blanco encima, así que **como fondo
  con texto blanco pasa AA; como texto sobre las superficies claras de la app, no**
  (4.16 sobre la lateral, 4.07 sobre su propio fondo lavado). Aparece además al 9–18%
  de opacidad como fondo de opción resaltada, de filtro activo, de botón `suave` y de
  resultado resaltado en el buscador de cobro. Su versión oscura
  (`{colors.accion-alto}`) es exclusivamente el hover del botón sólido.
- **Morado de texto** (`{colors.accion-texto}`): el mismo morado un paso más oscuro,
  y **solo para texto sobre fondos claros**: mensajes de error de los campos, texto de
  la opción elegida en menús y selectores, texto del botón `suave`, enlaces y hovers
  de enlace, y el icono de cheque de la opción elegida. Mide **4.9–5.7:1 sobre los
  cuatro fondos** de la app, que es justo lo que el brillante no da.
- **Acento lavado** (`{colors.accion-suave}`) y **borde de acento**
  (`{colors.accion-borde}`): la pareja que viste lo que está *señalado sin ser
  pulsado*. Juntos hacen el fondo y el contorno de la **entrada activa de la lateral**
  y de la **métrica destacada** de Inicio. `{colors.accion-suave}` es además el
  `::selection` del documento y el fondo del `Aviso` neutro.

### Secondary

Los tres colores de estado de pago. Cada uno es una tríada fondo/tinta/marca y no
significa nada fuera del estado de un pago.

- **Pagado** (`{colors.pagado-fondo}` / `{colors.pagado-tinta}` /
  `{colors.pagado-marca}`): verde vivo. La *marca* es el relleno de las barras de
  progreso —y el único color que la barra agregada de Inicio toma cuando de verdad
  está cobrado completo—; el par fondo/tinta viste el chip y la banda de "Pago
  guardado".
- **Abonando** (`{colors.abonando-fondo}` / `{colors.abonando-tinta}` /
  `{colors.abonando-marca}`): ámbar vivo. Es también el tono del `Aviso` que pide
  atención (`tono="ojo"`): persona archivada, nombre repetido, evento sin tipos de
  cupo.
- **Sin pagos** (`{colors.sinpagos-fondo}` / `{colors.sinpagos-tinta}` /
  `{colors.sinpagos-marca}`): gris neutro. Viste también la etiqueta "Anulado" del
  historial.

Los tres subieron de saturación en el rediseño de la paleta, y por una razón dicha en
el código: **un verde y un ámbar lavados se leen a documento viejo**, que es
justamente el defecto que la app lleva tres intentos corrigiendo.

Las tres tríadas pasan AA sobre su propio fondo y sobre las tres superficies de la
app.

### Tertiary

- **Aviso tranquilo** (`{colors.aviso-fondo}` / `{colors.aviso-tinta}`): morado lavado
  —el mismo fondo que `{colors.accion-suave}`, con una tinta morada más oscura. Es el
  tono del componente `Aviso` neutro, que se usa donde hay que
  interrumpir o explicar un número que no cuadra: los avisos de Ajustes al cambiar
  precios, y en la cuenta de la ficha el excedente pagado de más y el precio puesto a
  mano. Nunca es un error. Para notas que solo informan al pie de un total, el
  sistema **no** usa caja de color: usa el patrón `Nota` (ver Components).
- **Colores de iglesia** (`{colors.iglesia-indigo}`, `{colors.iglesia-pizarra}`,
  `{colors.iglesia-arcilla}`, `{colors.iglesia-ciruela}`, `{colors.iglesia-tabaco}`,
  `{colors.iglesia-humo}`): seis opciones cerradas, todas oscurecidas y desaturadas
  al mismo nivel para que ninguna grite más que otra. Viven en
  `src/components/Piezas.tsx`, no en `estilos.css`, porque son datos de una iglesia y
  no superficies del sistema. Solo aparecen como punto de 8px junto al nombre de una
  iglesia; jamás como fondo de bloque.

### Neutral

- **Lienzo** (`{colors.fondo}`): el fondo del documento y el hueco entre hojas.
  **Ningún dato se escribe sobre él**: lo único que lleva encima es el `h1` de cada
  pantalla con su bajada y el enlace de volver de la ficha.
- **Hoja** (`{colors.hoja}`): blanco puro. La superficie de todo el contenido —
  métricas, listas, formularios— y también el fondo de campos, diálogos, menús y de
  la entrada activa de la lateral.
- **Hoja segunda** (`{colors.hoja-2}`): la superficie recesiva dentro de una hoja. No
  es alternancia de filas: viste el hover de renglón, las cabeceras y franjas dentro
  de una hoja, el pie del diálogo, el estado de cuenta del comprobante, la franja de
  archivados de Ajustes, el fondo del campo de monto y del buscador del cobro, y el
  número de paso.
- **Lateral** (`{colors.lomo}`): el gris de la barra de navegación, medio escalón por
  debajo del lienzo; `{colors.lomo-texto}` es la tinta en reposo de las entradas. La
  entrada activa **no** usa un neutro propio: usa el registro lavado del acento.
- **Tinta** (`{colors.tinta}`): texto principal, 16.6–17.7:1 sobre los fondos.
  **Tinta segunda** (`{colors.tinta-2}`): rótulos, bajadas, texto de apoyo y el "RD$"
  que precede a una cifra, 7.2–7.7:1. **Tinta tercera** (`{colors.tinta-3}`):
  placeholders, iconos de apoyo, líneas de apoyo de las métricas, metadatos de fila y
  texto de un pago anulado, 4.9–5.3:1. Los tres escalones están calibrados para no
  bajar de 4.5:1 sobre `{colors.hoja}`, `{colors.hoja-2}` **ni** `{colors.fondo}`.
- **Raya** (`{colors.linea}`): el hairline que delimita la hoja, separa los renglones,
  separa la lateral del cuerpo, dibuja el borde de los menús y hace de canal vacío en
  las barras de progreso. Es también el borde de los controles de la **barra de
  herramientas** (buscador de Personas y botones de filtro). **Raya fuerte**
  (`{colors.linea-fuerte}`): el borde de todo control **dentro de un formulario**
  (campo, selector, botón de contorno, botones de forma de pago), el borde del toast y
  el pulgar de la barra de scroll.
- **Papel impreso** (`{colors.papel-impreso}`) y **raya impresa**
  (`{colors.linea-impresa}`): en papel el fondo es blanco de verdad y el borde del
  recibo tiene que verse en una impresora en gris. Solo existen dentro de
  `@media print`.

### Named Rules

**La regla del acento único.** Hay un solo color de acción en toda la app y es la
familia morada. Si una pantalla nueva necesita "otro color para destacar algo", la
respuesta es jerarquía tipográfica, un rótulo o el acento — nunca un color nuevo.
Prueba concreta: en cualquier captura debe haber **un solo botón sólido**.

**La regla del acento en dos tonos.** El acento son **dos** tonos del mismo morado y
no son intercambiables: `{colors.accion}` (brillante) es de **superficie** —fondo de
botón, píldora activa, relleno de barra— y `{colors.accion-texto}` (oscuro) es de
**texto** sobre fondos claros. No es capricho: el brillante mide 4.70:1 con blanco
encima, pero como texto cae a 4.16 sobre la lateral y 4.07 sobre su propio fondo
lavado, o sea por debajo de AA justo en los sitios donde la app lo pondría. Prueba
concreta: **si el morado es el color de unas letras sobre fondo claro, tiene que ser
`{colors.accion-texto}`**; si es el fondo debajo de letras blancas, `{colors.accion}`.
Un tercer tono no existe.

**La regla de los dos registros del acento.** Además de los dos tonos, el acento tiene
dos formas de vestir un elemento y solo dos: **sólido** (`{colors.accion}` de fondo con
texto blanco) para la acción que se pulsa, y **lavado** (`{colors.accion-suave}` de
fondo con `{colors.accion-borde}` de contorno y texto en `{colors.accion-texto}`) para
lo que está señalado sin ser pulsado — la entrada activa de la lateral y la métrica
destacada. Un registro intermedio no existe.

**La regla de la lateral callada.** La navegación es del tono del lienzo y se separa
del cuerpo con una raya, no con un bloque de color. Un panel saturado a la izquierda
pesa, compite con el contenido y es lo que más envejece una pantalla. El color en la
lateral aparece **solo** en la entrada activa, y aparece en el registro lavado, nunca
como relleno saturado de toda la barra.

**La regla de los hermanos, no morosos.** Los estados de pago son verde, ámbar y
gris, y nunca rojo. Nadie que deba dinero se pinta como falta: el gris de "Sin pagos"
es deliberadamente neutro. El único rojo de la app es el vino de acción, y ese
pertenece a los botones.

**La regla del color acompañado.** Ningún estado se comunica solo con color. Todo
chip lleva su texto ("Pagado", "Abonando", "Sin pagos"), toda barra lleva su
`aria-valuetext` en palabras, y todo punto de color va pegado a un nombre.

**La regla del color prestado.** Ningún color de identidad puede tomar un tono de
estado. Por eso la paleta de iglesias no tiene verde ni ámbar: esos dos ya significan
"Pagado" y "Abonando". Un punto verde de identidad al lado de un chip de estado le
enseña a leer el verde de dos maneras distintas, y entonces el verde deja de querer
decir nada. Si hace falta una séptima iglesia, se busca en azul, tierra, ciruela o
gris — nunca en el semáforo.

**La regla de las dos rayas.** El hairline claro (`{colors.linea}`) es estructura:
delimita superficies, separa renglones, separa la lateral y viste la barra de
herramientas, que es cromo y debe quedarse callada. El hairline fuerte
(`{colors.linea-fuerte}`) es **contorno de algo que se rellena**: campos, selectores,
botones de contorno. Un control de formulario con el borde claro se lee como texto;
un filtro con el borde fuerte compite con la lista.

**La regla del acompañado en pantalla y en papel.** Todo color que carga significado
tiene que pasar AA sobre las tres superficies de la app (`{colors.hoja}`,
`{colors.hoja-2}`, `{colors.fondo}`), no solo sobre la más clara. Un gris que se lee
sobre la hoja y se pierde sobre el lienzo es un gris mal elegido.

## Typography

**Familia única:** Inter Variable (con `Inter`, `system-ui`, `sans-serif` de
respaldo). No hay segunda familia: los "números" no son un mono, son la misma Inter
con cifras tabulares activadas.

**Character:** Inter es la tipografía de Linear y el estándar de producto por
razones concretas, no por moda: x-height alta que la hace legible en tamaños
chicos, diferenciación clara entre 1/l/I, y cifras tabulares impecables, que aquí
es innegociable porque toda columna de dinero tiene que cuadrar.

Va con **`cv11` y `ss01` encendidos en todo el sistema**: son la 'a' de un solo
piso y la 'l' con cola. Sin ellos Inter se lee como Helvetica genérica; con ellos
tiene el aire geométrico que se le reconoce en Linear. `tnum` NO va global —en
prosa las tabulares dejan huecos feos— sino solo en `.cifra`, y ahí el tracking
vuelve a `0`, porque el negativo del texto aprieta los números.

**Raíz de 16px, y no es un paso de la escala: es su fundamento.** Todos los pasos
van en `rem` y cuelgan de ese valor, así que vive en `html` de `estilos.css` y en
ningún token — por eso el detector lo marca como tamaño suelto y por eso no lo es.

Bajó de 17px a 16px al cambiar de Fira Sans a Inter. **No es un recorte de la regla
de accesibilidad del proyecto, que sigue en pie:** Inter tiene la x-height más alta,
así que a 16px se lee del mismo tamaño aparente que Fira a 17. Equivalencia medida,
no supuesta. Si algún día se vuelve a otra familia, este número se recalcula contra
su x-height; no se hereda. La escala es **fija a propósito** (nada de `clamp`): hay un solo destino,
una laptop de 13–14" a ~1366×768, y las columnas de cifras deben medir siempre lo
mismo.

### Hierarchy

- **cifraEnorme** (600, 2.25rem ≈ 38px): el techo de la escala. El saldo en la ficha
  de una persona ("Le falta" mientras deba, "Pagó en total" cuando ya cerró). Una
  sola por pantalla, y siempre dentro de una hoja.
- **cifraGrande** (600, 1.875rem ≈ 32px): dos usos, y los dos son "el número que
  manda aquí": el campo donde se escribe el monto del abono —el único *input* de este
  tamaño en la app— y la métrica destacada de Inicio, que además va en el acento.
- **cifra** (600, 1.5rem ≈ 25px): las cifras de segundo nivel — las tres métricas no
  destacadas de Inicio, "Le falta" del cobro, "Abonó" del recibo, las cifras del
  reporte.
- **titulo** (600, 1.375rem ≈ 23px, tracking −0.014em): el `h1` de cada pantalla. Uno
  por pantalla.
- **guia** (500, 1.1875rem ≈ 20px): nombre de la persona elegida, título de diálogo,
  campos de búsqueda, botón grande, título del estado vacío.
- **base** (400, 1.0625rem ≈ 18px, interlineado 1.55): el texto de lectura y el cuerpo
  de las filas. Es el mínimo de lectura de la app.
- **menuda** (400, 0.9375rem ≈ 16px): rótulos (`.rotulo`), metadatos de fila, ayudas
  bajo los campos, texto de chips, de opciones de menú, de botones de filtro, de las
  entradas de la lateral y de los títulos de sección de las listas de Inicio. Es el
  escalón de trabajo de todo lo denso.
- **micro** (600, 0.8125rem ≈ 14px, tracking 0.06em): el escalón más chico que existe
  y hoy queda **un solo uso en toda la app**: el número de paso del instructivo del
  cobro. No es la clase `.rotulo` y no debe volver a serlo.

### Named Rules

**La regla del rótulo en minúscula.** `.rotulo` es `menuda`, peso 500, tinta segunda,
**en caja normal**. Las versalitas espaciadas se veían a "libro viejo" y, sobre todo,
se leían peor: esto lo mira alguien con lentes, no un tipógrafo. Un rótulo nombra el
valor que tiene al lado ("Recaudado", "Le falta", "Su cupo") y siempre está pegado a
él; nunca es un antetítulo decorativo suelto.

**La regla del extremo chico.** Los dos escalones menores de la escala son
deliberadamente más grandes de lo que pide la convención tipográfica (14px y 16px, no
11px y 13px). Antes de bajar un texto de tamaño, la pregunta no es si se ve elegante
sino si ella lo lee de un vistazo. Nada por debajo de `micro`, y `micro` solo para
datos accesorios que se repiten en otro lado.

**La regla de las cifras tabulares.** Todo número que la usuaria pueda comparar con
otro lleva la clase `.cifra` (`tabular-nums lining-nums`). Montos, conteos,
porcentajes, teléfonos, números de paso. Si una columna de números no cuadra al
scrollear, es que alguien olvidó `.cifra`.

**La regla del "RD$" pequeño.** El símbolo de moneda nunca compite con el número, y se
encoge conforme la cifra crece. El componente `Monto` es el dueño **único** de esa
proporción y la ajusta por escalón: `0.5em` en `cifra`, `0.46em` en `cifraGrande`,
`0.42em` en `cifraEnorme`, y tamaño pleno en los escalones de texto — siempre en tinta
segunda, peso 500, alineado a la línea base. No queda ni una excepción: ninguna
pantalla rehace esa proporción a mano. Si una cifra nueva necesita otra, se agrega un
escalón a `Monto`.

**La regla del drama contenido.** La escala de dinero se detiene en 38px, y eso es una
decisión, no un techo accidental. La versión anterior llegaba a 56px sobre el lienzo y
se retiró: **una cifra gigante no se lee mejor, solo se ve desproporcionada**, y
además obliga al resto de la pantalla a competir con ella. La jerarquía de un número
se resuelve primero con el rótulo y el acento, después con el peso, y solo al final con
el tamaño. Si un título de sección quiere ser enorme, la respuesta sigue siendo no.

## Layout

**El marco.** Toda la app vive en un `flex` de dos partes: la lateral, una `nav` de
236px de ancho y alto de pantalla completa (`sticky`, `h-screen`,
`border-r border-linea`, fondo `{colors.lomo}`, `.no-imprimir`), y el cuerpo, que
ocupa el resto con 28px de padding horizontal (36px a partir de `xl`) y 24px vertical.
El contenido del cuerpo se centra con un ancho máximo de 1120px.

**La hoja como unidad.** Todo dato vive sobre una `.hoja`: fondo `{colors.hoja}`,
radio de 8px, borde de 1px `{colors.linea}` y un filo de sombra casi imperceptible
(`0 1px 2px rgba(24,24,27,0.04)`). El padding interior va según la densidad del
bloque: 16px en las métricas y en las hojas con lista de Inicio, 20px en la cuenta de
la ficha y en las listas de Personas y Ajustes, 28px en comprobante y reporte. Las
hojas con lista llevan `overflow-hidden` y trasladan el padding a cada renglón para
que las rayas lleguen de borde a borde.

**Inicio: el panel de métricas.** Inicio se lee de arriba abajo en tres bloques
separados por 16px:

1. **La fila de métricas**: `grid gap-3 sm:grid-cols-2 xl:grid-cols-4` — cuatro
   `.hoja p-4` iguales (Recaudado · Falta por cobrar · Inscritos · Por cobrar). Cada
   una es rótulo arriba, cifra en el medio y una línea de apoyo debajo en tinta
   tercera. **La primera va destacada**: fondo `{colors.accion-suave}`, borde
   `{colors.accion-borde}` y la cifra en `cifraGrande` del color de acción; las otras
   tres van en `cifra`, tinta principal y hoja blanca. Colapsa a dos columnas en `sm`
   y a una por debajo.
2. **La hoja de progreso** (`.hoja p-5`): el porcentaje a la izquierda y "recaudado
   de meta" a la derecha, ambos en una línea de `menuda`; la barra de 8px a todo el
   ancho debajo; la nota al pie del excedente cuando lo hay; y al final las dos
   acciones ("Registrar pago" sólido + "Agregar persona" de contorno, ambos en tamaño
   normal de 44px). **Esta barra es la excepción de color del sistema**: se rellena
   con el acento mientras se cobra y solo se vuelve verde (`{colors.pagado-marca}`) al
   llegar al 100%. No pasa por `calcularEstado` porque no es el estado de una persona,
   es el avance de la meta — y el avance es una medida de la app, no un diagnóstico.
3. **Las dos listas**: `grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`
   — "Últimos pagos" algo más ancha que "Por iglesia", cada una en **su propia hoja**
   con `overflow-hidden`, y `items-start` para que cada una mida lo que necesite en vez
   de estirarse a la altura de la vecina.

**El renglón, no la tarjeta.** Las listas son `<ul>` cuyos `<li>` llevan `.renglon`:
una raya inferior de `{colors.linea}` y nada más — sin raya en el último, **sin trama
alterna**. La altura mínima la fija lo que el renglón carga: 44px en las entradas de
la lateral, 46px en la lista de personas y en "Últimos pagos", 54px en el historial de
pagos, 62px en el buscador del cobro y en las iglesias de Ajustes, 66px en los tipos de
cupo. Los renglones de "Por iglesia" son de dos líneas y no fijan altura mínima: la fija
su contenido.

**La barra de herramientas de una línea.** En Personas, filtrar ocupa **una fila de
44px**: buscador flexible (mínimo 220px) + un `FiltroMenu` por criterio (Cómo va · Cupo
· Pastor · Iglesia) + el control de Orden al final + "Limpiar" cuando hay algo puesto.
Sustituyó a un panel de cinco filas de píldoras con columna de etiquetas que medía
~450px de alto y que empeoraba con cada iglesia nueva. La regla que queda: **un control
de filtro mide lo mismo con tres opciones que con cincuenta.**

**Las columnas de la lista de personas.** Un renglón es **una sola línea**: Nombre
(flexible, mínimo 150px, con `truncate`) · Iglesia (220px) · Ha pagado (112px, derecha)
· Su cupo (112px, derecha) · Cómo va (128px) · el botón "Cobrar" (112px, derecha). Los
dos montos van en columnas separadas, cada una alineada consigo misma: pegados en un
solo bloque, lo pagado bailaba según lo largo que fuera el precio. Cuando alguien no
está inscrito, las dos columnas de dinero se funden en una que dice "Sin inscribir".

**La columna de cobrar existe mientras quede algo por cobrar.** El botón se pinta solo
si la persona está inscrita **y** su estado no es "pagado": un renglón que dice "Pagado"
y al lado ofrece "Cobrar" se contradice, y de paso la columna deja de ser una pared de
botones que grita más que los números para pasar a señalar a quién falta cobrarle. **La
caja de 112px se queda siempre**, con botón o sin él —también en el encabezado, donde es
un espaciador `aria-hidden`—: es lo que mantiene las cinco columnas anteriores a plomo de
fila en fila. Lo que no se queda es su captura de clics: vacía y captadora serían 112px
muertos por encima del enlace que cubre el renglón entero. A quien ya pagó se le sigue
cobrando desde su ficha —el renglón entero lleva ahí—, que es donde se ven el total
pagado y el excedente antes de tocar nada. Y si el precio de su cupo sube por encima de
lo que pagó, el estado vuelve a "abonando" en la siguiente carga y el botón reaparece
solo.

**Prioridad de columnas al angostar.** Las columnas se caen por prioridad, no todas a
la vez: Iglesia aparece desde `xl`, "Su cupo" desde `md`, y el encabezado de columnas
desde `sm`. Nombre, "Ha pagado" y "Cómo va" no se caen nunca — son la respuesta a
"¿cuánto pagó fulano?".

**Rejillas confirmadas.** Solo existen cinco formas:
1. Pantalla de una columna (Ajustes, Comprobante a 560px, Reporte).
2. Contenido + rail auxiliar de 340px **a la derecha**
   (`lg:grid-cols-[minmax(0,1fr)_340px]` en Registrar pago, **solo cuando hay algo que
   poner en el rail**: el recibo del último pago o el instructivo de tres pasos la
   primera vez).
3. Registrar pago sin rail: **centrado a 680px** (`mx-auto max-w-[680px]`), título
   incluido. Una columna sola pegada a la izquierda con medio ancho vacío al lado se lee
   como un error de maquetación.
4. Rail de 340px **a la izquierda** + contenido
   (`lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]` en la ficha de persona).
5. Inicio: la fila de métricas (`sm:grid-cols-2 xl:grid-cols-4`) y, más abajo, las dos
   listas (`lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`).

Las formas 2, 4 y 5 llevan siempre **`items-start`**, para que cada columna mida lo que
necesite en vez de estirarse a la altura de la vecina.

**La ficha de persona: cuenta a la izquierda, historial a la derecha.** Es la rejilla 4.
A la izquierda, una hoja angosta de 340px (`.hoja h-fit p-5`) con la cuenta: rótulo
("Le falta" mientras deba, "Pagó en total" cuando ya cerró) y `ChipEstado` en la misma
línea, el saldo en `cifraEnorme`, la barra de progreso de 10px, y un `dl` en `menuda`
separado por un hairline con Precio del cupo, Ha pagado y Abonos —dato a la izquierda,
valor a la derecha—; debajo, los avisos que correspondan y las dos acciones apiladas a
todo el ancho ("Registrar abono" sólido y "Cambiar tipo de cupo o precio" de texto). A
la derecha, la hoja del historial.

**El renglón del historial es compacto.** Un pago es **una sola fila** de 54px
(`px-5 py-2`): columna de monto de 108px alineada a la derecha (tachado y en tinta
tercera si está anulado), y a su lado, en la columna flexible, la fecha larga arriba
—con la fecha relativa detrás en tinta tercera— y la forma de pago, la nota o el motivo
de la anulación debajo en `menuda`. Cierran la fila la píldora "Anulado" (par
`sinpagos`) cuando lo está, o los dos botones de icono de 44px (comprobante y anular)
cuando el pago está vivo. Sustituyó a un reparto en cuatro columnas fijas (monto ·
fecha · forma de pago · acciones) que solo cuadraba a lo ancho de la pantalla completa;
con el rail de 340px al lado, la fila compacta es la que sigue siendo legible.

**Comportamiento responsivo: estructural, no tipográfico.** Los únicos cambios por
ancho son colapsar rejillas y esconder columnas secundarias por prioridad. El tamaño de
letra nunca cambia.

**Impresión.** El comprobante y el reporte se imprimen desde la misma hoja: `@page` de
14mm, raíz a 12pt, fondo `{colors.papel-impreso}`, `.no-imprimir` oculta la lateral, la
navegación y los botones, y la `.hoja` cambia su sombra por un borde de 1px
`{colors.linea-impresa}`. No hay una vista de impresión aparte; la hoja *es* el
documento.

### Named Rules

**La regla de la hoja sola.** Nunca una `.hoja` dentro de otra `.hoja`. Si un bloque
necesita subdividirse, se subdivide con hairlines, con `{colors.hoja-2}` o con espacio
— nunca con una superficie nueva.

**La regla de la cifra con suelo.** Toda cifra va **sobre una hoja**, con su rótulo
encima. Se probaron los dos extremos y los dos se retiraron: la cifra enorme escrita
directamente sobre el lienzo, sin superficie —quedaba flotando y descosía la pantalla—
y la caja que solo dibujaba un borde alrededor de un número sin contexto. Lo que quedó
es el término medio y es el patrón de la app: **rótulo + cifra + línea de apoyo, dentro
de una hoja**.

**La regla de la métrica con apoyo.** Una métrica nunca es un número solo. Lleva rótulo
arriba (qué es) y una línea de apoyo en tinta tercera debajo (contra qué se compara:
"68% de la meta", "31 pagaron completo"). Un número sin su línea de apoyo obliga a la
usuaria a buscar el contexto en otra parte de la pantalla, y entonces la métrica no
sirvió de nada.

**La regla de la raya y el aire.** Una fila se separa de la siguiente con una raya de
1px y con espacio, no con relleno de fondo. Raya + trama alterna + columnas a la vez es
una hoja de cálculo, no una herramienta. (La única alternancia que queda en la app es la
tabla del **reporte impreso**, donde la trama ayuda a seguir la fila con el dedo en
papel; no es licencia para traerla de vuelta a la pantalla.)

**La regla del control de tamaño fijo.** Ningún control puede crecer con los datos.
Filtros y selectores son botones de una línea que abren un menú; el menú es lo que
crece, y crece hacia la capa superior del navegador, no hacia abajo empujando la
pantalla. Prueba concreta: si al agregar la iglesia número veinte una pantalla cambia de
alto, ese control está mal hecho.

**La regla de las cuatro entradas.** La lateral lleva exactamente cuatro entradas
(Inicio, Personas, Registrar pago, Ajustes). Una pantalla nueva se cuelga de una de las
cuatro; no se agrega una quinta.

## Elevation & Depth

El sistema es **plano y se define por trazo**. La profundidad la da la raya, no la luz.
La jerarquía es de tres niveles: el lienzo (`{colors.fondo}`, sin nada), la hoja (borde
de 1px más un filo de sombra que apenas la despega) y **la capa superior del navegador**
—diálogos y menús de popover—, que es lo único que de verdad flota. Todo lo demás
(renglones, chips, campos, botones) es plano y se separa con hairlines o con relleno.
Los botones no se levantan al hover: cambian de color y se hunden un 2% al presionar
(`active:scale-[0.98]`).

### Shadow Vocabulary

- **hoja** (`border: 1px solid var(--linea)` + `box-shadow: 0 1px 2px rgba(24,28,27,0.04)`,
  en el código `rgba(24,24,27,0.04)`): el reposo de toda superficie de contenido. El
  borde es lo que la define; la sombra solo evita que se vea pegada como una calcomanía.
- **dialogo** (`0 1px 2px rgba(24,24,27,0.06), 0 12px 28px -8px rgba(24,24,27,0.16), 0 32px 64px -24px rgba(24,24,27,0.22)`):
  la sombra de la capa superior. La usan el `<dialog>` **y los menús de popover** de
  `FiltroMenu` y `Selector`. Es la misma sombra a propósito: las dos cosas están al mismo
  nivel real; lo que las distingue es el velo, no la profundidad.

### Named Rules

**La regla del trazo antes que la luz.** Una superficie se delimita con una raya; la
sombra solo se usa cuando algo está de verdad por encima (diálogo, menú, toast). Todo lo
que solo está *señalado* —la entrada activa de la lateral, la métrica destacada— se marca
con color y anillo, no con sombra. Si un bloque nuevo pide sombra para verse separado, lo
que le falta es una raya o aire.

**La regla del velo, no de la sombra.** Lo que separa un menú de un diálogo no es cuánto
flota sino si oscurece la pantalla: el diálogo interrumpe y lleva velo; el menú es un
control y su `::backdrop` es transparente. Un menú con velo convierte elegir una iglesia
en un acto solemne.

**La regla de la sombra neutra.** Las sombras nunca son negras puras ni cálidas: su color
es `rgba(24,24,27,…)`, el mismo gris frío de la tinta. Siempre llevan desplazamiento
vertical real y difusión suave; nunca un halo plano centrado ni un desplazamiento duro.

## Shapes

Tres radios y nada más: **8px** para la hoja, el diálogo y el menú de popover, **6px**
para las piezas que se tocan —botones, campos, selectores, botones de filtro, botones de
icono, entradas de la lateral— y **999px** para lo que es un contador o una marca: chips
de estado, barras de progreso, puntos de color, el número de paso. El foco del teclado
redondea a 4px. Los radios bajaron de 10/8 a 8/6 en el rediseño: una esquina muy
redondeada lee a "app de consumo", y esto es una herramienta.

Los bordes son de 1px y solo existen en dos pesos, con el reparto que fija *La regla de
las dos rayas*: `{colors.linea}` para estructura y cromo, `{colors.linea-fuerte}` para el
contorno de un control de formulario. Un borde de `{colors.accion}` significa siempre
"esto está enfocado, abierto o seleccionado", nunca decoración.

Las barras de progreso son la silueta recurrente del sistema: cápsula de 8px de alto por
defecto (`BarraProgreso`) y en la barra de Inicio, 10px en la ficha de persona y en el
recibo del cobro, y **4px** en la barra fina que acompaña cada renglón de "Por iglesia".
Canal `{colors.linea}`, relleno con la *marca* del estado, y crecimiento por
`transform: scaleX()` desde el origen izquierdo.

Los iconos son un juego dibujado a mano en `src/components/Iconos.tsx`: caja de 24, trazo
1.6, remates y uniones redondeados, `fill: none`, `stroke: currentColor`, tamaño de uso
14–20px. No hay emojis ni librería de iconos.

## Components

### Buttons

Carácter: piezas compactas. Cambian de color, no de altura.

- **Forma:** radio de 6px (`{rounded.pieza}`), altura mínima 44px, 52px en la variante
  `grande` (que además sube a `guia`). Peso 500, icono opcional a la izquierda con 8px de
  separación.
- **principal:** fondo `{colors.accion}`, texto blanco, filo de 1px. Es el único botón
  sólido y hay **uno por pantalla**: "Registrar pago", "Guardar pago", "Agregar persona",
  el confirmar de un diálogo.
- **contorno:** fondo `{colors.hoja}` con borde `{colors.linea-fuerte}`; al hover el
  borde sube a `{colors.tinta-3}` y el fondo a `{colors.hoja-2}`. La acción secundaria de
  igual peso ("Agregar persona" junto a "Registrar pago" en Inicio, "Cambiar cupo o
  precio", los montos rápidos del cobro).
- **suave:** fondo `rgba(99,91,255,0.09)` (0.12 al hover), texto de acción, sin borde.
  Para un atajo sugerido ("Saldar: RD$ 1,200").
- **texto:** sin fondo ni borde, texto `{colors.tinta-2}`, hover con un lavado neutro
  `rgba(24,24,27,0.05)`. Para salidas, cancelaciones y las acciones de cabecera de la
  ficha ("Editar", "Archivar", "Cambiar", "Limpiar").
- **Estados:** hover cambia fondo o borde en 150ms con la curva `salida`; `active` escala
  a 0.98; deshabilitado baja a 45% de opacidad y desactiva el puntero; en carga, el icono
  se sustituye por un anillo giratorio de 17px y el botón se deshabilita solo.

### Chips

Solo queda **una** familia de chip, y eso es una decisión, no una omisión: los chips de
filtro y los "filtros puestos" se eliminaron con el panel de filtros.

- **ChipEstado** (informativo, el único chip del sistema): cápsula con el par fondo/tinta
  del estado, punto de 7px con la *marca*, `text-menuda` peso 500, `px-3 py-1`, `gap-2`.
  **Siempre** lleva el texto del estado. No es pulsable, no cambia de tamaño, y su orden
  de aparición es siempre Pagado → Abonando → Sin pagos.
- La etiqueta "Anulado" del historial es la única cápsula que no es un ChipEstado: usa el
  par `sinpagos` a `text-menuda` peso 500 y describe el pago, no el estado de la persona.

### Cards / Containers

No hay tarjetas decorativas: hay **hojas**. Radio de 8px, fondo `{colors.hoja}`, borde de
1px `{colors.linea}` y un filo de sombra. El padding va según la densidad (16px en
métricas y listas de Inicio, 20px en cuenta y listas densas, 28px en los documentos
imprimibles); las hojas con lista usan `overflow-hidden` y llevan el padding a cada
renglón. La cabecera de una hoja con lista es una franja separada por hairline, con el
título en `menuda` peso 600 y, a la derecha, un enlace en `menuda` con el icono de avance.

**Metrica** es la hoja más pequeña del sistema y el bloque que define Inicio: `.hoja p-4`
con rótulo (`menuda` peso 500, tinta segunda), cifra (`cifra`, peso 600, interlineado 1) y
línea de apoyo (`menuda`, tinta tercera, con `truncate`). La variante destacada sube la
cifra a `cifraGrande`, la pinta en `{colors.accion}` y viste la hoja con el registro
lavado: fondo `{colors.accion-suave}` y borde `{colors.accion-borde}`. **Hay exactamente
una destacada por fila**: si todas destacan, ninguna destaca.

### Inputs / Fields

Carácter: la línea donde se escribe, no una caja hundida.

- **Estilo:** altura mínima 46px, radio 6px, fondo `{colors.hoja}` (o `{colors.hoja-2}`
  cuando es un buscador dentro de una hoja o el campo de monto), borde de 1px
  `{colors.linea-fuerte}`, placeholder en `{colors.tinta-3}`. Etiqueta encima en `menuda`,
  peso 500, `{colors.tinta-2}`.
- **Hover:** el borde sube a `{colors.tinta-3}`.
- **Foco:** borde `{colors.accion}` más un anillo de 2px `rgba(99,91,255,0.18)`. El
  `:focus-visible` global es un contorno de 2px del color de acción con 2px de separación
  y radio 4px, y nunca se anula.
- **Error:** borde `{colors.accion}`, `aria-invalid`, y bajo el campo un mensaje en
  `menuda` del color de acción precedido del icono de aviso de 15px. El mensaje dice qué
  hacer ("Escribe cuánto está abonando, por ejemplo 1,000"), nunca qué falló.
- **Ayuda:** en `menuda` `{colors.tinta-2}` bajo el campo; se sustituye por el error
  cuando lo hay.
- **Campo de monto:** el único input en `cifraGrande`, sobre `{colors.hoja-2}`, con el
  "RD$" fijo a la izquierda y el texto sangrado 4.2rem.
- **Buscador de la barra de herramientas:** 44px de alto, `guia`, icono de 20px a la
  izquierda con sangría de 44px, borde `{colors.linea}` (no el fuerte: es cromo) y el
  mismo foco de acción. Es lo único que está siempre a la vista en Personas, porque buscar
  es lo que ella hace veinte veces al día.
- **Campo de fecha:** nunca muestra el formato del navegador. En reposo es un botón de
  46px que dice la fecha escrita en español ("Hoy, 16 de agosto de 2026") con un "Cambiar"
  a la derecha; el `input[type=date]` real solo aparece al tocarlo.
- **Sin flechitas:** los spinners nativos de `input[type=number]` están anulados; los
  montos se escriben.

### Navigation

La lateral: fondo `{colors.lomo}`, 236px, alto completo, `sticky`, separada del cuerpo por
`border-r border-linea` y marcada `.no-imprimir`. Arriba, "Tesorera" a 1.0625rem peso 600
con tracking −0.012em en tinta principal y, debajo, en `menuda` tinta tercera, el nombre
del evento y la cuenta regresiva.

Cada entrada es una fila de 44px con radio de 6px, icono de 18px y texto `menuda`. En
reposo va en peso 500 y `{colors.tinta-2}`; en hover, fondo `rgba(24,24,27,0.045)` y texto
en tinta principal; activa, el **registro lavado del acento**: fondo
`{colors.accion-suave}`, anillo de 1px `{colors.accion-borde}` y texto
`{colors.accion}` en peso 600. **No hay marca lateral de pestaña**: la pastilla azul
clara con texto de acento es la señal completa. Al pie, en `menuda` tinta tercera, la
nota permanente "Se respalda sola al abrir".

### Dialogs

`<dialog>` nativo: se encarga solo del foco, del `Escape` y de la capa superior. Ancho por
defecto 460px (480–520px en formularios), alto máximo 86vh, radio 8px, fondo
`{colors.hoja}`, sombra `dialogo`. Cabecera con título en `guia` peso 600 y un botón de
cerrar de 44px; **el cuerpo hace scroll y el pie se queda quieto**, para que el botón de
guardar no se vaya de la pantalla cuando el formulario crece. Pie opcional con fondo
`{colors.hoja-2}` y hairline superior.

`Confirmacion` es la única forma de pedir permiso: el botón de salida dice "No, dejarlo
así" y el de confirmar dice exactamente lo que va a pasar ("Sí, anular este pago"), nunca
"Aceptar".

**`DialogoPersona`** es el formulario compartido de agregar persona, y vive fuera de las
pantallas porque se abre desde dos sitios: la lista de Personas y el buscador del cobro
cuando llega alguien que todavía no está inscrito. Arrastra el nombre ya escrito en el
buscador, avisa de un posible repetido *mientras* se escribe (no después de guardar,
cuando el duplicado ya existe), y esconde teléfono y notas en un `<details>` de 44px.

### FiltroMenu (componente insignia)

El control de filtro de la barra de herramientas. Un botón compacto de 44px (radio 6px,
`menuda`, máximo 280px, `truncate`) que abre un menú con la API nativa `popover`: capa
superior, `Escape` y cierre al tocar afuera sin escribir una línea de JavaScript para
ello. El panel se posiciona a mano bajo el botón y se pega al borde derecho de la ventana
si no cabe.

Las decisiones que hay que respetar al tocarlo:

- **El filtro activo se dice dentro del botón**, en la forma "Iglesia: Getsemaní", con la
  etiqueta a opacidad reducida y el valor en peso 500. Un filtro que no se ve puesto es
  una lista que "perdió" gente.
- **La × vive dentro del botón**, como control redondo de 28px con
  `aria-label="Quitar el filtro …"`. Quitar un filtro es un gesto distinto de abrirlo, y
  por eso es un blanco distinto. Cuando no hay filtro puesto, ese sitio lo ocupa la flecha
  de desplegar.
- **Los conteos viven dentro del menú**, a la derecha de cada opción, en `menuda` tinta
  tercera y tabulares. En el botón serían ruido; en el menú son lo que ayuda a elegir.
- **El buscador aparece solo por encima de 8 opciones** (`umbralBusqueda`), como franja de
  44px sobre la lista, y enfoca solo al abrir. `Enter` elige el primer resultado.
- **`permiteTodas={false}` para el orden.** El orden siempre tiene un valor, así que no
  lleva "Todas", no se puede quitar y **no se pinta como filtro activo**: un control
  permanentemente encendido enseña a ignorar el color de activo.

### Selector (componente insignia)

Elegir una opción dentro de un formulario. Es **siempre** un campo de una línea de 46px
que abre el mismo menú de popover; se reescribió por completo desde la versión adaptativa
(rejilla de botones por debajo de un umbral, campo por encima). El motivo está en su
docblock y es medible: tres iglesias más cuatro tipos de cupo se comían 500px de diálogo,
y empeoraba con cada iglesia nueva. Hoy el formulario mide lo mismo con tres opciones que
con cincuenta y se lee de arriba abajo como cualquier formulario. Abre hacia arriba si
abajo no cabe, y lleva la etiqueta, ayuda y error del sistema de campos.

**La regla del detalle que confirma y el detalle que elige.** Un dato secundario de una
opción se coloca según para qué sirve, no según el sitio que sobre:

- Un **detalle numérico** (el precio del cupo) se repite en **los dos** sitios: en el
  campo cerrado y a la derecha en el menú. En el campo confirma lo que se va a pagar; en
  el menú se compara en columna, alineado y tabular.
- Un **detalle de texto** (el pastor de la iglesia) vive **solo en el menú**, en una
  segunda línea bajo el nombre. Ayuda a *elegir* entre dos iglesias parecidas —que es
  justo cuando uno se equivoca—, pero no hace falta para confirmar, y en la misma línea
  truncaba el nombre de la iglesia, que es lo que ella lee.

La opción elegida se marca por partida triple: fondo de acción al 8%, peso 500 y el icono
de cheque — color, peso y forma, nunca color solo.

### La barra de progreso (componente insignia)

Es el instrumento de la app y su único momento con autoría. Canal en `{colors.linea}`,
relleno con la *marca* del estado, animado con `transform: scaleX(proporción)` desde
`origin-left` en **420ms** con la curva `salida`. Nunca se anima `width`.

Al guardar un pago, el recibo monta la barra con el valor **anterior** y en el siguiente
frame la sube al nuevo: la usuaria ve entrar su abono. Es la única animación de la app que
dura más de 250ms, y es deliberada.

Hay **dos** reglas de color de relleno y no se mezclan:

- **Barra de una persona** (el componente `BarraProgreso`, en la ficha y en el recibo
  del cobro): el color sale **siempre** de `calcularEstado(pagado, precio)` — verde
  cuando cerró, ámbar mientras abona, gris cuando no hay nada. Es un diagnóstico.
- **Barra agregada** (la de 8px de Inicio y la de 4px de cada renglón de "Por
  iglesia"): se rellena con **el acento** mientras falte algo y pasa a
  `{colors.pagado-marca}` solo al llegar al total. No es el estado de nadie, es el
  avance de una meta, y pintarlo de ámbar sugería que la convención entera "va
  atrasada". Las dos están escritas a mano para poder fijar su alto, pero respetan el
  mismo canal, el mismo `scaleX` de 420ms y el mismo origen izquierdo.

### Nota y Aviso

Dos niveles distintos, y la diferencia importa porque la app avisa mucho:

- **`Nota`** (el patrón por defecto): **es un patrón, no un componente** — se escribe en la
  propia pantalla, sin caja y sin color de fondo: `IconoAviso` de 15px en tinta tercera +
  texto en `menuda` tinta segunda, en un `<p>` con `flex items-start gap-1.5`. Para lo que
  informa y no alarma. Su instancia viva es la nota al pie de la hoja de progreso de Inicio
  ("Incluye RD$ … de pagos de más, por eso lo recaudado y lo que falta no suman justo la
  meta"). Ahí una caja de color competiría con las métricas, que son lo que manda.
- **`Aviso`** (`src/components/Piezas.tsx`): caja de color, radio 6px, `menuda`, icono de
  16px. Tono `neutro` en verde azulado apagado y tono `ojo` en ámbar. Se reserva para lo
  que sí interrumpe o corrige la lectura de la cuenta: persona archivada (`ojo`), posible
  nombre repetido mientras se escribe, evento sin tipos de cupo, los avisos de Ajustes al
  cambiar precios en masa, y en la ficha de persona el excedente pagado de más y el precio
  puesto a mano (`neutro`).

Si dudas cuál usar: si la usuaria puede seguir trabajando sin leerlo, es `Nota`. El mismo
hecho puede pedir los dos niveles según dónde aparezca — el excedente es `Nota` al pie del
total de Inicio y `Aviso` dentro de la cuenta de una persona, porque ahí sí explica un
número que no cuadra.

### Estado vacío

Nunca dice "no hay nada": dice qué hacer. Un dibujo de 64×48 de una lista vacía —marco
redondeado en `{colors.linea}` sobre `{colors.hoja-2}` con tres renglones escritos, el
último más corto—, título en `guia` peso 600, una explicación de máximo 38 caracteres de
ancho en `{colors.tinta-2}`, y un botón que ejecuta el siguiente paso. El dibujo ya no
lleva raya de margen roja: el ornamento de época se retiró de la app y también de su
ilustración. Los vacíos con filtros puestos ofrecen dos salidas concretas: "Agregar a '…'"
con el nombre que se buscó, y "Quitar filtros".

### Motion

- **Duración ordinaria:** 140ms para el menú de popover; 150ms para cambios de color y
  estado; 180ms para el diálogo; 260ms para la entrada de un renglón; 300ms para la entrada
  de una hoja; **420ms solo para la barra de progreso**.
- **Curvas:** tres, y solo tres, declaradas como variables — `--salida`
  (`cubic-bezier(0.23,1,0.32,1)`, la de casi todo), `--entrasale`
  (`cubic-bezier(0.77,0,0.175,1)`) y `--gaveta` (`cubic-bezier(0.32,0.72,0,1)`). Nada de
  `ease`, `linear` ni curvas de fábrica en animaciones nuevas.
- **Entradas:** las listas usan `.entra-renglon` (opacidad + 5px de subida, con retardo
  escalonado de 26ms por índice vía `--i`, tope de 10–12 elementos); las pantallas usan
  `.entra-hoja` (opacidad + 7px). Nada nace desde cero: siempre desde un estado casi
  visible.
- **Diálogo:** escala de 0.97 a 1 con 6px de subida, con `@starting-style` y
  `allow-discrete` sobre `overlay`/`display`; el backdrop hace fundido aparte.
- **Menú (`.menu-filtro`):** opacidad + 4px de bajada en 140ms, con `@starting-style` y
  `allow-discrete`. Más corto que el diálogo a propósito: un menú es un control, no una
  interrupción.
- **Movimiento reducido:** con `prefers-reduced-motion`, las entradas conservan la opacidad
  y pierden el desplazamiento, y todo lo demás cae a 0.01ms.
- **Prohibido:** rebote, elástico, parallax, y animar `width`, `height` o `top/left`.

### Toasts

Sonner abajo a la derecha con 20px de separación, vestido con los tokens del sistema: fondo
`{colors.hoja}`, borde `{colors.linea-fuerte}`, Inter a 0.9375rem. El título lleva el
monto y el nombre; la descripción dice qué queda ("Le faltan RD$ 800", "Quedó pagado
completo"). El toast del pago guardado dura 8s y trae "Deshacer": la corrección más rápida
posible antes de tener que ir a la ficha a anular.

## Do's and Don'ts

### Do:

- **Do** construir toda lista como renglones (`.renglon`) dentro de una sola `.hoja`,
  separados por el hairline de `{colors.linea}` y por aire.
- **Do** definir cualquier superficie nueva con una raya de 1px, no con una sombra.
- **Do** poner toda cifra sobre una hoja, con su rótulo encima y su línea de apoyo debajo;
  sobre el lienzo solo van el `h1` con su bajada y el enlace de volver.
- **Do** dejar exactamente una métrica destacada por fila, y destacarla con el registro
  lavado del acento (fondo `{colors.accion-suave}` + borde `{colors.accion-borde}` +
  cifra en `{colors.accion}`), no agrandando todas.
- **Do** mantener la lateral del tono del lienzo, separada por una raya, con el acento
  reservado a la entrada activa y en su registro lavado.
- **Do** usar el componente `Monto` para cualquier cantidad de dinero, y `.cifra` para
  cualquier número comparable.
- **Do** derivar de `calcularEstado(pagado, precio)` el color de toda barra **de una
  persona**, y pintar con el acento (verde solo al llegar al total) toda barra
  **agregada**.
- **Do** dejar exactamente un botón sólido `principal` por pantalla, y que su texto diga la
  acción concreta ("Guardar pago", no "Aceptar").
- **Do** acompañar todo color de estado con su texto y su `aria-valuetext`.
- **Do** resolver cualquier lista larga de opciones con `Selector` o `FiltroMenu`, para que
  el control mida lo mismo con tres opciones que con cincuenta.
- **Do** colocar un detalle numérico en el campo *y* en el menú (confirma y se compara), y
  un detalle de texto solo en el menú, en segunda línea (ayuda a elegir).
- **Do** dejar que `<dialog>` y `popover` hagan el foco, el `Escape` y el cierre al tocar
  afuera; el sistema no reimplementa modales.
- **Do** caer columnas por prioridad al angostar (Iglesia desde `xl`, "Su cupo" desde `md`),
  nunca todas a la vez.
- **Do** mantener 44px de alto mínimo en todo lo que se toca y el `:focus-visible` de 2px
  del color de acción visible siempre.
- **Do** verificar cualquier color de texto nuevo contra AA sobre `{colors.hoja}`,
  `{colors.hoja-2}` **y** `{colors.fondo}`, no solo sobre el fondo más claro.
- **Do** escribir cada estado vacío como una instrucción con su botón.
- **Do** guardar en `src/lib/preferencias.ts` (localStorage) lo que solo es comodidad —la
  última iglesia y el último tipo de cupo elegidos, que ahorran dos toques por persona al
  inscribir a media iglesia de un tirón— y solo eso: si se pierde, no pasa nada.
- **Do** dibujar cualquier icono nuevo en la caja de 24 con trazo 1.6 y remates redondos,
  dentro de `src/components/Iconos.tsx`.
- **Do** marcar con `.no-imprimir` todo lo que no debe salir en papel, y usar
  `{colors.papel-impreso}` / `{colors.linea-impresa}` para lo que sí sale.
- **Do** animar posición y tamaño con `transform` y `opacity`, con una de las tres curvas
  del sistema.

### Don't:

- **Don't** poner una clase de `display` de Tailwind (`flex`, `grid`, `block`) en un
  `<dialog>`. Esa regla de autor le gana al `dialog:not([open]) { display: none }` del
  navegador y **todo diálogo cerrado se queda ocupando su altura en la página**, invisible
  pero clicable (llegó a inflar la página a 3998px para 3239px de contenido). El
  `display: flex` se declara **solo** en `dialog.dialogo[open]` dentro de
  `src/estilos.css`; en el JSX van `flex-col` y las demás utilidades, nunca `flex`.
- **Don't** anidar una `.hoja` dentro de otra, ni convertir un renglón en tarjeta con
  sombra o borde propio.
- **Don't** devolver el ornamento de época: ni papel crema, ni lomo de tela, ni trama
  alterna en los renglones de pantalla, ni raya de margen roja, ni versalitas espaciadas.
  Se retiró a propósito y el encargo del usuario es explícito y repetido: **moderno, no
  "hecho para viejitos"**.
- **Don't** devolver un bloque de color saturado a la izquierda. La lateral clara con una
  raya es la decisión; el panel de color lleno es lo que hacía ver vieja la pantalla.
- **Don't** apagar ni desaturar los tres colores de estado para que “combinen” con los
  neutros: un verde y un ámbar lavados se leen a documento viejo, que es el defecto que
  esta app lleva tres intentos corrigiendo.
- **Don't** agrandar una cifra por encima de `cifraEnorme` (38px) para darle importancia:
  ya se probó a 56px y se retiró por desproporcionada. La jerarquía la dan el rótulo, el
  acento y el peso.
- **Don't** publicar un número sin su rótulo y su línea de apoyo: una métrica sin contexto
  obliga a buscar el contexto en otro lado.
- **Don't** volver a una rejilla de píldoras o de botones para elegir entre datos que crecen
  (iglesias, tipos de cupo, pastores): no escala y se come la pantalla.
- **Don't** poner el conteo de resultados en la cara de un botón de filtro, ni pintar como
  filtro activo un control que siempre tiene valor (el orden).
- **Don't** ponerle velo (`::backdrop` opaco) a un menú: el velo es del diálogo.
- **Don't** usar rojo para un estado de pago ni para una persona que debe. El único rojo de
  la app es el vino de acción, y pertenece a los botones.
- **Don't** dar a una iglesia (ni a ninguna identidad) un color verde o ámbar: esos dos
  tonos ya están comprometidos con "Pagado" y "Abonando".
- **Don't** introducir un segundo color de acento, un degradado, ni un color fuera de las
  variables de `src/estilos.css` (con la única excepción declarada de la paleta de iglesias
  en `Piezas.tsx`).
- **Don't** bajar un texto por debajo de `micro`, ni usar `micro` para algo que no se pueda
  leer en otro lado de la misma pantalla.
- **Don't** cambiar el tamaño de letra por ancho de pantalla ni introducir `clamp`: la
  escala es fija por decisión, para un solo dispositivo.
- **Don't** usar emojis, glifos de texto (`›`, `×`, `✓`) ni una librería de iconos como
  reemplazo del juego dibujado a mano.
- **Don't** escribir una cifra sin cifras tabulares, ni un monto sin el "RD$" del componente
  `Monto`, ni redefinir a mano la proporción del símbolo.
- **Don't** guardar en localStorage nada que sea un dato del negocio: los pagos, las
  personas y las inscripciones viven en SQLite y solo ahí.
- **Don't** animar `width` en una barra de progreso, ni pasar de 250ms en nada que no sea
  esa barra al guardar un pago.
- **Don't** usar rebote, elástico o parallax, ni ignorar `prefers-reduced-motion`.
- **Don't** poner una palabra en inglés ni jerga técnica en ninguna superficie visible,
  incluidos los mensajes de error.
- **Don't** agregar una quinta entrada a la lateral: una pantalla nueva se cuelga de una de
  las cuatro.
- **Don't** confirmar una acción seria con "Aceptar"/"Cancelar": el botón dice lo que va a
  pasar y la salida dice "No, dejarlo así".
