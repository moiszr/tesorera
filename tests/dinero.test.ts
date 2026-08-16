import { describe, expect, it } from 'vitest'
import { aCentavos, aTextoEditable, formatoRD, soloNumero } from '../src/lib/dinero'

describe('formatoRD', () => {
  it('no muestra decimales cuando son .00', () => {
    expect(formatoRD(350000)).toBe('RD$ 3,500')
    expect(formatoRD(0)).toBe('RD$ 0')
    expect(formatoRD(100)).toBe('RD$ 1')
  })

  it('muestra los centavos cuando los hay', () => {
    expect(formatoRD(350050)).toBe('RD$ 3,500.50')
    expect(formatoRD(1)).toBe('RD$ 0.01')
  })

  it('separa los miles', () => {
    expect(soloNumero(1234567800)).toBe('12,345,678')
  })

  it('marca los negativos con el signo menos tipográfico', () => {
    expect(soloNumero(-50000)).toBe('−500')
  })
})

describe('aCentavos', () => {
  it('acepta lo que ella escribiría', () => {
    expect(aCentavos('1500')).toBe(150000)
    expect(aCentavos('1,500')).toBe(150000)
    expect(aCentavos('1.500')).toBe(150000)
    expect(aCentavos(' 1 500 ')).toBe(150000)
    expect(aCentavos('RD$ 1,500')).toBe(150000)
    expect(aCentavos('rd$1500')).toBe(150000)
  })

  it('entiende los decimales con punto o con coma', () => {
    expect(aCentavos('1500.50')).toBe(150050)
    expect(aCentavos('1500,50')).toBe(150050)
    expect(aCentavos('1,500.50')).toBe(150050)
    expect(aCentavos('0.5')).toBe(50)
    expect(aCentavos('.75')).toBe(75)
  })

  it('trata el separador de tres dígitos como miles, no como decimal', () => {
    expect(aCentavos('1.500')).toBe(150000)
    expect(aCentavos('12,345')).toBe(1234500)
  })

  it('devuelve null cuando no hay un número', () => {
    expect(aCentavos('')).toBeNull()
    expect(aCentavos('  ')).toBeNull()
    expect(aCentavos('mil quinientos')).toBeNull()
    expect(aCentavos('abc')).toBeNull()
    expect(aCentavos('12a3')).toBeNull()
  })

  it('nunca pierde centavos por punto flotante', () => {
    // 0.1 + 0.2 en decimales sería 0.30000000000000004; en centavos es exacto.
    const a = aCentavos('0.10')!
    const b = aCentavos('0.20')!
    expect(a + b).toBe(30)
    expect(formatoRD(a + b)).toBe('RD$ 0.30')
  })

  it('vuelve del centavo al texto editable', () => {
    expect(aTextoEditable(350000)).toBe('3500')
    expect(aTextoEditable(350050)).toBe('3500.50')
    expect(aCentavos(aTextoEditable(987654))).toBe(987654)
  })
})
