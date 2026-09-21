---
name: Tesorera
description: Espacio de trabajo moderno, minimalista y redondeado para llevar pagos con claridad.
colors:
  fondo: "#f6f7f9"
  hoja: "#ffffff"
  hoja-2: "#f8f9fb"
  tinta: "#222738"
  tinta-2: "#545d70"
  tinta-3: "#626b7d"
  linea: "#e8ebf1"
  linea-fuerte: "#c8ceda"
  lomo: "#ffffff"
  lomo-texto: "#545d70"
  lomo-activo: "#efedfa"
  accion: "#5546ae"
  accion-texto: "#5041a5"
  accion-alto: "#44358f"
  accion-suave: "#f0edfb"
  accion-borde: "#c9c1ec"
  pagado-fondo: "#d8f3e5"
  pagado-tinta: "#125b3d"
  pagado-marca: "#168458"
  abonando-fondo: "#ffebba"
  abonando-tinta: "#754500"
  abonando-marca: "#b77709"
  sinpagos-fondo: "#e6eaf0"
  sinpagos-tinta: "#465269"
  sinpagos-marca: "#738198"
  aviso-fondo: "#f0edfb"
  aviso-tinta: "#5041a5"
  papel-impreso: "#ffffff"
  linea-impresa: "#c8ceda"
typography:
  base:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: "1.55"
    letterSpacing: "-0.009em"
  menuda:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: "1.35rem"
    letterSpacing: "-0.006em"
  micro:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "0.75rem"
    lineHeight: "1rem"
    letterSpacing: "0.01em"
  guia:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: "1.45"
    letterSpacing: "-0.012em"
  titulo:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.875rem"
    lineHeight: "1.28"
    letterSpacing: "-0.021em"
  pagina:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 750
    lineHeight: "1.2"
    letterSpacing: "-1px"
  cifra:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: "1.15"
    letterSpacing: "-0.022em"
  cifraGrande:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: "-0.026em"
  cifraEnorme:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "-0.03em"
rounded:
  pieza: "11px"
  hoja: "20px"
  navegacion: "13px"
  redondo: "9999px"
spacing:
  control: "8px"
  fila: "12px"
  pieza: "16px"
  hoja: "20px"
  panel: "22px"
  pagina: "32px"
components:
  boton-principal:
    backgroundColor: "{colors.accion}"
    textColor: "{colors.hoja}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
  boton-principal-hover:
    backgroundColor: "{colors.accion-alto}"
    textColor: "{colors.hoja}"
  boton-contorno:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
  boton-suave:
    backgroundColor: "{colors.accion-suave}"
    textColor: "{colors.accion-texto}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
  boton-texto:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    rounded: "{rounded.pieza}"
    padding: "0 16px"
  campo:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pieza}"
    padding: "8px 12px"
  hoja:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hoja}"
  navegacion-activa:
    backgroundColor: "{colors.accion-suave}"
    textColor: "{colors.accion-texto}"
    rounded: "{rounded.navegacion}"
    padding: "10px 14px"
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
---
# Design System: Tesorera

## Overview

**Creative North Star: "Una libreta de tesorería moderna"**

Una libreta de tesorería moderna expresada como una herramienta clara: superficies blancas, fondo gris suave, esquinas redondeadas y morado contenido. Los nombres, montos y estados ordenan la lectura. La interfaz conserva el contexto al trabajar con una persona y permite continuar con el siguiente cobro.

Esta descripción recoge la interfaz construida. Las fuentes normativas son `src/estilos.css`, `tailwind.config.ts` y los componentes compartidos; las decisiones de producto permanecen en `PRODUCT.md`.

**Key Characteristics:**

- Manrope local, texto base de 17px y cifras tabulares.
- Superficies redondeadas con bordes finos y sombra discreta.
- Personas conserva la lista y abre la cuenta en el diálogo compartido, lateral de hasta 560px o centrado de hasta 640px según la preferencia guardada.
- Morado para acciones; verde, ámbar y gris para estados acompañados de texto.
- Movimiento breve, sin entradas escalonadas de filas.

## Colors

