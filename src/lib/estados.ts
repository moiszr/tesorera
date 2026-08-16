// La única definición de "cómo va una persona con su pago".
// La usan el servidor (al calcular las listas) y el frontend (al pintarlas).
// Si esta lógica se duplica, tarde o temprano una pantalla miente.

export type Estado = 'pagado' | 'abonando' | 'sinpagos'

export function calcularEstado(pagado: number, precio: number): Estado {
  if (precio > 0 && pagado >= precio) return 'pagado'
  if (pagado > 0) return 'abonando'
  return 'sinpagos'
}

export function calcularBalance(pagado: number, precio: number): number {
  return Math.max(0, precio - pagado)
}

/** Cuánto pagó de más, si pagó de más. Siempre 0 o positivo. */
export function calcularExcedente(pagado: number, precio: number): number {
  return Math.max(0, pagado - precio)
}

/** De 0 a 1. Se usa para la barra de progreso; nunca pasa de 1. */
export function proporcionPagada(pagado: number, precio: number): number {
  if (precio <= 0) return pagado > 0 ? 1 : 0
  return Math.min(1, pagado / precio)
}

export const NOMBRE_ESTADO: Record<Estado, string> = {
  pagado: 'Pagado',
  abonando: 'Abonando',
  sinpagos: 'Sin pagos',
}

/** Los tres estados en el orden en que se muestran siempre. */
export const ESTADOS: Estado[] = ['pagado', 'abonando', 'sinpagos']
