import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react'
import { Campo } from './Piezas'
import { aCentavos, soloNumero } from '../lib/dinero'
import { cursorDinero, formatearEdicionDinero } from '../lib/edicionDinero'

type Props = Omit<ComponentProps<typeof Campo>, 'value' | 'onChange' | 'type'> & {
  value: string
  alCambiar: (valor: string) => void
}

export const CampoDinero = forwardRef<HTMLInputElement, Props>(function CampoDinero(
  { value, alCambiar, onBlur, onKeyDown, problema, ...props },
  ref,
) {
  const campo = useRef<HTMLInputElement>(null)
  const cursor = useRef<number | null>(null)
  const [errorEntrada, setErrorEntrada] = useState('')
  useImperativeHandle(ref, () => campo.current!)
  const visible = formatearEdicionDinero(value) ?? value
  useLayoutEffect(() => {
    if (cursor.current !== null && document.activeElement === campo.current) {
      campo.current?.setSelectionRange(cursor.current, cursor.current)
      cursor.current = null
    }
  }, [visible])
  return (
    <Campo
      {...props}
      className={`campo-dinero cifra ${props.className ?? ''}`}
      ref={campo}
      value={visible}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      adorno={props.adorno ?? <span>RD$</span>}
      problema={problema || errorEntrada}
      onChange={(e) => {
        const texto = e.target.value
        const nuevo = formatearEdicionDinero(texto)
        if (nuevo === null) {
          setErrorEntrada('Usa números y un punto para los centavos (por ejemplo, 1,500.50).')
          return
        }
        setErrorEntrada('')
        cursor.current = cursorDinero(texto, e.target.selectionStart ?? texto.length, nuevo)
        alCambiar(nuevo)
        // Si solo se quitó un separador, React no cambia el valor del estado.
        if (nuevo === visible)
          requestAnimationFrame(() => {
            if (cursor.current !== null) campo.current?.setSelectionRange(cursor.current, cursor.current)
            cursor.current = null
          })
      }}
      onPaste={(e) => {
        const pegado = e.clipboardData.getData('text')
        const centavos = aCentavos(pegado)
        e.preventDefault()
        if (centavos === null) {
          setErrorEntrada('Ese monto no es válido. Puedes escribirlo de nuevo.')
          return
        }
        const inicio = e.currentTarget.selectionStart ?? 0
        const fin = e.currentTarget.selectionEnd ?? visible.length
        const insercion = soloNumero(centavos)
        const texto = visible.slice(0, inicio) + insercion + visible.slice(fin)
        const nuevo = formatearEdicionDinero(texto)
        if (nuevo === null) {
          setErrorEntrada('Selecciona el monto completo para reemplazarlo por el que copiaste.')
          return
        }
        setErrorEntrada('')
        cursor.current = cursorDinero(texto, inicio + insercion.length, nuevo)
        alCambiar(nuevo)
      }}
      onKeyDown={(e) => {
        const el = e.currentTarget
        const inicio = el.selectionStart ?? 0
        if (inicio === el.selectionEnd) {
          if (e.key === 'Backspace' && visible[inicio - 1] === ',')
            el.setSelectionRange(inicio - 1, inicio - 1)
          if (e.key === 'Delete' && visible[inicio] === ',') el.setSelectionRange(inicio + 1, inicio + 1)
        }
        onKeyDown?.(e)
      }}
      onBlur={(e) => {
        const centavos = aCentavos(value)
        if (centavos !== null) alCambiar(soloNumero(centavos))
        onBlur?.(e)
      }}
    />
  )
})