El morado de acción usa `accion` para botones y `accion-texto` para texto; `accion-alto` es el hover sólido. `accion-suave` identifica selección, acciones suaves y avisos, con `accion-borde` cuando corresponde.

Los estados usan fondos más presentes y tinta oscura, compartidos por toda la aplicación. Conservan su tríada de fondo, tinta y marca: Pagado es verde, Abonando ámbar y Sin pagos gris. Ningún color sustituye el nombre del estado. El aviso informativo utiliza morado suave; una situación que requiere atención puede usar el ámbar existente.

`fondo` es el lienzo; `hoja` la superficie blanca y `hoja-2` las zonas secundarias. `tinta`, `tinta-2` y `tinta-3` distinguen texto principal, apoyo y metadatos. `linea` separa filas y superficies; `linea-fuerte` delimita campos. La navegación permanece blanca.

Los colores de identidad de iglesias se definen en `Piezas.tsx` (morado, rosa, turquesa, pizarra, ciruela y grafito); no sustituyen los estados de pago. Los tokens de impresión reservan fondo blanco y contorno legible en papel.

## Typography

Manrope Variable se incluye localmente mediante `@fontsource-variable/manrope`; los fallbacks son los del sistema. La raíz mide 16px y el cuerpo 17px. La escala de Tailwind conserva `menuda` de 15px y `micro` de 12px; los metadatos de componentes emplean también tamaños entre 11 y 16px. No convertir esos tamaños auxiliares en el texto base.

Los títulos de página usan 32px y peso 750; a 760px o menos pasan a 29px. La cuenta usa el encabezado compartido de `Dialogo`, con avatar de iniciales, nombre real de 20px e iglesia de 13px, separados por 1px con la descripción dispuesta en flex; hasta 600px el nombre pasa a 19px. Su resumen mantiene tres cifras equivalentes de 17px con peso 600, y el historial usa fecha de 15px y peso 500, forma de pago de 13px e importe de 15px y peso 600, con RD$ de 12px; fecha e importe igualan la escala de los valores de Datos. Los montos compartidos tienen escalones de 22, 28 y 34px. `Monto` controla RD$ y la proporción del símbolo: 0.5em, 0.46em y 0.42em en esos tres escalones. La clase `cifra` exige números tabulares y alineados, y aplica espaciado de -0.02em.

## Layout

La navegación tiene seis secciones: Inicio, Personas, Iglesias, Habitaciones, Cupos y Reportes; Ajustes queda separado al pie. El pie no muestra una nota sobre respaldos. La lateral mide 230px, permanece fija dentro del desplazamiento mediante sticky y ocupa el alto de la ventana. El contenido tiene ancho máximo de 1440px y relleno de 38px 32px 48px.

En Personas, la búsqueda tiene su propio contorno y los filtros se colocan debajo, fuera de ese campo. `PanelPersona` abre `Dialogo` nativo sobre la lista conservada: lateral de hasta 560px por defecto, como Personas archivadas, o centrado de hasta 640px mediante el icono de posición en su encabezado, con nombre accesible y ayuda Centrar / Al lateral. El control tiene alto mínimo de 44px; la preferencia se guarda en `tesorera.posicionDetalle` y sigue funcionando durante la sesión si falla el almacenamiento. Cambiar de posición conserva el componente y el abono en curso. El encabezado fijo agrupa avatar, nombre e iglesia; tres cifras y operaciones se apilan en el cuerpo desplazable. Estado de pago y tipo de cupo aparecen en Datos, como propiedades. Total del cupo, Ha pagado y Pendiente conservan tres columnas también en móvil, donde RD$ queda encima del valor. La cuenta no añade un monto protagonista repetido ni una barra de progreso. La lista mantiene sus columnas de identidad, pagado, pendiente, estado y acción cuando hay espacio; iglesia y habitación comparten la línea de contexto y se acomodan al ancho disponible.

