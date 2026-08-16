/**
 * Datos de ejemplo para desarrollo y para el ensayo general.
 * NUNCA se corre solo: hay que escribir `npm run seed` a propósito.
 *
 * Los nombres, precios e iglesias de aquí son INVENTADOS para probar.
 * Los reales los configura la usuaria en Ajustes.
 */
import { conectar } from './conexion'
import { normalizar } from '../../src/lib/fechas'

const IGLESIAS = [
  { nombre: 'Iglesia Central de Villa Duarte', color: 'indigo' },
  { nombre: 'Iglesia Getsemaní, Los Alcarrizos', color: 'oliva' },
  { nombre: 'Iglesia Monte Sinaí, San Isidro', color: 'arcilla' },
]

const CATEGORIAS = [
  { nombre: 'Adulto — habitación familiar', precio: 450000 },
  { nombre: 'Adulto — habitación compartida', precio: 350000 },
  { nombre: 'Adulto — sin alojamiento', precio: 200000 },
  { nombre: 'Niño', precio: 150000 },
]

const NOMBRES = [
  'María Altagracia Pérez', 'José Ramón Núñez', 'Ana Mercedes Jiménez', 'Juan Bautista Reyes',
  'Rosa Elena Castillo', 'Pedro Antonio Guzmán', 'Carmen Julia Santana', 'Rafael Emilio Peña',
  'Yokasta Marmolejos', 'Francisco Alberto Ureña', 'Altagracia Fermín', 'Manuel de Jesús Rosario',
  'Bienvenida Encarnación', 'Ramón Alexis Polanco', 'Juana Evangelista Mota', 'Domingo Antonio Féliz',
  'Mercedes Aurora Valdez', 'Luis Manuel Then', 'Santa Cecilia Abreu', 'Elvin Radhamés Herrera',
  'Miguelina Ogando', 'Cristian Alberto Solano', 'Fior Daliza Contreras', 'Wilson Amaury Beltré',
  'Nurys Esther Paulino', 'Ambiorix de León', 'Yaneris Altagracia Cuevas', 'Héctor Bienvenido Lantigua',
  'Sobeida Margarita Frías', 'Julio César Espinal', 'Dulce María Sosa', 'Anderson Rafael Made',
  'Ivelisse Josefina Brito', 'Eddy Manuel Aquino', 'Clara Luz Betances', 'Wascar Antonio Zorrilla',
  'Milagros del Carmen Tejada', 'Robinson Alcántara', 'Leidy Diana Corporán', 'Franklin Ozuna',
  'Aurora Esperanza Vargas', 'Elvis Jonathan Batista', 'Ramona Antonia Difó', 'Kelvin Starling Pujols',
  'Blanca Nieves Adames', 'Ignacio Rafael Comprés', 'Yudelka Altagracia Rivas', 'Osvaldo Manuel Terrero',
  'Petronila Villar', 'Genaro Antonio Minaya', 'Esperanza Caraballo', 'Argenis Rafael Volquez',
  'Xiomara Bautista', 'Rubén Darío Mercedes', 'Deyanira Altagracia Gil', 'Hilario Antonio Segura',
  'Marisol Cepeda', 'Freddy Anibal Roa', 'Zoila Esther Marte', 'Nelson Radhamés Objío',
  'Katiuska Pimentel', 'Alfonso Rafael Tavárez', 'Sonia Altagracia Bonilla', 'Isidro Manuel Cabral',
]

// Generador reproducible: el seed sale igual cada vez que se corre.
let semilla = 20261017
function azar() {
  semilla = (semilla * 1103515245 + 12345) % 2147483648
  return semilla / 2147483648
}
function elegir<T>(lista: T[]): T {
  return lista[Math.floor(azar() * lista.length)]
}
function entre(min: number, max: number) {
  return min + Math.floor(azar() * (max - min + 1))
}

function fechaAtras(dias: number) {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString().slice(0, 10)
}

