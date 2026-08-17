import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { normalizar } from '../lib/fechas'
import { IconoBuscar, IconoCerrar, IconoBajar } from './Iconos'

export type OpcionFiltro = {
  valor: string | number
  etiqueta: string
  /** Texto de apoyo a la derecha (cuántas iglesias agrupa un pastor, etc.). */
  nota?: string
  cuenta?: number
  color?: string
}

/**
 * Un filtro de la barra de herramientas.
 *
 * Es un botón compacto que se abre en un menú, no una fila de píldoras: con
 * cuatro filtros y varias opciones cada uno, las píldoras se comen media
 * pantalla y encima no escalan. Así la barra ocupa una línea, tenga tres
 * iglesias o cincuenta.
 *
 * El menú usa la API `popover` del navegador, así que se dibuja por encima de
 * todo (no lo recorta ningún contenedor), se cierra con Escape y se cierra al
 * tocar afuera sin que nosotros escribamos nada de eso.
 */
export function FiltroMenu({
  etiqueta,
  opciones,
  valor,
  alElegir,
  textoBuscar,
  textoTodas = 'Todas',
  permiteTodas = true,
  umbralBusqueda = 8,
  ancho = 280,
}: {
  etiqueta: string
  opciones: OpcionFiltro[]
  valor: string | number | undefined
  alElegir: (valor: string | number | undefined) => void
  textoBuscar?: string
  textoTodas?: string
  /** El orden siempre tiene un valor: ahí no hay "Todas". */
  permiteTodas?: boolean
  umbralBusqueda?: number
  ancho?: number
}) {
  const id = useId().replace(/:/g, '')
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const elegida = opciones.find((o) => o.valor === valor)
  const activo = valor !== undefined && permiteTodas
  const conBuscador = opciones.length > umbralBusqueda

  const filtradas = useMemo(() => {
    const t = normalizar(busqueda)
    if (!t) return opciones
    return opciones.filter((o) => normalizar(o.etiqueta).includes(t))
  }, [busqueda, opciones])

  function abrir() {
    const p = panel.current
    const b = boton.current
    if (!p || !b) return

    const r = b.getBoundingClientRect()
    // Si no cabe a la derecha, se alinea por su borde derecho.
    const izquierda = Math.min(r.left, window.innerWidth - ancho - 16)
    p.style.left = `${Math.max(16, izquierda)}px`
    p.style.top = `${r.bottom + 6}px`
    p.style.width = `${ancho}px`
    p.showPopover()
  }

  function cerrar() {
    panel.current?.hidePopover()
  }

  useEffect(() => {
    const p = panel.current
    if (!p) return
    const alCambiar = () => {
      const visible = p.matches(':popover-open')
      setAbierto(visible)
      if (visible) requestAnimationFrame(() => campo.current?.focus())
      else setBusqueda('')
    }
    p.addEventListener('toggle', alCambiar)
    return () => p.removeEventListener('toggle', alCambiar)
  }, [])

  function elegir(v: string | number | undefined) {
    alElegir(v)
    cerrar()
  }

  return (
    <>
      <button
        ref={boton}
        type="button"
        onClick={() => (abierto ? cerrar() : abrir())}
        aria-expanded={abierto}
        aria-haspopup="listbox"
        className={[
          'inline-flex min-h-[44px] max-w-[280px] items-center gap-2 rounded-pieza px-3 text-menuda',
          'border transition-colors duration-150 active:scale-[0.98]',
          activo
            ? 'border-accion bg-[rgba(37,99,235,0.09)] font-medium text-accion'
            : 'border-linea text-tinta2 hover:border-lineaFuerte hover:bg-hoja2 hover:text-tinta',
        ].join(' ')}
      >
        {elegida?.color && (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: elegida.color }}
            aria-hidden
          />
        )}
        <span className="truncate">
          {elegida ? (
            <>
              <span className={activo ? 'font-normal opacity-70' : ''}>{etiqueta}: </span>
              {elegida.etiqueta}
            </>
          ) : (
            etiqueta
          )}
        </span>
        {activo && permiteTodas ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Quitar el filtro ${etiqueta}`}
            onClick={(e) => {
              e.stopPropagation()
              alElegir(undefined)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                alElegir(undefined)
              }
            }}
            className="-mr-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[rgba(37,99,235,0.16)]"
          >
            <IconoCerrar tam={14} />
          </span>
        ) : (
          <IconoBajar tam={15} className="-mr-0.5 shrink-0 opacity-60" />
        )}
      </button>

      <div
        ref={panel}
        id={id}
        {...({ popover: 'auto' } as Record<string, string>)}
        className="menu-filtro fixed m-0 overflow-hidden rounded-hoja border border-linea bg-hoja p-0 shadow-dialogo"
      >
        {conBuscador && (
          <div className="relative border-b border-linea">
            <IconoBuscar
              tam={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta3"
            />
            <input
              ref={campo}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={textoBuscar ?? `Buscar ${etiqueta.toLowerCase()}…`}
              aria-label={textoBuscar ?? `Buscar ${etiqueta.toLowerCase()}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filtradas.length > 0) {
                  e.preventDefault()
                  elegir(filtradas[0].valor)
                }
              }}
              className="h-[44px] w-full bg-transparent pl-9 pr-3 text-menuda placeholder:text-tinta3 focus:outline-none"
            />
          </div>
        )}

        <ul className="max-h-[280px] overflow-y-auto py-1" role="listbox">
          {permiteTodas && (
            <li>
              <BotonOpcion elegida={valor === undefined} onClick={() => elegir(undefined)}>
                <span className="flex-1 text-tinta2">{textoTodas}</span>
              </BotonOpcion>
            </li>
          )}

          {filtradas.length === 0 ? (
            <li className="px-3 py-4 text-center text-menuda text-tinta2">Nada coincide.</li>
          ) : (
            filtradas.map((o) => (
              <li key={o.valor}>
                <BotonOpcion elegida={o.valor === valor} onClick={() => elegir(o.valor)}>
                  {o.color && (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: o.color }}
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate">
                    {o.etiqueta}
                    {o.nota && <span className="text-tinta3"> · {o.nota}</span>}
                  </span>
                  {o.cuenta !== undefined && (
                    <span className="cifra shrink-0 text-menuda text-tinta3">{o.cuenta}</span>
                  )}
                </BotonOpcion>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  )
}

function BotonOpcion({
  elegida,
  onClick,
  children,
}: {
  elegida: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={elegida}
      onClick={onClick}
      className={[
        'flex min-h-[44px] w-full items-center gap-2.5 px-3 text-left text-menuda',
        'transition-colors duration-150',
        elegida ? 'bg-[rgba(37,99,235,0.09)] font-medium text-accion' : 'hover:bg-hoja2',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
