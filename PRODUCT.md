# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Stack y distribución actuales, según `package.json`, `README.md` y `empaquetar/`:

- Frontend: React 18 + Vite + TypeScript + Tailwind CSS
- Backend: Hono sobre Node 24 (mínimo 22; `@hono/node-server`) + `better-sqlite3`, sin ORM
- Datos: SQLite en `data/tesorera.db`, respaldos en `data/respaldos/`
- Un solo proceso en producción: Hono sirve `/api/*` y el `dist/` compilado en el puerto 5177
- Distribución: instalador Windows `Tesorera-Instalador.exe`, con Node y la app
  compilada incluidos. No requiere instalar Git, Node ni npm. Crea accesos directos
  al lanzador `Tesorera.vbs` y se instala en la carpeta de la usuaria, sin permisos
  de administrador. El lanzador abre la app local en una ventana del navegador.
- Sin login, sin usuarios, sin roles: una sola usuaria en una sola máquina.

## Users

**Usuaria única y primaria: la mamá de Moisés, tesorera de la convención.**

- Señora adulta, no técnica. Usa la laptop para lo básico; no abre una terminal
  ni instala nada. Su punto de entrada es un ícono en el Escritorio.
- Trabaja en español; el dinero es en pesos dominicanos (RD$).
- Su laptop es **chica (13"–14", ~1366×768 de ancho útil)**. Todo lo importante de
  cada pantalla tiene que caber ahí sin scroll horizontal y sin sentirse apretado.
- Se equivoca al digitar, y eso es normal: cada error debe poder corregirse sin
  perder el rastro de lo que pasó.

**El trabajo que hace:** llevar la cuenta de los abonos parciales que los hermanos
de varias iglesias van dando para su cupo de la convención, y poder decir en
cualquier momento cuánto pagó cada quien y cuánto le falta.

**Segundas audiencias (no usuarias del software, pero sí lectoras de su salida):**

- El hermano que abona, que recibe un comprobante de lo que pagó.
- El pastor o comité, que recibe el reporte de lo recaudado.

## Product Purpose

Reemplazar la libreta de papel y la memoria con un registro confiable de abonos.

Éxito se ve así, en orden de importancia:

1. Registrar un abono toma **menos de 10 segundos y máximo 3 acciones**
   (buscar persona → escribir monto → confirmar).
2. Ella nunca pierde un dato ni queda sin saber qué hacer en una pantalla.
3. En cualquier momento puede responder, sin calcular nada a mano: *¿cuánto pagó
   fulano?*, *¿cuánto le falta?*, *¿cuánto llevamos recaudado?*
4. Puede entregar comprobante y rendir cuentas sin volver a sumar en papel.

El estándar de calidad es concreto: **ella lo usa sin que nadie le explique nada.**
Si una pantalla necesita explicación, la pantalla está mal.

## Positioning

Es la libreta de tesorería de toda la vida, con las tres cosas que el papel no da:
la suma siempre cuadrada, el historial que no se borra, y la búsqueda instantánea
de una persona entre decenas. No es un software de contabilidad ni una app de
finanzas personales: es un cuaderno de cobros para una sola persona, en una sola
máquina, para un solo evento a la vez.

Lo que un producto vecino no puede copiar con honestidad: está construido para
**una** usuaria conocida, sin cuenta, sin nube, sin suscripción y sin internet.
Los datos viven en un archivo que ella podría copiar a un USB.

## Operating Context

**El momento real de cobro:** los domingos, después del culto, con fila de gente
esperando. Los pagos llegan uno tras otro, en efectivo la mayoría de las veces.
Por eso el flujo de registrar pago debe quedar listo para el siguiente cobro
inmediatamente después de guardar, sin volver al inicio ni buscar el botón otra vez.

**Cuando una persona paga por varias** (una mamá que abona por ella y sus hijos):
sí ocurre, pero registrarlo persona por persona es aceptable siempre que el flujo
sea rápido y encadenable. No se modela una cuenta familiar ni un pago colectivo.
Los grupos de alojamiento sí se organizan en Habitaciones; cada integrante
conserva su cuenta y sus pagos individuales.

**Entorno:** laptop Windows, offline. La app se abre con doble clic en un ícono
llamado "Tesorera" y se cierra cerrando la ventana. No hay servidor, ni cuenta,
ni sincronización que ella deba entender o mantener.

