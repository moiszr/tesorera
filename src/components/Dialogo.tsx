import { useEffect, useRef, type ReactNode } from 'react'
import { Boton } from './Piezas'
import { IconoCerrar } from './Iconos'

/**
 * Diálogo sobre <dialog> nativo: se escapa del contenedor solo, atrapa el
 * foco solo, y cierra con Escape solo. No reinventamos el modal.
 *
 * Solo se usa donde de verdad hace falta interrumpir: confirmar algo que
 * cambia dinero o que no se puede deshacer con un clic.
 */
export function Dialogo({
  abierto,
  alCerrar,
  titulo,
  children,
  pie,
  ancho = 460,
}: {
  abierto: boolean
  alCerrar: () => void
  titulo: string
  children: ReactNode
  pie?: ReactNode
  ancho?: number
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const alCancelar = (e: Event) => {
      e.preventDefault()
      alCerrar()
    }
    d.addEventListener('cancel', alCancelar)
    return () => d.removeEventListener('cancel', alCancelar)
  }, [alCerrar])

  return (
    <dialog
      ref={ref}
      className="dialogo m-auto flex max-h-[86vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-hoja bg-hoja p-0 text-tinta shadow-dialogo backdrop:bg-[rgba(40,28,18,0.42)]"
      style={{ maxWidth: ancho }}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar()
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-1 pt-5">
        <h2 className="text-guia font-semibold leading-snug">{titulo}</h2>
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar"
          className="-mr-1.5 -mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-pieza text-tinta2 transition-colors hover:bg-[rgba(36,31,27,0.06)] hover:text-tinta"
        >
          <IconoCerrar tam={18} />
        </button>
      </div>

      {/* El cuerpo hace scroll y el pie se queda quieto: con muchas iglesias o
          muchos tipos de cupo, el botón de guardar no puede irse fuera de la
          pantalla. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-2">{children}</div>

      {pie && (
        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-linea bg-hoja2 px-5 py-4">
          {pie}
        </div>
      )}
    </dialog>
  )
}

/** Confirmación de una acción seria. El botón dice exactamente qué va a pasar. */
export function Confirmacion({
  abierto,
  alCerrar,
  alConfirmar,
  titulo,
  children,
  textoConfirmar,
  cargando,
}: {
  abierto: boolean
  alCerrar: () => void
  alConfirmar: () => void
  titulo: string
  children: ReactNode
  textoConfirmar: string
  cargando?: boolean
}) {
  return (
    <Dialogo
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={titulo}
      pie={
        <>
          <Boton variante="texto" onClick={alCerrar}>
            No, dejarlo así
          </Boton>
          <Boton variante="principal" onClick={alConfirmar} cargando={cargando}>
            {textoConfirmar}
          </Boton>
        </>
      }
    >
      <div className="space-y-3 text-tinta2">{children}</div>
    </Dialogo>
  )
}