| Ancho de ventana | Comportamiento construido |
|---|---|
| Desde 1600px | Relleno de contenido 44px 48px. |
| 1101–1440px | Lateral de 216px; contenido 28px; columnas de la lista ajustadas a la laptop. |
| Hasta 1100px | Inicio e Iglesias pasan a una columna; el estado de la lista se integra en la identidad. |
| Hasta 760px | Navegación superior con enlaces que se acomodan en varias líneas; Ajustes arriba a la derecha. Contenido con relleno 26px 16px 36px; filas de personas en dos columnas. |
| Hasta 600px | Editor de cupo en una columna; cifras de tarjetas en filas verticales de etiqueta y valor de 18px; acciones adaptadas al ancho. |

El diálogo lateral mantiene márgenes de 16px y alto de ventana menos 32px; la cuenta centrada mide `min(740px, 100dvh - 64px)` de alto. Hasta 600px ambas posiciones usan márgenes de 16px y alto de `100dvh - 32px`, y se oculta el control de posición. El cuerpo desplaza y el historial participa en ese mismo desplazamiento; las acciones de Pagos y Datos permanecen en el pie fijo. Las tarjetas de Iglesias forman dos columnas antes del corte de 1100px. Cupos usa una tabla de filas con cuadrícula y encabezados, siguiendo el ritmo de Personas, con acciones explícitas Editar y Archivar. Agregar tipo de cupo es la acción principal exterior en el encabezado de página. Su editor conserva el ancho máximo de 820px, con precio a la izquierda y alojamiento y privacidad a la derecha. Inicio reúne balance, estados, pagos recientes y resumen por iglesia.

Habitaciones usa dos columnas de tarjetas de altura uniforme mediante `grid-auto-rows: 1fr` y un editor de dos columnas; ambos pasan a una columna hasta 1100px. Las dos tarjetas de la muestra revisada a 1366px miden 340px de alto; es evidencia de la muestra, no un alto fijo del componente. Su resumen de cuatro cifras pasa a dos columnas hasta 760px. Reportes coloca iglesia, dos fechas y acción en una fila de filtros; hasta 760px todos se apilan en una única columna con campos ajustados al ancho disponible. Sus tres cifras y gráficos también se apilan en móvil. Las tablas pueden desplazar horizontalmente dentro de su contenedor; la impresión elimina ese desbordamiento, repite encabezados y evita cortar filas.

## Elevation & Depth

Los bordes y la diferencia de tono sostienen la estructura. Las hojas añaden una sombra muy discreta (`0 3px 12px -8px rgb(34 39 56 / 0.12)`). El diálogo utiliza la sombra `dialogo` de Tailwind, más profunda, y un velo; el menú desplegable mantiene su fondo exterior transparente. Los valores completos de sombras y movimiento están en `.impeccable/design.json`.

## Shapes

Las superficies principales usan radio `hoja` y los botones y campos radio `pieza`. La navegación usa 13px; avatares, notas y controles secundarios varían entre 8 y 16px según su tamaño. Los estados y las barras son redondos; dentro de Datos, el estado conserva la píldora de Personas con radio de 999px. La cuenta conserva la forma del diálogo compartido también en móvil. No convertir cada fila en una tarjeta: la separación normal es una línea fina dentro de una superficie común.

## Components

**Botones.** `Boton` ofrece principal, contorno, suave y texto. Alto mínimo de 44px; variante grande de 52px. La pulsación escala a 0.98, con transición de 150ms; los botones deshabilitados reducen opacidad y bloquean interacción. Los botones de icono miden 44px. La acción de cada fila dice Cobrar o Ver cuenta según la situación. Las acciones de Iglesias, Habitaciones y Cupos usan `accion-tarjeta`, con la escala de las acciones de Personas: alto mínimo de 44px, texto de 14px, peso 650 y radio de 11px. En tarjetas se alinean a la izquierda con separación de 8px; Ver usa contorno, Editar morado suave y Archivar o Devolver ámbar suave.

**Campos.** `Campo` usa alto mínimo de 46px, borde fuerte y etiqueta visible. El foco cambia al acento y muestra anillo de 2px; los problemas llevan texto y `aria-invalid`. Todos los importes editables usan `CampoDinero`: RD$ visible, coma de miles y punto decimal, por ejemplo 1,500.50. El formato conserva el cursor al escribir o borrar y permite pegar importes válidos. El monto de la cuenta lateral mide al menos 58px de alto y usa 26px. Fecha, forma de pago y nota quedan detrás de un desplegable de detalles.