**Rituales que la app debe respetar:**

- Respaldo automático al abrir, más un botón manual de "Hacer respaldo ahora" que
  le diga dónde quedó el archivo.
- Exportar a CSV que abra bien en Excel (BOM UTF-8), para cuando alguien le pida
  los datos.

## Capabilities and Constraints

**Confirmado que debe hacer:**

- Personas con nombre completo, iglesia, categoría de cupo, teléfono y notas.
- Eventos con nombre y fechas. Un solo evento activo a la vez.
- **Categorías de cupo configurables por evento**, cada una con su propio precio.
  En la interfaz se presentan como "tipos de cupo", dentro de Cupos.
  El precio del cupo no depende solo de la edad sino del tipo de alojamiento
  ("Adulto — habitación familiar", "Adulto — habitación compartida", "Niño", …),
  y la usuaria puede agregar tipos nuevos hasta el día del evento sin que nadie
  toque código. Se gestionan en Cupos: agregar, renombrar, cambiar precio,
  reordenar, archivar.
- El precio se copia como foto en la inscripción y es editable (descuentos,
  becas); cambiar el precio de una categoría nunca reescribe inscripciones
  existentes en silencio — hay un botón explícito para aplicarlo a quienes no han
  pagado completo, y avisa a cuántas personas afectará.
- Cada tipo de cupo indica si incluye alojamiento y puede ofrecer un extra
  total configurable para una habitación privada. Este extra es el total de la
  habitación, no un importe por persona. Las habitaciones tienen nombre, capacidad
  e integrantes; el extra se reparte entre ellos en centavos, sin alterar el
  precio base, el descuento ni los pagos de cada inscripción.
- Antes de guardar una habitación o cambiar sus integrantes se revisan los
  importes afectados. Si cambió la información desde la revisión, se exige
  revisarla otra vez. Los traslados se guardan completos o no se guardan; el
  historial de cambios se conserva. La habitación mantiene la foto del extra
  elegido y cualquier actualización posterior exige una decisión explícita.
- Iglesias como etiqueta y filtro, con color propio y una sección Iglesias para
  administrarlas y abrir sus personas. Cada iglesia muestra recaudado, por cobrar,
  total, cantidades por estado y cualquier excedente. Participantes y Archivadas
  separan sus listas; los importes excluyen las personas archivadas. Los nombres siguen un orden natural en español, también
  en los selectores: iglesia 9 antes de iglesia 10.
- Navegación: Inicio, Personas, Iglesias, Habitaciones, Cupos y Reportes; Ajustes queda separado.
  Habitaciones también se abre desde Personas y desde la cuenta individual.
- Personas conserva búsqueda y filtros al abrir la cuenta, cobrar, crear o editar.
  La cuenta abre en el diálogo compartido, lateral de hasta 560px por defecto
  o centrado de hasta 640px, con el nombre real fijo arriba y el contenido
  desplazable. El icono Centrar / Al lateral permite elegir la posición y recordarla
  sin perder el abono en curso; en móvil se oculta esta opción y ambas posiciones
  se adaptan al mismo espacio. Cobrar, ver
  historial, editar y eliminar pagos conservan ese contexto; cerrar vuelve a la lista.
  Pagos muestra el historial y el número de pagos válidos; Datos reúne estado de
  pago, iglesia, teléfono, tipo y precio del cupo, extra privado cuando corresponde,
  habitación y notas. Los valores editables abren el editor correspondiente;
  iglesia, teléfono y notas enfocan el campo elegido. Registrar pago, Editar y
  Eliminar comparten el pie fijo de Pagos y Datos. En móvil
  Registrar pago ocupa una fila sobre las otras acciones. Al abrir el formulario
  el pie se oculta para dejar Guardar pago como acción principal. Cada pago
  tiene un menú para ver su comprobante, editarlo o eliminarlo con confirmación y respaldo previo. Registrar
  pago abre el monto enfocado y Guardar pago confirma el abono. Crear abre un
  diálogo sin perder filtros. Tras guardar, la misma cuenta confirma el pago y
  ofrece comprobante, continuar con otra persona o registrar otro abono aquí.
- Personas archivadas tiene una lista lateral con búsqueda propia, independiente
  de los filtros de personas activas. Permite abrir cada cuenta y devolverla a la
  lista o eliminarla mediante una acción visible con confirmación. No cuentan en las métricas.
