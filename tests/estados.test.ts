import { describe, expect, it } from 'vitest'
import {
  calcularBalance,
  calcularEstado,
  calcularExcedente,
  proporcionPagada,
} from '../src/lib/estados'

describe('calcularEstado', () => {
  it('sin pagos cuando no ha abonado nada', () => {
    expect(calcularEstado(0, 350000)).toBe('sinpagos')
  })

  it('abonando mientras falte algo', () => {
    expect(calcularEstado(1, 350000)).toBe('abonando')
    expect(calcularEstado(349999, 350000)).toBe('abonando')
  })

  it('pagado justo al llegar al precio', () => {
    expect(calcularEstado(350000, 350000)).toBe('pagado')
  })

  it('pagado también si pagó de más', () => {
    expect(calcularEstado(400000, 350000)).toBe('pagado')
  })

  it('con precio cero, pagar algo lo deja abonando (excedente), no pagado', () => {
    expect(calcularEstado(0, 0)).toBe('sinpagos')
    expect(calcularEstado(1000, 0)).toBe('abonando')
  })

  // El botón "Cobrar" de la lista de personas se pinta cuando el estado NO es
  // "pagado". Como el estado se recalcula en cada consulta a partir del precio
  // vivo de la inscripción, subirle el precio a alguien que ya había saldado
  // tiene que devolverlo a "abonando" — y con él, su botón.
  it('si el precio sube por encima de lo pagado, vuelve a abonando', () => {
    expect(calcularEstado(450000, 450000)).toBe('pagado')
    expect(calcularEstado(450000, 500000)).toBe('abonando')
  })

  // La otra cara de lo mismo: con precio 0 el balance también es 0, pero el
  // estado es "sin pagos" y ahí sí hay que ofrecer cobrar. Por eso el botón
  // mira el estado y no el balance.
  it('balance cero no siempre significa pagado', () => {
    expect(calcularBalance(0, 0)).toBe(0)
    expect(calcularEstado(0, 0)).not.toBe('pagado')
  })
})

describe('balance y excedente', () => {
  it('el balance nunca es negativo', () => {
    expect(calcularBalance(400000, 350000)).toBe(0)
    expect(calcularBalance(100000, 350000)).toBe(250000)
  })

  it('el excedente solo aparece cuando pagó de más', () => {
    expect(calcularExcedente(400000, 350000)).toBe(50000)
    expect(calcularExcedente(350000, 350000)).toBe(0)
    expect(calcularExcedente(100000, 350000)).toBe(0)
  })

  it('balance y excedente nunca son ambos mayores que cero', () => {
    for (const [pagado, precio] of [[0, 100], [50, 100], [100, 100], [150, 100]]) {
      const b = calcularBalance(pagado, precio)
      const e = calcularExcedente(pagado, precio)
      expect(b === 0 || e === 0).toBe(true)
    }
  })
})

describe('proporcionPagada', () => {
  it('va de 0 a 1 y nunca se pasa', () => {
    expect(proporcionPagada(0, 350000)).toBe(0)
    expect(proporcionPagada(175000, 350000)).toBe(0.5)
    expect(proporcionPagada(350000, 350000)).toBe(1)
    expect(proporcionPagada(700000, 350000)).toBe(1)
  })

  it('no explota con precio cero', () => {
    expect(proporcionPagada(0, 0)).toBe(0)
    expect(proporcionPagada(1000, 0)).toBe(1)
  })
})