**Lista y cuenta.** Búsqueda, filtros y selección se reflejan en la URL. La navegación separa Pagos, con contador de pagos válidos de 12px, y Datos; ambas usan texto de 14px y una línea inferior de 2px para señalar la selección. Registrar pago se sitúa en el pie junto a Editar y Eliminar. Cobrar abre el formulario y enfoca el monto. Mientras se cobra, el pie se oculta y Guardar pago es el único botón principal. Al guardar se muestra Pago guardado en la misma cuenta, con saldo actualizado, comprobante, Cobrar a otra persona y Registrar otro abono aquí. Crear usa un diálogo sobre la misma lista; después de crear se abre la cuenta sin limpiar filtros. Cobrar, consultar el historial, editar y eliminar pagos mantienen el contexto modal de la cuenta. Cerrar el panel devuelve el foco al disparador disponible o a la búsqueda.

**Historial y datos de la cuenta.** Cada pago muestra fecha, forma de pago, importe y, cuando existe, nota. El botón de puntos suspensivos conserva un objetivo de 44px y abre un menú nativo con Ver comprobante, Editar pago y Eliminar pago. Eliminar requiere confirmación con el saldo resultante y respaldo previo; también está disponible para pagos anulados antiguos. En móvil se oculta el icono decorativo del pago y se mantienen fecha e importe legibles. Datos usa una lista semántica de propiedades con etiqueta a la izquierda y valor a la derecha, inspirada en Notion, sin tarjetas ni grandes encabezados. La columna de etiquetas mide 132px (100px hasta 600px), con texto de 14px (13px en móvil); los valores usan 15px por petición explícita para esta lista, conservando el texto base general de 17px y los objetivos editables de al menos 44px. Estado de pago abre la lista con el chip compartido de 13px y radio de 999px, conservando sus colores semánticos; siguen Iglesia y Teléfono. Una línea fina separa Tipo de cupo, Precio del cupo, Extra privado cuando corresponde y Habitación si incluye alojamiento; otra precede Notas. Los valores editables muestran un lápiz y abren su editor; Iglesia, Teléfono y Notas enfocan directamente el campo elegido. Registrar pago, Editar y Eliminar comparten el pie fijo de Pagos y Datos: acción de pago principal, editar en morado suave y eliminar en rojo sobrio, con alto mínimo de 44px. En móvil Registrar pago ocupa una fila completa sobre las otras dos acciones. El pie se oculta al registrar un abono para dejar Guardar pago como acción principal. Eliminar requiere una revisión con cantidad de pagos, importe y reparto de habitaciones, más confirmación explícita. Devolver una persona archivada anteriormente sigue disponible en el aviso de su cuenta.

El nombre real permanece en el encabezado fijo del diálogo mientras el cuerpo desplaza; no se duplica la identidad sobre el formulario en móvil. Cerrar vuelve a la lista subyacente con búsqueda y filtros conservados.

**Personas archivadas.** Se consultan en un diálogo lateral nativo de hasta 560px, con márgenes de 16px y alto de ventana menos esos márgenes. Su búsqueda por nombre o iglesia es independiente de los filtros de la lista principal e incluye todas las archivadas. Ver cuenta cierra ese diálogo y abre la cuenta; el aviso de persona archivada ofrece Devolver a la lista de forma inmediata, con confirmación.

**Iglesias.** `ResumenCifras` presenta recaudado, por cobrar y total en tres columnas del mismo nivel, con valores discretos de 18px; hasta 600px pasan a filas de etiqueta y valor sin reducir los importes. Cantidades por estado y excedente se explican aparte. Ver, Editar y Archivar o Devolver se alinean a la izquierda y usan las acciones compartidas. Los segmentos Participantes y Archivadas mantienen ambas listas accesibles. `api.iglesias` centraliza el orden natural de nombres con `ordenarPorNombre` de `src/lib/orden.ts` y `Intl.Collator('es-DO', { numeric: true, sensitivity: 'base' })`; los selectores conservan ese orden.

