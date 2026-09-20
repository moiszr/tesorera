import { expect, it } from 'vitest'
import { ordenarPorNombre } from '../src/lib/orden'

it('ordena nombres en español y números de iglesias sin alterar la lista original', () => {
  const lista = [
    { nombre: 'Iglesia #10' },
    { nombre: 'iglesia #2' },
    { nombre: 'Iglesia #9' },
    { nombre: 'Ágape' },
  ]
  expect(ordenarPorNombre(lista).map((g) => g.nombre)).toEqual([
    'Ágape',
    'iglesia #2',
    'Iglesia #9',
    'Iglesia #10',
  ])
  expect(lista[0].nombre).toBe('Iglesia #10')
})
