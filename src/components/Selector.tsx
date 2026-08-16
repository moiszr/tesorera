import { useEffect, useMemo, useRef, useState } from 'react'
import { normalizar } from '../lib/fechas'
import { IconoBuscar, IconoCheque, IconoVolver } from './Iconos'

export type Opcion = {
  id: number
  etiqueta: string
  /** Texto secundario que ayuda a decidir: el precio de un cupo, el pastor de una iglesia. */
  detalle?: string
  /** true cuando el detalle es dinero: va tabular, en negrita y a la derecha. */
  detalleNumerico?: boolean
  /** Punto de color de identidad (las iglesias). */
  color?: string
}

/**
 * Selector de una opción que se ADAPTA a cuántas opciones hay.
 *
 * Con pocas, se muestran todas: elegir es un solo toque y se ven los precios
 * de un vistazo. Pasado el umbral eso deja de caber —quince iglesias en
 * botones son cinco filas— así que cambia a un campo con buscador que ocupa
 * siempre lo mismo, haya tres opciones o cincuenta.
 *
 * El panel se abre EN LÍNEA, empujando lo de abajo, en vez de flotar encima:
 * dentro de un diálogo con scroll un panel flotante se recorta solo.
 */
export function Selector({
  etiqueta,
  opciones,
  valor,
  alElegir,
  umbral = 6,
  textoBuscar = 'Buscar…',
  columnas = 1,
  ayuda,
  problema,
}: {
  etiqueta: string
  opciones: Opcion[]
  valor: number | undefined
  alElegir: (id: number) => void
  umbral?: number
  textoBuscar?: string
  columnas?: 1 | 2
  ayuda?: string
  problema?: string | null
}) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  const muchas = opciones.length > umbral
  const elegida = opciones.find((o) => o.id === valor)

  const filtradas = useMemo(() => {
    const t = normalizar(busqueda)
    if (!t) return opciones
    return opciones.filter((o) => normalizar(o.etiqueta).includes(t))
  }, [busqueda, opciones])

  useEffect(() => {
    if (abierto) requestAnimationFrame(() => campo.current?.focus())
    else setBusqueda('')
  }, [abierto])

  function elegir(id: number) {
    alElegir(id)
    setAbierto(false)
  }

  return (
    <div>
      <span className="mb-2 block text-menuda font-medium text-tinta2">{etiqueta}</span>

      {!muchas ? (
        <div className={columnas === 2 ? 'grid gap-1.5 sm:grid-cols-2' : 'flex flex-wrap gap-1.5'}>
          {opciones.map((o) => (
            <BotonOpcion key={o.id} opcion={o} elegida={o.id === valor} onClick={() => alElegir(o.id)} />
          ))}
        </div>
      ) : abierto ? (
        <div className="rounded-pieza border border-accion bg-hoja">
          <div className="relative border-b border-linea">
            <IconoBuscar
              tam={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta3"
            />
            <input
              ref={campo}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={textoBuscar}
              aria-label={textoBuscar}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  setAbierto(false)
                } else if (e.key === 'Enter' && filtradas.length > 0) {
                  e.preventDefault()
                  elegir(filtradas[0].id)
                }
              }}
              className="h-[44px] w-full rounded-t-pieza bg-transparent pl-10 pr-3 placeholder:text-tinta3 focus:outline-none"
            />
          </div>

          <ul className="max-h-[220px] overflow-y-auto py-1" role="listbox">
            {filtradas.length === 0 ? (
              <li className="px-3 py-4 text-center text-menuda text-tinta2">
                Nada coincide con “{busqueda}”.
              </li>
            ) : (
              filtradas.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={o.id === valor}
                    onClick={() => elegir(o.id)}
                    className="flex min-h-[44px] w-full items-center gap-2.5 px-3 text-left transition-colors duration-150 hover:bg-hoja2"
                  >
                    {o.color && (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: o.color }}
                        aria-hidden
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate">{o.etiqueta}</span>
                    {o.detalle && (
                      <span
                        className={`shrink-0 text-menuda text-tinta2 ${o.detalleNumerico ? 'cifra' : ''}`}
                      >
                        {o.detalle}
                      </span>
                    )}
                    {o.id === valor && <IconoCheque tam={17} className="shrink-0 text-accion" />}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="border-t border-linea px-2 py-1.5">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-pieza px-3 text-menuda text-tinta2 transition-colors hover:bg-[rgba(36,31,27,0.05)] hover:text-tinta"
            >
              <IconoVolver tam={15} />
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-invalid={problema ? true : undefined}
          className={[
            'flex min-h-[46px] w-full items-center gap-2.5 rounded-pieza px-3 text-left',
            'border transition-colors duration-150 active:scale-[0.995]',
            problema ? 'border-accion' : 'border-lineaFuerte hover:border-tinta3',
          ].join(' ')}
        >
          {elegida ? (
            <>
              {elegida.color && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: elegida.color }}
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1 truncate">{elegida.etiqueta}</span>
              {elegida.detalle && (
                <span
                  className={`shrink-0 truncate text-menuda text-tinta2 ${elegida.detalleNumerico ? 'cifra' : ''}`}
                >
                  {elegida.detalle}
                </span>
              )}
            </>
          ) : (
            <span className="flex-1 text-tinta3">Elegir…</span>
          )}
          <span className="shrink-0 text-menuda text-tinta2">Cambiar</span>
        </button>
      )}

      {problema ? (
        <p className="mt-1.5 text-menuda text-accion">{problema}</p>
      ) : ayuda ? (
        <p className="mt-1.5 text-menuda text-tinta2">{ayuda}</p>
      ) : null}
    </div>
  )
}

function BotonOpcion({
  opcion,
  elegida,
  onClick,
}: {
  opcion: Opcion
  elegida: boolean
  onClick: () => void
}) {
  // Con detalle (un precio) el botón crece a dos líneas para que el número se
  // lea igual de bien que el nombre: elegir el cupo ES elegir el precio.
  if (opcion.detalle) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={elegida}
        className={[
          'flex min-h-[58px] flex-col justify-center rounded-pieza px-3.5 py-2 text-left',
          'border transition-colors duration-150 active:scale-[0.99]',
          elegida
            ? 'border-accion bg-[rgba(138,51,64,0.07)]'
            : 'border-lineaFuerte hover:border-tinta3 hover:bg-hoja2',
        ].join(' ')}
      >
        <span className={`text-menuda font-medium leading-snug ${elegida ? 'text-accion' : 'text-tinta'}`}>
          {opcion.etiqueta}
        </span>
        <span
          className={[
            'mt-0.5 truncate',
            opcion.detalle && opcion.detalleNumerico ? 'cifra font-semibold' : 'text-menuda',
            elegida ? 'text-accion' : 'text-tinta2',
          ].join(' ')}
        >
          {opcion.detalle}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={elegida}
      className={[
        'inline-flex min-h-[46px] items-center gap-2 rounded-pieza px-3 text-menuda font-medium',
        'border transition-colors duration-150 active:scale-[0.98]',
        elegida
          ? 'border-accion bg-[rgba(138,51,64,0.08)] text-accion'
          : 'border-lineaFuerte text-tinta2 hover:border-tinta3',
      ].join(' ')}
    >
      {opcion.color && (
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: opcion.color }} aria-hidden />
      )}
      {opcion.etiqueta}
    </button>
  )
}
