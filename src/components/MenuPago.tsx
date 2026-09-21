import { useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconoEliminar, IconoLapiz, IconoExportar } from './Iconos'

/** Acciones secundarias del historial, con el mismo popover nativo de los filtros. */
export function MenuPago({
  id,
  descripcion,
  alEliminar,
  alEditar,
}: {
  id: number
  descripcion: string
  alEliminar: () => void
  alEditar?: () => void
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
          p.style.top = `${r.bottom + 164 < window.innerHeight ? r.bottom + 4 : Math.max(16, r.top - 164)}px`
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
        {alEditar && (
          <button
            onClick={() => {
              cerrar()
              alEditar()
            }}
          >
            <IconoLapiz tam={17} /> Editar pago
          </button>
        )}
        <button
          className="accion-eliminar"
          onClick={() => {
            cerrar()
            alEliminar()
          }}
        >
          <IconoEliminar tam={17} /> Eliminar pago
        </button>
      </div>
    </>
  )
}
