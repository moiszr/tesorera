import { useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconoArchivar, IconoExportar } from './Iconos'

/** Acciones secundarias del historial, con el mismo popover nativo de los filtros. */
export function MenuPago({
  id,
  descripcion,
  alAnular,
}: {
  id: number
  descripcion: string
  alAnular: () => void
}) {
  const menu = useRef<HTMLDivElement>(null)
  const identificador = useId()
  function cerrar() {
    menu.current?.hidePopover()
  }
  return (
    <>
      <button
        className="boton-icono opciones-pago"
        aria-label={`Opciones del pago ${descripcion}`}
        title="Opciones del pago"
        aria-controls={identificador}
        onClick={(e) => {
          const p = menu.current
          if (!p) return
          if (p.matches(':popover-open')) {
            cerrar()
            return
          }
          const r = e.currentTarget.getBoundingClientRect()
          const ancho = Math.min(230, window.innerWidth - 32)
          p.style.width = `${ancho}px`
          p.style.left = `${Math.max(16, Math.min(r.right - ancho, window.innerWidth - ancho - 16))}px`
          p.style.top = `${r.bottom + 112 < window.innerHeight ? r.bottom + 4 : Math.max(16, r.top - 112)}px`
          p.showPopover()
          p.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
      <div
        ref={menu}
        id={identificador}
        {...{ popover: 'auto' }}
        className="menu-pago"
        aria-label="Acciones del pago"
      >
        <Link to={`/comprobante/${id}`} target="_blank" rel="noreferrer" onClick={cerrar}>
          <IconoExportar tam={17} /> Ver comprobante
        </Link>
        <button
          onClick={() => {
            cerrar()
            alAnular()
          }}
        >
          <IconoArchivar tam={17} /> Anular pago
        </button>
      </div>
    </>
  )
}