export function sembrar() {
  const db = conectar()

  db.transaction(() => {
    db.prepare('DELETE FROM pagos').run()
    db.prepare('DELETE FROM inscripciones').run()
    db.prepare('DELETE FROM personas').run()
    db.prepare('DELETE FROM categorias').run()
    db.prepare('DELETE FROM eventos').run()
    db.prepare('DELETE FROM iglesias').run()

    const iglesiaIds = IGLESIAS.map(
      (g) => Number(db.prepare('INSERT INTO iglesias (nombre, color) VALUES (?, ?)').run(g.nombre, g.color).lastInsertRowid),
    )

    const eventoId = Number(
      db
        .prepare('INSERT INTO eventos (nombre, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, 1)')
        .run('Convención Octubre 2026', '2026-10-17', '2026-10-19').lastInsertRowid,
    )

    const categoriaIds = CATEGORIAS.map(
      (c, i) =>
        Number(
          db
            .prepare('INSERT INTO categorias (evento_id, nombre, precio, orden) VALUES (?, ?, ?, ?)')
            .run(eventoId, c.nombre, c.precio, i + 1).lastInsertRowid,
        ),
    )

    const insertPersona = db.prepare(
      'INSERT INTO personas (nombre, nombre_busqueda, iglesia_id, telefono) VALUES (?, ?, ?, ?)',
    )
    const insertInscripcion = db.prepare(
      'INSERT INTO inscripciones (persona_id, evento_id, categoria_id, precio, precio_a_mano) VALUES (?, ?, ?, ?, ?)',
    )
    const insertPago = db.prepare(
      'INSERT INTO pagos (inscripcion_id, monto, fecha, metodo, nota, anulado, nota_anulacion, anulado_en, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )

    NOMBRES.forEach((nombre, idx) => {
      const iglesia = iglesiaIds[idx % iglesiaIds.length]
      const catIdx = idx % categoriaIds.length
      const categoriaId = categoriaIds[catIdx]
      let precio = CATEGORIAS[catIdx].precio
      let aMano = 0

      // Una beca: precio editado a mano, para probar que aplicar precios no la pisa.
      if (idx === 7) {
        precio = 200000
        aMano = 1
      }

      const telefono = azar() > 0.35 ? `809-${entre(200, 899)}-${String(entre(1000, 9999))}` : null
      const personaId = Number(insertPersona.run(nombre, normalizar(nombre), iglesia, telefono).lastInsertRowid)
      const inscripcionId = Number(insertInscripcion.run(personaId, eventoId, categoriaId, precio, aMano).lastInsertRowid)

      // Dos pagos anulados, para probar el historial tachado. Se insertan antes
      // del reparto de estados: si no, a quien le toca "sin pagos" se queda sin
      // el anulado y el ensayo nunca prueba la anulación.
      if (idx === 1 || idx === 12) {
        insertPago.run(
          inscripcionId, 100000, fechaAtras(entre(3, 20)), 'efectivo', null, 1,
          'Me equivoqué de persona', new Date().toISOString().replace('T', ' ').slice(0, 19),
          new Date(Date.now() - 10 * 86400000).toISOString().replace('T', ' ').slice(0, 19),
        )
      }

      // Reparto de estados: ~30% pagados, ~45% abonando, ~25% sin pagos.
      const suerte = azar()
      if (suerte < 0.25) return // sin pagos

      const cuantos = suerte < 0.7 ? entre(1, 3) : entre(2, 4)
      let acumulado = 0
      for (let i = 0; i < cuantos; i++) {
        const restante = precio - acumulado
        if (restante <= 0) break
        const esUltimo = i === cuantos - 1
        const monto = suerte >= 0.7 && esUltimo ? restante : Math.min(restante, entre(5, 15) * 10000)
        if (monto <= 0) break
        acumulado += monto
        insertPago.run(
          inscripcionId,
          monto,
          fechaAtras(entre(1, 60)),
          elegir(['efectivo', 'efectivo', 'efectivo', 'transferencia']),
          null,
          0,
          null,
          null,
          new Date(Date.now() - entre(1, 60) * 86400000).toISOString().replace('T', ' ').slice(0, 19),
        )
      }

      // Una persona con excedente, para probar el aviso discreto.
      if (idx === 3) {
        insertPago.run(inscripcionId, precio, fechaAtras(2), 'efectivo', 'Pagó completo aparte', 0, null, null,
          new Date(Date.now() - 2 * 86400000).toISOString().replace('T', ' ').slice(0, 19))
      }

    })
  })()

  const cuenta = db.prepare('SELECT COUNT(*) AS n FROM personas').get() as any
  const pagos = db.prepare('SELECT COUNT(*) AS n FROM pagos').get() as any
  console.log(`Datos de ejemplo cargados: ${cuenta.n} personas, ${pagos.n} pagos, 4 tipos de cupo.`)
}

const esEntradaDirecta = process.argv[1]?.includes('seed')
if (esEntradaDirecta) sembrar()
