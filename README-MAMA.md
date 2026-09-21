# Tesorera — guía rápida

Tesorera lleva la cuenta de los pagos de la convención. Todo se guarda en esta laptop; no hace falta internet para usarla.

## Abrir Tesorera

Haz doble clic en el icono **Tesorera** del Escritorio.

## Registrar un pago

1. Entra a **Personas**, busca el nombre y toca **Cobrar**.
2. Escribe cuánto está abonando. El monto se acomoda solo, por ejemplo **1,500.50**. También puedes usar **Usar el saldo pendiente**.
3. Toca **Guardar pago**.

La cuenta confirma el pago y muestra cuánto falta. Puedes abrir **Ver comprobante**, registrar otro abono o tocar **Cobrar a otra persona**.

Si necesitas cambiar la fecha, la forma de pago o añadir una nota, abre **Fecha, forma de pago y nota** antes de guardar.

## Agregar o consultar una persona

En **Personas → Agregar persona**, escribe su nombre, elige su iglesia y su tipo de cupo. La primera letra de cada nombre y apellido se pone en mayúscula al salir del campo. El teléfono y las notas son opcionales.

Toca el nombre de una persona para abrir su cuenta. **Pagos** muestra sus abonos; **Datos** reúne estado, iglesia, teléfono, cupo, habitación y notas. Puedes tocar el lápiz de un dato para editarlo, o usar **Editar** al pie.

El icono junto al cierre permite centrar el detalle o volver a ponerlo al lado. La app recuerda esa elección.

## Corregir un pago

1. Abre la cuenta y entra a **Pagos**.
2. Toca los **tres puntos** del pago y elige **Editar pago**.
3. Corrige el monto, la fecha, la forma de pago o la nota y toca **Guardar cambios**.

El saldo, los reportes y el comprobante se actualizan. Si el pago no debía existir, elige **Eliminar pago** en ese menú: la confirmación muestra el nuevo saldo antes de borrarlo definitivamente. Se guarda un respaldo previo. Los pagos anulados de versiones anteriores también se pueden eliminar.

En ese mismo menú está **Ver comprobante** para consultar o imprimir un recibo.

## Iglesias

En **Iglesias** puedes agregar o editar las iglesias y consultar su total, lo recaudado y lo pendiente. **Ver** abre sus personas.

## Cupos y habitaciones

- **Cupos** permite agregar tipos, precios y si incluyen alojamiento. Si un tipo permite habitación privada, puedes indicar el extra total del grupo.
- **Habitaciones** permite crear un grupo, indicar su capacidad y asignar integrantes. También puedes asignar una habitación desde **Datos** de una persona.
- El extra de una habitación privada se reparte entre sus integrantes: si el extra es RD$ 1,000, esos RD$ 1,000 son del grupo completo. Antes de guardar, la app muestra cómo cambia la cuenta de cada integrante.
- Para corregir el cupo de una persona, abre su cuenta → **Datos → Tipo de cupo**. Elige el nuevo cupo o precio, toca **Revisar cambio** y confirma. Sus abonos se conservan; si el cupo no incluye alojamiento, la app muestra la salida de la habitación y el nuevo reparto del extra antes de guardar.
- Cambiar el precio de un tipo de cupo no cambia las cuentas existentes en silencio. La opción de aplicar el precio muestra primero a quién afecta.

## Consultar lo recaudado

En **Reportes** puedes consultar lo recaudado por iglesia, los pagos recibidos, los saldos pendientes y las habitaciones. Puedes elegir fechas e iglesia, imprimir o exportar la información.

## Eliminar una persona

Abre su cuenta y toca **Eliminar** al pie. La confirmación muestra cuántos pagos se borrarán y qué pasará con su habitación. **Eliminar definitivamente** borra la persona, sus cupos y pagos de todos los eventos, también los anteriores. Se guarda un respaldo previo; no se puede deshacer desde la lista.

Al actualizar a **1.2.0**, las personas archivadas y sus pagos se eliminan una sola vez, después de guardar un respaldo especial. Las personas activas y sus pagos se conservan. Si una archivada compartía habitación privada, su espacio se libera y el extra se reparte entre quienes quedan. Iglesias y habitaciones conservan su opción de archivar.

## Respaldar y actualizar

- Se crea un respaldo al abrir la app. También puedes hacerlo en **Ajustes → Hacer respaldo ahora**.
- **Ajustes → Exportar a Excel** permite guardar una copia de la información para consultar.
- Para actualizar, termina de guardar lo que estés haciendo, cierra la ventana de Tesorera y ejecuta el instalador nuevo. El instalador recuerda la carpeta anterior y cierra el motor que quede abierto. No desinstales ni borres la carpeta de Tesorera: allí están tus datos.
- El instalador conserva las cuentas activas. La limpieza de archivadas de 1.2.0 queda respaldada en `data/respaldos/tesorera-antes-v1.2.0-…db`; esa copia no se elimina con los respaldos cotidianos.

Si algo no funciona, avisa a Moisés y dile qué estabas haciendo.
