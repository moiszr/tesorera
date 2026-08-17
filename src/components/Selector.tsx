import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { normalizar } from '../lib/fechas'
import { IconoBajar, IconoBuscar, IconoCheque } from './Iconos'

export type Opcion = {
  id: number
  etiqueta: string
  /** Texto de apoyo: el precio de un cupo, el pastor de una iglesia. */
  detalle?: string
  /** true cuando el detalle es dinero: va tabular y a la derecha. */
  detalleNumerico?: boolean
  color?: string
}

/**
 * Elegir una opción dentro de un formulario.
 *
 * Es un campo de una línea que abre un menú, no una rejilla de botones. Con
 * botones, tres iglesias y cuatro cupos ya se comían 500px de diálogo, y la
 * cosa empeoraba con cada iglesia nueva. Así el formulario mide lo mismo tenga
 * tres opciones o cincuenta, y se lee de arriba abajo como cualquier formulario.
 *
 * El menú usa la API `popover`: se dibuja sobre todo sin que lo recorte el
 * scroll del diálogo, y cierra con Escape y al tocar afuera por su cuenta.
 */
export function Selector({
  etiqueta,
  opciones,
  valor,
  alElegir,
  textoBuscar,
  umbralBusqueda = 7,
  marcador = 'Elegir…',
  ayuda,
  problema,
}: {
  etiqueta: string
  opciones: Opcion[]
  valor: number | undefined
  alElegir: (id: number) => void
  textoBuscar?: string
  umbralBusqueda?: number
  marcador?: string
  ayuda?: string
  problema?: string | null
}) {
  const id = useId().replace(/:/g, '')
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const elegida = opciones.find((o) => o.id === valor)
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
    p.style.left = `${r.left}px`
    p.style.width = `${r.width}px`
    // Si abajo no cabe, se abre hacia arriba.
    const altoFila = opciones.some((o) => o.detalle && !o.detalleNumerico) ? 58 : 44
    const alto = Math.min(320, opciones.length * altoFila + (conBuscador ? 44 : 0) + 16)
    const cabeAbajo = r.bottom + 6 + alto < window.innerHeight - 12
    p.style.top = cabeAbajo ? `${r.bottom + 6}px` : `${Math.max(12, r.top - alto - 6)}px`
    p.showPopover()
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

  function elegir(v: number) {
    alElegir(v)
    panel.current?.hidePopover()
  }

  return (
    <div>
      <span className="mb-1.5 block text-menuda font-medium text-tinta2">{etiqueta}</span>

      <button
        ref={boton}
        type="button"
        onClick={() => (abierto ? panel.current?.hidePopover() : abrir())}
        aria-expanded={abierto}
        aria-haspopup="listbox"
        aria-invalid={problema ? true : undefined}
        className={[
          'flex min-h-[46px] w-full items-center gap-2.5 rounded-pieza bg-hoja px-3 text-left',
          'border transition-colors duration-150',
          problema
            ? 'border-accion'
            : abierto
              ? 'border-accion ring-2 ring-[rgba(0,112,243,0.18)]'
              : 'border-lineaFuerte hover:border-tinta3',
        ].join(' ')}
      >
        {elegida?.color && (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: elegida.color }}
            aria-hidden
          />
        )}
        {elegida ? (
          <>
            <span className="min-w-0 flex-1 truncate">{elegida.etiqueta}</span>
            {/* En el campo solo se repite el detalle si es dinero: el precio
                confirma lo que va a pagar. Un detalle de texto (el pastor) sirve
                para ELEGIR, no para confirmar, así que vive solo en el menú y
                aquí solo le robaría sitio al nombre. */}
            {elegida.detalle && elegida.detalleNumerico && (
              <span className="cifra shrink-0 font-medium text-tinta2">{elegida.detalle}</span>
            )}
          </>
        ) : (
          <span className="flex-1 text-tinta3">{marcador}</span>
        )}
        <IconoBajar tam={16} className="shrink-0 text-tinta3" />
      </button>

      <div
        ref={panel}
        id={id}
        {...({ popover: 'auto' } as Record<string, string>)}
        className="menu-filtro fixed m-0 overflow-hidden rounded-hoja bg-hoja p-0 shadow-dialogo"
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
                  elegir(filtradas[0].id)
                }
              }}
              className="h-[44px] w-full bg-transparent pl-9 pr-3 text-menuda placeholder:text-tinta3 focus:outline-none"
            />
          </div>
        )}

        <ul className="max-h-[280px] overflow-y-auto py-1" role="listbox">
          {filtradas.length === 0 ? (
            <li className="px-3 py-4 text-center text-menuda text-tinta2">Nada coincide.</li>
          ) : (
            filtradas.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.id === valor}
                  onClick={() => elegir(o.id)}
                  className={[
                    'flex min-h-[44px] w-full items-center gap-2.5 px-3 py-1.5 text-left',
                    'transition-colors duration-150',
                    o.id === valor ? 'bg-[rgba(0,112,243,0.09)] text-accionTexto' : 'hover:bg-hoja2',
                  ].join(' ')}
                >
                  {o.color && (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: o.color }}
                      aria-hidden
                    />
                  )}
                  {/* El precio va a la derecha, porque se compara en columna.
                      Un detalle de texto va debajo, porque compitiendo en la
                      misma línea trunca el nombre, que es lo que ella lee. */}
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate ${o.id === valor ? 'font-medium' : ''}`}>
                      {o.etiqueta}
                    </span>
                    {o.detalle && !o.detalleNumerico && (
                      <span className="block truncate text-menuda text-tinta2">{o.detalle}</span>
                    )}
                  </span>
                  {o.detalle && o.detalleNumerico && (
                    <span
                      className={`cifra shrink-0 font-medium text-menuda ${
                        o.id === valor ? 'text-accionTexto' : 'text-tinta2'
                      }`}
                    >
                      {o.detalle}
                    </span>
                  )}
                  {o.id === valor && <IconoCheque tam={16} className="shrink-0 text-accionTexto" />}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {problema ? (
        <p className="mt-1.5 text-menuda text-accionTexto">{problema}</p>
      ) : ayuda ? (
        <p className="mt-1.5 text-menuda text-tinta2">{ayuda}</p>
      ) : null}
    </div>
  )
}