- Habitaciones muestra personas pagadas y saldo por cobrar al grupo en tarjetas
  de altura uniforme, con espacios libres y extra total juntos. Ver integrantes
  abre el diálogo lateral compartido de hasta 560px; Editar y Archivar o Devolver
  siguen visibles a la izquierda. Las habitaciones activas y archivadas se
  consultan por separado.
- Iglesias y Habitaciones comparten la escala de cifras y las acciones de
  Personas: Ver, Editar y Archivar o Devolver. En Iglesias, recaudado, por cobrar
  y total tienen la misma jerarquía.
- Cupos presenta una tabla con el ritmo de Personas, acciones explícitas Editar
  y Archivar y el botón principal Agregar tipo de cupo en el encabezado exterior.
  El editor conserva su disposición y ancho máximo de 820px.
- Abonos parciales con monto, fecha, método (efectivo / transferencia / otro) y nota.
  Los campos de dinero muestran RD$, agrupan miles con coma y usan punto decimal
  mientras se escribe, conservan el cursor y permiten pegar importes válidos.
- Estados derivados, nunca almacenados, sobre el total de precio base más extra
  de habitación: **Pagado** (pagado ≥ total) · **Abonando** (0 < pagado < total) ·
  **Sin pagos** (pagado = 0). El excedente se avisa con discreción, no como error.
- Búsqueda que ignora tildes y mayúsculas ("jose" encuentra "José").
- **Comprobante para el hermano que abona**: cuánto pagó y cuánto le falta, en algo
  que ella pueda imprimir o mandar por WhatsApp. *(Confirmado en este init; deja de
  ser un extra opcional.)*
- **Reportes para el pastor o comité**: vistas por iglesia, pagos recibidos,
  pendientes y habitaciones; resumen visual de estados, métodos de pago y cobros
  por mes. Se puede filtrar por iglesia y período, descargar la tabla en CSV e
  imprimir. Las fechas filtran solo los cobros: recaudado acumulado y pendiente
  siguen mostrando los saldos actuales de personas activas. Los pagos anulados se excluyen de lo recaudado.
- Exportar a CSV y respaldar la base con un botón.

**Restricciones duras:**

- **Los datos son sagrados.** Por decisión explícita del usuario, las personas y los pagos pueden eliminarse definitivamente con confirmación y respaldo previo. Eliminar una persona incluye todos sus eventos y recalcula los extras de las habitaciones afectadas. Los pagos se pueden editar sin duplicarlos. Las iglesias y habitaciones se archivan. Los datos archivados o anulados anteriores permanecen accesibles hasta una acción explícita.
- Dinero en **centavos como INTEGER**; formato de salida `RD$ 1,500`.
- Fechas ISO 8601 en la base, en español al mostrarse ("16 de agosto de 2026").
- La lógica de estados y balances vive en **un solo lugar**, nunca duplicada.
- Código y datos en español simple: `personas`, `pagos`, `inscripciones`,
  `iglesias`, `eventos`.

**Vocabulario obligatorio (lo que ella dice) y lo prohibido (jerga):**

| Se dice | Nunca se dice |
|---|---|
| personas, pagos, inicio, respaldo, lista, abono | registros, sincronizar, queries, dashboard, base de datos |

Cero palabras en inglés en la interfaz. Cero jerga técnica en mensajes de error.

**Fuera de alcance por decisión explícita:** login, usuarios y roles; modo oscuro;
ORMs, Redux, Next.js o UI kits grandes; pantallas de configuración complejas
(los ajustes caben en una sola página).

**Abierto, no decidido:**

- Si el comprobante se entrega impreso, como imagen para WhatsApp, o ambas.
- Qué tan seguido le piden cuentas; los reportes ya permiten elegir un período
  para cobros y muestran por separado los saldos acumulados actuales.
- Cuántas categorías de cupo tendrá el evento real y cómo se llaman.

## Brand Commitments

- **Nombre del producto: Tesorera.**
- **Idioma: español exclusivamente**, en toda la interfaz, mensajes y errores.
- **Voz:** cálida y respetuosa, de tesorería, no de startup. Los que deben dinero
  son hermanos de iglesia, **no morosos**: ningún texto ni color los trata como
  deudores en falta.
