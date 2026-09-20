import { describe, expect, it } from 'vitest'
import { formatearEdicionDinero, cursorDinero } from '../src/lib/edicionDinero'
import { aCentavos } from '../src/lib/dinero'

describe('escritura de importes', () => {
  it('agrega separadores mientras crece el monto sin cambiar su valor', () => {
    for (const [entrada, esperado] of [
      ['1', '1'],
      ['150', '150'],
      ['1500', '1,500'],
      ['1,5000', '15,000'],
      ['1500000.50', '1,500,000.50'],
    ]) {
      expect(formatearEdicionDinero(entrada)).toBe(esperado)
      expect(aCentavos(esperado)).toBe(aCentavos(entrada.replace(/,/g, '')))
    }
  })
  it('conserva el punto y los centavos incompletos al escribir', () => {
    expect(formatearEdicionDinero('1500.')).toBe('1,500.')
    expect(formatearEdicionDinero('1,500.0')).toBe('1,500.0')
    expect(formatearEdicionDinero('.')).toBe('0.')
    expect(formatearEdicionDinero('')).toBe('')
  })
  it('rechaza negativos, letras, varios puntos y exceso de decimales sin convertirlos en otros montos', () => {
    for (const texto of ['-1500', '1a500', '1.5.0', '1500.501'])
      expect(formatearEdicionDinero(texto)).toBeNull()
  })
  it('mantiene el cursor al editar o borrar dígitos en medio del importe', () => {
    expect(cursorDinero('1500', 4, '1,500')).toBe(5)
    expect(cursorDinero('12,500', 2, '12,500')).toBe(2)
    expect(cursorDinero('1,50', 4, '150')).toBe(3)
    expect(cursorDinero('', 0, '')).toBe(0)
    expect(cursorDinero('.', 1, '0.')).toBe(2)
  })
})
