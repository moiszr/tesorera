import type { Estado } from '../lib/estados'

export type Iglesia = {
  id: number
  nombre: string
  color: string
  pastor: string | null
  archivada: number
  personas: number
}

export type Pastor = {
  nombre: string
  iglesias: number
  personas: number
}

export type Categoria = {
  id: number
  evento_id: number
  nombre: string
  precio: number
  orden: number
  archivada: number
  inscritos: number
  incluye_alojamiento: number
  extra_privado: number | null
}

export type Evento = {
  id: number
  nombre: string
  fecha_inicio: string | null
  fecha_fin: string | null
  activo: number
  categorias: Categoria[]
}

export type PersonaEnLista = {
  id: number
  archivada: number
  nombre: string
  telefono: string | null
  iglesia_id: number | null
  iglesia: string | null
  iglesia_color: string | null
  pastor: string | null
  inscripcion_id: number | null
  categoria_id: number | null
  categoria: string | null
  precio: number
  incluye_alojamiento: number
  precio_base: number
  extra_habitacion: number
  habitacion_id: number | null
  habitacion: string | null
  pagado: number
  balance: number
  excedente: number
  estado: Estado
  ultimo_pago: string | null
}

export type Conteos = {
  total: number
  estado: Record<Estado, number>
  categoria: Record<number, number>
  iglesia: Record<number, number>
  pastor: Record<string, number>
}

export type Pago = {
  firma: string
  id: number
  inscripcion_id: number
  monto: number
  fecha: string
  metodo: string
  nota: string | null
  anulado: number
  nota_anulacion: string | null
  anulado_en: string | null
  creado_en: string
}

export type Cuenta = {
  precio: number
  pagado: number
  balance: number
  excedente: number
  estado: Estado
}

export type Ficha = {
  persona: {
    id: number
    nombre: string
    telefono: string | null
    notas: string | null
    archivada: number
    iglesia_id: number | null
    iglesia: string | null
    iglesia_color: string | null
    pastor: string | null
  }
  evento: { id: number; nombre: string; fecha_inicio: string | null } | null
  inscripcion: {
    id: number
    categoria_id: number
    categoria: string
    precio: number
    incluye_alojamiento: number
    extra_habitacion: number
    habitacion_id: number | null
    habitacion: string | null
    precio_categoria: number
    precio_a_mano: number
    categoria_archivada: number
  } | null
  cuenta: Cuenta
  pagos: Pago[]
}

export type Resumen = {
  evento: Evento | null
  totales: {
    meta: number
    recaudado: number
    recaudado_real: number
    pendiente: number
    inscritos: number
    pagados: number
    abonando: number
    sinpagos: number
  } | null
  ultimos_pagos: {
    id: number
    monto: number
    fecha: string
    metodo: string
    persona_id: number
    persona: string
  }[]
  iglesias: {
    nombre: string
    color: string
    meta: number
    recaudado: number
    pendiente: number
    personas: number
  }[]
  categorias: {
    id: number
    nombre: string
    personas: number
    meta: number
    recaudado: number
    pendiente: number
  }[]
}

export type DatosHabitacion = import('../../server/db/habitaciones').DatosHabitacion
export type PlanHabitacion = ReturnType<typeof import('../../server/db/habitaciones').prepararHabitacion>
export type Habitacion = {
  id: number
  nombre: string
  capacidad: number
  categoria_privada_id: number | null
  extra_total: number
  notas: string | null
  archivada: number
  revision: number
  cupo_privado: string | null
  integrantes: PersonaEnLista[]
}
export type HabitacionesDatos = {
  evento: Evento | null
  habitaciones: Habitacion[]
  personas: PersonaEnLista[]
}
export type ReporteDatos = ReturnType<typeof import('../../server/db/informes').informe>

export type PlanEliminarPersona = ReturnType<
  typeof import('../../server/db/correcciones').revisarEliminarPersona
>
export type PlanCupo = ReturnType<typeof import('../../server/db/correcciones').revisarCupo>
