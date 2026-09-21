import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Ficha, Pago } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { Dialogo } from './Dialogo'
import { Boton, Campo } from './Piezas'
import { CampoDinero } from './CampoDinero'

export function EditarPago({
  pago,
  ficha,
  alCerrar,
  alGuardar,
}: {
  pago: Pago
  ficha: Ficha
  alCerrar: () => void
  alGuardar: (ficha: Ficha) => void
}) {
  const [monto, setMonto] = useState(aTextoEditable(pago.monto))
  const [fecha, setFecha] = useState(pago.fecha)
  const [metodo, setMetodo] = useState(pago.metodo)
  const [nota, setNota] = useState(pago.nota ?? '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const enCurso = useRef(false)
  const valor = aCentavos(monto)
  const restante = ficha.cuenta.precio - (ficha.cuenta.pagado - pago.monto + (valor ?? pago.monto))
  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (enCurso.current) return
    if (valor === null || valor <= 0) {
      setError('Escribe un monto mayor que cero.')
      return
    }
    enCurso.current = true
    setGuardando(true)
    setError('')
    try {
      const r = await api.editarPago(pago.id, { monto: valor, fecha, metodo, nota, firma: pago.firma })
      toast.success('Pago actualizado', { description: 'El saldo y los reportes ya reflejan el cambio.' })
      alGuardar(r.ficha)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      enCurso.current = false
      setGuardando(false)
    }
  }
  return (
    <Dialogo
      abierto
      ocupado={guardando}
      alCerrar={alCerrar}
      titulo="Editar pago"
      descripcion={ficha.persona.nombre}
      ancho={480}
    >
      <form onSubmit={guardar} className="space-y-4">
        <fieldset disabled={guardando} className="space-y-4">
          <CampoDinero
            etiqueta="Monto del pago"
            value={monto}
            alCambiar={setMonto}
            adorno={<span>RD$</span>}
            autoFocus
            required
          />
          <Campo
            etiqueta="Fecha del pago"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
          <label className="block text-menuda text-tinta2">
            Forma de pago
            <select className="campo-select mt-1" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <Campo etiqueta="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} />
          {valor !== null && valor > 0 && (
            <p className="prevision-pago">
              {restante > 0
                ? `Quedará pendiente ${formatoRD(restante)}.`
                : restante < 0
                  ? `Quedará un excedente de ${formatoRD(-restante)}.`
                  : 'El cupo quedará pagado completo.'}
            </p>
          )}
          {error && (
            <p role="alert" className="text-menuda text-accionTexto">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-linea pt-4">
            <Boton type="button" variante="texto" onClick={alCerrar}>
              Cancelar
            </Boton>
            <Boton type="submit" variante="principal" cargando={guardando}>
              Guardar cambios
            </Boton>
          </div>
        </fieldset>
      </form>
    </Dialogo>
  )
}
