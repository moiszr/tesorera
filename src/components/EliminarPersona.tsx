import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { PlanEliminarPersona } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { Dialogo } from './Dialogo'
import { Boton } from './Piezas'
import { CambiosHabitacion } from './CambiosHabitacion'

export function EliminarPersona({
  id,
  nombre,
  alCerrar,
  alEliminar,
}: {
  id: number
  nombre: string
  alCerrar: () => void
  alEliminar: () => void
}) {
  const [plan, setPlan] = useState<PlanEliminarPersona | null>(null)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [intento, setIntento] = useState(0)
  const enCurso = useRef(false)
  useEffect(() => {
    let vigente = true
    setPlan(null)
    setError('')
    api
      .revisarEliminarPersona(id)
      .then((p) => {
        if (vigente) setPlan(p)
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
    return () => {
      vigente = false
    }
  }, [id, intento])
  async function eliminar() {
    if (!plan || enCurso.current) return
    enCurso.current = true
    setGuardando(true)
    setError('')
    try {
      await api.eliminarPersona(id, plan.firma)
      toast.success('Persona eliminada', { description: 'Sus pagos y los totales quedaron actualizados.' })
      alEliminar()
    } catch (e) {
      setError((e as Error).message)
      setPlan(null)
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
      titulo="Eliminar persona"
      ancho={520}
      pie={
        <>
          <Boton variante="texto" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton className="boton-eliminar" onClick={eliminar} disabled={!plan} cargando={guardando}>
            Eliminar definitivamente
          </Boton>
        </>
      }
    >
      <div className="revision-cuenta">
        <p>
          Se eliminará a <strong>{nombre}</strong> y su cuenta completa. Esta acción no se puede deshacer
          desde la lista.
        </p>
        {plan ? (
          <>
            <dl className="revision-importes">
              <div>
                <dt>Pagos que se borran</dt>
                <dd>{plan.pagos}</dd>
              </div>
              <div>
                <dt>Pagado en total</dt>
                <dd className="cifra">{formatoRD(plan.pagado)}</dd>
              </div>
            </dl>
            {plan.eventos > 1 && (
              <p>Incluye sus cuentas en los {plan.eventos} eventos, también los anteriores.</p>
            )}
            <CambiosHabitacion habitaciones={plan.habitaciones} />
            <p className="text-menuda text-tinta2">
              Antes de eliminar, se guardará un respaldo en esta computadora.
            </p>
          </>
        ) : (
          !error && <p role="status">Revisando su cuenta…</p>
        )}
        {error && (
          <div role="alert">
            <p>{error}</p>
            <Boton onClick={() => setIntento((n) => n + 1)}>Revisar de nuevo</Boton>
          </div>
        )}
      </div>
    </Dialogo>
  )
}