- **Restricción visual vinculante fijada por el usuario** (registrada tal cual, sin
  ampliarla): los estados de pago tienen color consistente en toda la app —
  Pagado = verde, Abonando = ámbar, Sin pagos = gris neutro (nunca rojo).
- Concepto declarado por el usuario: "una libreta de tesorería moderna" — cálida,
  sobria, confiable; herramienta de trabajo, no landing.

## Evidence on Hand

- `CLAUDE.md` — reglas de oro, stack y convenciones del proyecto.
- `PLAN.md` — modelo de datos, API, pantallas y fases de implementación.
- `PROMPTS.md` — guion de trabajo por fase.

**Todavía no existe** (no inventar ni presentar como real):

- Los nombres reales de las iglesias participantes.
- El nombre, las fechas exactas y las categorías reales del evento con sus
  precios. "Convención Octubre 2026" y las categorías del seed ("Adulto —
  habitación familiar" RD$ 4,500, etc.) son **valores de ejemplo**, no datos
  confirmados. Cuántas categorías tendrá el evento real está abierto: pueden
  aparecer más antes de octubre.
- Cuántas personas hay realmente inscritas (el seed usa ~60 como ensayo).
- Datos históricos: no hay una libreta digitalizada; la app empieza vacía.

Cualquier cifra que aparezca en pantallas de ejemplo debe venir de `npm run seed`
y estar reconocible como ejemplo, nunca presentarse como el estado real del evento.

## Product Principles

1. **El cobro manda.** Registrar un abono es EL flujo de la app; todo lo demás lo
   orbita. Cualquier función nueva que le agregue un clic a ese flujo se rediseña
   o no entra.
2. **Corregir debe ser claro.** Se pueden editar datos, cupos y pagos. Antes de eliminar se explica el alcance, se revisa el reparto afectado y se guarda un respaldo. Nunca se modifica una cuenta desde una confirmación obsoleta.
3. **Los números son el contenido.** La claridad de un monto y de un estado gana
   sobre cualquier adorno, efecto o densidad de información.
4. **Escrito para ella, no para un usuario genérico.** Cada texto se prueba contra
   una pregunta: ¿lo entendería mi mamá sin que nadie se lo explique? Si hay que
   explicarlo, se reescribe la pantalla, no el texto de ayuda.
5. **Nunca dejarla perdida.** Toda pantalla vacía dice qué hacer, toda acción exitosa
   lo confirma, y toda acción destructiva avisa antes.

## Accessibility & Inclusion

Requisitos del proyecto, no genéricos:

- Texto base **≥ 17px**; montos de dinero prominentes con números tabulares
  (`font-variant-numeric: tabular-nums`).
- Objetivos de clic **≥ 44px** — usa trackpad, no siempre con puntería fina.
- Contraste **AA mínimo**; foco de teclado siempre visible; todo operable con teclado.
- **El estado nunca depende solo del color**: cada chip lleva su texto
  ("Pagado", "Abonando", "Sin pagos"), porque el color solo no es suficiente y
  porque ella puede estar leyendo con lentes bajo la luz del templo.
- Diseñar para el ancho angosto (~1280px útiles) como caso base, no como excepción.
- Respetar `prefers-reduced-motion`.

### Correcciones de cuentas — septiembre de 2026

Nombres y apellidos capitalizan sus iniciales al salir del campo y al guardar, sin modificar automáticamente nombres existentes. Cambiar cupo propone su precio estándar y permite ajustarlo; muestra el saldo resultante antes de confirmar y conserva los pagos. Un cupo sin alojamiento libera la habitación y reparte su extra en la misma operación. Los identificadores de personas, pagos e inscripciones no se reutilizan tras eliminar para que los enlaces antiguos no abran otras cuentas.

## Transición de la versión 1.2.0

Por petición explícita del usuario, el primer arranque elimina las personas archivadas y sus pagos de todos los eventos, con copia SQLite íntegra protegida antes de tocar las cuentas. La transición es atómica y se marca una sola vez; si no hay respaldo o falla una eliminación, no se completa. Los precios base y pagos de personas activas permanecen; las habitaciones afectadas reparten su extra entre quienes quedan. Personas deja de mostrar el acceso a Archivadas. El instalador recuerda la carpeta anterior, cierra únicamente su propio motor y conserva data y respaldos.