**Habitaciones.** Las tarjetas comparten la superficie `hoja`, con relleno de 22px 24px (20px hasta 600px), título de 18px y peso 750. La ocupación combina texto con segmentos de 7px de alto: morado ocupado, línea neutra libre. Las etiquetas de espacios libres y extra total entre todos aparecen juntas, acomodándose al ancho. `ResumenCifras` muestra personas pagadas y saldo por cobrar al grupo con la misma escala de Iglesias. Ver integrantes abre el mismo `Dialogo` lateral de hasta 560px; no despliega integrantes dentro de la tarjeta. Ver integrantes, Editar y Archivar o Devolver quedan alineados a la izquierda con las acciones compartidas. Los segmentos separan activas y archivadas. La revisión del editor presenta los importes por persona antes de confirmar.

**Reportes.** Las vistas Por iglesia, Pagos recibidos, Pendientes y Habitaciones usan botones de al menos 44px; la selección es morado sólido con texto blanco. El resumen distingue cobrado en el período, recaudado acumulado y pendiente actual; el primer monto usa tinta verde. Barras, estados y tablas siempre conservan etiquetas y cifras. Los filtros permanecen separados de la explicación del alcance y de las acciones Descargar tabla e Imprimir reporte.

**Estado y progreso.** `ChipEstado` combina punto de 7px y texto. `BarraProgreso` usa `scaleX`, transición de 240ms y descripción accesible del monto. Los pagos anulados permanecen visibles tachados.

**Diálogos y menús.** `Dialogo` usa el elemento nativo, ancho máximo predeterminado de 460px y alto máximo de 86vh. El cuerpo desplaza y el pie queda visible; las operaciones en curso bloquean el cierre. Entrada y salida del diálogo duran 180ms con escala de 0.98 a 1; los menús usan desplazamiento vertical de 4px y 140ms. Las filas y hojas no tienen animación de entrada. `prefers-reduced-motion` reduce las transiciones y elimina los transforms de apertura.

**Accesibilidad.** Foco general de 2px en el acento, separado 3px; acceso directo Ir al contenido. Estados vacíos explican la siguiente acción. Los mensajes y etiquetas permanecen en español. No usar el color como única señal.

## Do's and Don'ts

### Do:

- Do usar los componentes compartidos para montos, estados, botones y campos.
- Do conservar búsqueda y filtros al abrir, editar o cobrar una persona.
- Do mantener controles de al menos 44px y foco visible.
- Do acompañar estados y errores con texto en español.
- Do comprobar los diálogos laterales, las tarjetas de altura uniforme y Cupos a 1366px y en ancho móvil.

### Don't:

- Don't usar rojo para representar a quien no ha pagado.
- Don't convertir el registro de pagos en una navegación que pierda la lista.
- Don't introducir rebote, entradas escalonadas de filas ni animar el ancho de las barras.
- Don't poner una clase de display en un diálogo cerrado: su display flex se aplica solo a dialog.dialogo[open].
- Don't depender de una descarga de fuentes para abrir la aplicación local.

**Correcciones de cuenta.** Editar pago reutiliza CampoDinero y los campos de fecha, forma y nota; muestra el saldo resultante y guarda dentro de la misma cuenta. Las revisiones de cupo y eliminación usan texto de 15px, importes tabulares de la misma escala y separadores finos. No añaden tarjetas anidadas. Eliminar definitivamente usa rojo sobrio; Cancelar queda separado y siempre disponible antes de confirmar. El cambio de cupo muestra los importes y compañeros afectados por la salida de una habitación antes de guardar.

## Transición de la versión 1.2.0

Por petición explícita del usuario, el primer arranque elimina las personas archivadas y sus pagos de todos los eventos, con copia SQLite íntegra protegida antes de tocar las cuentas. La transición es atómica y se marca una sola vez; si no hay respaldo o falla una eliminación, no se completa. Los precios base y pagos de personas activas permanecen; las habitaciones afectadas reparten su extra entre quienes quedan. Personas deja de mostrar el acceso a Archivadas. El instalador recuerda la carpeta anterior, cierra únicamente su propio motor y conserva data y respaldos.
