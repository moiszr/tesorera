import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Evento, Iglesia, PersonaEnLista } from '../api/tipos'
import { aCentavos, formatoRD } from '../lib/dinero'
import { fechaLarga, hoyISO, normalizar } from '../lib/fechas'
import { calcularEstado } from '../lib/estados'
import { BarraProgreso, Boton, Campo, ChipEstado, EtiquetaIglesia, Monto } from '../components/Piezas'
import { DialogoPersona } from '../components/DialogoPersona'
import { IconoAdelante, IconoBuscar, IconoCheque, IconoImprimir, IconoMas } from '../components/Iconos'

const METODOS = [
  { valor: 'efectivo', texto: 'Efectivo' },
  { valor: 'transferencia', texto: 'Transferencia' },
  { valor: 'otro', texto: 'Otro' },
]

type Guardado = {
  pagoId: number
  nombre: string
  personaId: number
  monto: number
  antes: number
  precio: number
  ahora: number
}

/**
 * EL flujo de la app. Tres acciones y nada más:
 *   1. escribir el nombre y elegir a la persona
 *   2. escribir el monto
 *   3. Guardar
 * Al terminar queda listo para el siguiente, porque los domingos vienen en fila.
 */
export default function RegistrarPago() {
  const [params] = useSearchParams()
  const personaPedida = params.get('persona')

  const [todas, setTodas] = useState<PersonaEnLista[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [resaltado, setResaltado] = useState(0)
  const [elegida, setElegida] = useState<PersonaEnLista | null>(null)

  const [monto, setMonto] = useState('')
  const [metodo, setMetodo] = useState('efectivo')
  const [fecha, setFecha] = useState(hoyISO())
  const [nota, setNota] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [ultimo, setUltimo] = useState<Guardado | null>(null)
  // Arranca en el valor viejo y sube al nuevo: así la barra se ve crecer.
  const [progresoAnimado, setProgresoAnimado] = useState(0)
  const [creando, setCreando] = useState(false)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [evento, setEvento] = useState<Evento | null>(null)

  const campoBusqueda = useRef<HTMLInputElement>(null)
  const campoMonto = useRef<HTMLInputElement>(null)

  async function cargar() {
    const { personas } = await api.personas({})
    setTodas(personas.filter((p) => p.inscripcion_id != null))
  }

  useEffect(() => {
    Promise.all([api.iglesias(), api.eventoActivo()])
      .then(([gs, ev]) => {
        setIglesias(gs.filter((g) => !g.archivada))
        setEvento(ev)
      })
      .catch(() => {})
  }, [])

  /**
   * Alguien llegó a pagar y todavía no está inscrito. Se crea desde aquí, con
   * el nombre que ya se escribió en el buscador, y al guardar queda elegida
   * con el cursor en el monto: la fila no se detiene.
   */
  async function trasCrearPersona(creada: { id: number }) {
    setCreando(false)
    const { personas } = await api.personas({})
    const lista = personas.filter((p) => p.inscripcion_id != null)
    setTodas(lista)
    const nueva = lista.find((p) => p.id === creada.id)
    if (nueva) elegir(nueva)
    else setBusqueda('')
  }

  useEffect(() => {
    cargar().catch((e) => toast.error(e.message))
  }, [])

  useEffect(() => {
    if (!personaPedida || todas.length === 0 || elegida) return
    const p = todas.find((x) => x.id === Number(personaPedida))
    if (p) elegir(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaPedida, todas])

  useEffect(() => {
    if (!elegida) campoBusqueda.current?.focus()
  }, [elegida])

  const resultados = useMemo(() => {
    const t = normalizar(busqueda)
    if (t.length < 1) return []
    return todas.filter((p) => normalizar(p.nombre).includes(t)).slice(0, 7)
  }, [busqueda, todas])

  useEffect(() => setResaltado(0), [busqueda])

  function elegir(p: PersonaEnLista) {
    setElegida(p)
    setBusqueda('')
    setMonto('')
    setNota('')
    setProblema(null)
    setUltimo(null)
    requestAnimationFrame(() => campoMonto.current?.focus())
  }

  function volverABuscar() {
    setElegida(null)
    setMonto('')
    setProblema(null)
    requestAnimationFrame(() => campoBusqueda.current?.focus())
  }

  const hayPagos = todas.some((p) => p.pagado > 0)
  const hayPanel = ultimo !== null || !hayPagos
  const centavos = aCentavos(monto)
  const balanceDespues = elegida && centavos !== null ? elegida.balance - centavos : null

  async function guardar(e?: React.FormEvent) {
    e?.preventDefault()
    if (!elegida) return

    const valor = aCentavos(monto)
    if (valor === null || valor <= 0) {
      setProblema('Escribe cuánto está abonando, por ejemplo 1,000.')
      campoMonto.current?.focus()
      return
    }

    setGuardando(true)
    setProblema(null)
    try {
      const { id, ficha } = await api.registrarPago({
        inscripcion_id: elegida.inscripcion_id,
        monto: valor,
        fecha,
        metodo,
        nota: nota || undefined,
      })

      const guardado: Guardado = {
        pagoId: id,
        nombre: elegida.nombre,
        personaId: elegida.id,
        monto: valor,
        antes: elegida.pagado,
        precio: ficha.cuenta.precio,
        ahora: ficha.cuenta.pagado,
      }

      // La barra parte de donde estaba y crece: el pago se ve entrar.
      setUltimo(guardado)
      setProgresoAnimado(guardado.antes)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setProgresoAnimado(guardado.ahora)),
      )

      toast.success(`${formatoRD(valor)} de ${elegida.nombre}`, {
        description:
          ficha.cuenta.balance > 0
            ? `Le faltan ${formatoRD(ficha.cuenta.balance)}.`
            : 'Quedó pagado completo.',
        duration: 8000,
        action: {
          label: 'Deshacer',
          onClick: () => {
            api
              .anularPago(id, 'Deshecho al momento de registrarlo')
              .then(() => {
                toast.success('Pago deshecho', {
                  description: 'Quedó tachado en el historial y el saldo se corrigió.',
                })
                setUltimo((u) => (u && u.pagoId === id ? null : u))
                cargar()
              })
              .catch(() => toast.error('No pude deshacer el pago. Anúlalo desde su ficha.'))
          },
        },
      })

      // Listo para el siguiente de la fila, sin tocar nada.
      setElegida(null)
      setMonto('')
      setNota('')
      setMetodo('efectivo')
      requestAnimationFrame(() => campoBusqueda.current?.focus())
      cargar()
    } catch (err) {
      const mensaje = err instanceof ErrorDeTesorera ? err.message : 'No pude guardar el pago.'
      setProblema(mensaje)
      toast.error(mensaje)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="entra-hoja">
      <div className={hayPanel ? 'mb-5' : 'mx-auto mb-5 max-w-[680px]'}>
        <h1 className="text-titulo font-semibold">Registrar pago</h1>
        <p className="mt-0.5 text-tinta2">
          {elegida ? 'Escribe cuánto está abonando.' : 'Escribe el nombre de quien está pagando.'}
        </p>
      </div>

      <div
        className={
          hayPanel
            ? 'grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]'
            : 'mx-auto max-w-[680px]'
        }
      >
        <div className="hoja overflow-hidden">
          {!elegida ? (
            <BuscadorPersona
              ref={campoBusqueda}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              resultados={resultados}
              resaltado={resaltado}
              setResaltado={setResaltado}
              alElegir={elegir}
              hayPersonas={todas.length > 0}
              alCrear={() => setCreando(true)}
            />
          ) : (
            <form onSubmit={guardar} className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-linea pb-4">
                <div className="min-w-0">
                  <p className="truncate text-guia font-semibold">{elegida.nombre}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <EtiquetaIglesia nombre={elegida.iglesia} color={elegida.iglesia_color} />
                    <span className="text-menuda text-tinta2">{elegida.categoria}</span>
                  </div>
                </div>
                <Boton type="button" variante="texto" onClick={volverABuscar}>
                  Cambiar
                </Boton>
              </div>

              <div className="mb-4 flex items-baseline justify-between gap-3">
                <span className="rotulo">Le falta</span>
                <Monto centavos={elegida.balance} tam="cifra" />
              </div>

              <label htmlFor="monto" className="mb-1.5 block text-menuda font-medium text-tinta2">
                ¿Cuánto está abonando?
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-guia font-medium text-tinta2">
                  RD$
                </span>
                <input
                  ref={campoMonto}
                  id="monto"
                  inputMode="decimal"
                  autoComplete="off"
                  value={monto}
                  onChange={(e) => {
                    setMonto(e.target.value)
                    setProblema(null)
                  }}
                  placeholder="0"
                  aria-invalid={problema ? true : undefined}
                  className={[
                    'cifra w-full rounded-pieza bg-hoja2 py-3 pl-[4.2rem] pr-4 text-cifraGrande font-semibold',
                    'border transition-colors duration-150',
                    problema ? 'border-accion' : 'border-lineaFuerte',
                    'focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(99,91,255,0.18)]',
                    'placeholder:text-tinta3',
                  ].join(' ')}
                />
              </div>
              {problema && <p className="mt-2 text-menuda text-accionTexto">{problema}</p>}

              <div className="mt-3 flex flex-wrap gap-2">
                {[50000, 100000, 200000].map((c) => (
                  <Boton
                    key={c}
                    type="button"
                    variante="contorno"
                    onClick={() => {
                      setMonto(String(c / 100))
                      setProblema(null)
                      campoMonto.current?.focus()
                    }}
                  >
                    <span className="cifra">{formatoRD(c)}</span>
                  </Boton>
                ))}
                {elegida.balance > 0 && (
                  <Boton
                    type="button"
                    variante="suave"
                    onClick={() => {
                      setMonto(String(elegida.balance / 100))
                      setProblema(null)
                      campoMonto.current?.focus()
                    }}
                  >
                    Saldar: <span className="cifra">{formatoRD(elegida.balance)}</span>
                  </Boton>
                )}
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <span className="mb-2 block text-menuda font-medium text-tinta2">¿Cómo pagó?</span>
                  <div className="flex gap-1.5" role="group" aria-label="Forma de pago">
                    {METODOS.map((m) => (
                      <button
                        key={m.valor}
                        type="button"
                        onClick={() => setMetodo(m.valor)}
                        aria-pressed={metodo === m.valor}
                        className={[
                          'min-h-[46px] flex-1 rounded-pieza px-2 text-menuda font-medium',
                          'border transition-colors duration-150 active:scale-[0.98]',
                          metodo === m.valor
                            ? 'border-accion bg-[rgba(99,91,255,0.10)] text-accionTexto'
                            : 'border-lineaFuerte text-tinta2 hover:border-tinta3',
                        ].join(' ')}
                      >
                        {m.texto}
                      </button>
                    ))}
                  </div>
                </div>
                <CampoFecha fecha={fecha} setFecha={setFecha} />
              </div>

              <div className="mt-6">
                <Campo
                  etiqueta="Nota (si hace falta)"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Por ejemplo: lo entregó su hija"
                />
              </div>

              <div className="mt-7 border-t border-linea pt-5">
                {centavos !== null && centavos > 0 && (
                  <p className="mb-3 text-tinta2">
                    <span className="font-medium text-tinta">{elegida.nombre}</span> abona{' '}
                    <span className="cifra font-medium text-tinta">{formatoRD(centavos)}</span>
                    {balanceDespues !== null && balanceDespues > 0 ? (
                      <>
                        {' · '}le faltarán{' '}
                        <span className="cifra font-medium text-tinta">{formatoRD(balanceDespues)}</span>
                      </>
                    ) : (
                      <> · queda pagado completo</>
                    )}
                  </p>
                )}
                <Boton type="submit" variante="principal" grande cargando={guardando} className="w-full">
                  Guardar pago
                </Boton>
              </div>
            </form>
          )}
        </div>

        {hayPanel && (
        <aside className="min-w-0">
          {ultimo ? (
            <ReciboUltimo guardado={ultimo} progreso={progresoAnimado} />
          ) : (
            hayPagos ? null : (
            <div className="hoja p-5">
              <p className="rotulo mb-2">Cómo se hace</p>
              <ol className="space-y-2.5 text-menuda text-tinta2">
                <li className="flex gap-2.5">
                  <PasoNumero n={1} />
                  <span>Escribe el nombre y presiona Enter sobre la persona.</span>
                </li>
                <li className="flex gap-2.5">
                  <PasoNumero n={2} />
                  <span>Escribe cuánto abona, o toca uno de los montos rápidos.</span>
                </li>
                <li className="flex gap-2.5">
                  <PasoNumero n={3} />
                  <span>Guardar. Queda listo para el siguiente sin hacer nada más.</span>
                </li>
              </ol>
            </div>
            )
          )}
        </aside>
        )}
      </div>

      <DialogoPersona
        abierto={creando}
        alCerrar={() => setCreando(false)}
        iglesias={iglesias}
        evento={evento}
        personas={todas}
        nombreInicial={busqueda.trim()}
        alGuardar={trasCrearPersona}
      />
    </div>
  )
}

/**
 * La fecha se muestra escrita en español ("Hoy, 16 de agosto de 2026"), no en
 * el formato del navegador: un 08/16/2026 en una app en español se lee mal y
 * se presta a confundir el día con el mes. El calendario del navegador solo
 * aparece cuando ella toca "Cambiar".
 */
function CampoFecha({ fecha, setFecha }: { fecha: string; setFecha: (v: string) => void }) {
  const [editando, setEditando] = useState(false)
  const esHoy = fecha === hoyISO()

  return (
    <div>
      <span className="mb-2 block text-menuda font-medium text-tinta2">¿Qué día pagó?</span>
      {editando ? (
        <input
          type="date"
          value={fecha}
          autoFocus
          onChange={(e) => setFecha(e.target.value)}
          onBlur={() => setEditando(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()
              setEditando(false)
            }
          }}
          aria-label="Fecha del pago"
          className="w-full min-h-[46px] rounded-pieza border border-accion bg-hoja px-3 focus:outline-none focus:ring-2 focus:ring-[rgba(99,91,255,0.18)]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="flex min-h-[46px] w-full items-center justify-between gap-2 rounded-pieza border border-lineaFuerte bg-hoja px-3 text-left transition-colors duration-150 hover:border-tinta3 active:scale-[0.99]"
        >
          <span className="truncate">
            {esHoy && <span className="font-medium">Hoy, </span>}
            {fechaLarga(fecha)}
          </span>
          <span className="shrink-0 text-menuda text-tinta2">Cambiar</span>
        </button>
      )}
    </div>
  )
}

function PasoNumero({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="cifra mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hoja2 text-micro font-semibold text-tinta2 ring-1 ring-linea"
    >
      {n}
    </span>
  )
}

/** El comprobante del pago que se acaba de guardar. Aquí crece la barra. */
function ReciboUltimo({ guardado, progreso }: { guardado: Guardado; progreso: number }) {
  const falta = Math.max(0, guardado.precio - guardado.ahora)
  const estado = calcularEstado(guardado.ahora, guardado.precio)

  return (
    <div className="hoja entra-hoja overflow-hidden">
      <div className="flex items-center gap-2 border-b border-linea bg-[var(--pagado-fondo)] px-5 py-3 text-[var(--pagado-tinta)]">
        <IconoCheque tam={18} />
        <span className="font-medium">Pago guardado</span>
      </div>

      <div className="p-5">
        <p className="truncate text-guia font-semibold">{guardado.nombre}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="rotulo">Abonó</span>
          <Monto centavos={guardado.monto} tam="cifra" />
        </div>

        <div className="mt-4">
          <BarraProgreso
            pagado={progreso}
            precio={guardado.precio}
            estado={estado}
            alto={10}
            etiqueta={`Lleva pagado ${formatoRD(guardado.ahora)} de ${formatoRD(guardado.precio)}`}
          />
          <div className="mt-2 flex items-baseline justify-between text-menuda text-tinta2">
            <span>
              Lleva <span className="cifra font-medium text-tinta">{formatoRD(guardado.ahora)}</span>
            </span>
            <span>
              de <span className="cifra">{formatoRD(guardado.precio)}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-linea pt-4">
          <ChipEstado estado={estado} />
          {falta > 0 ? (
            <span className="text-menuda text-tinta2">
              Le faltan <span className="cifra font-medium text-tinta">{formatoRD(falta)}</span>
            </span>
          ) : (
            <span className="text-menuda text-tinta2">Completo</span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/comprobante/${guardado.pagoId}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pieza border border-lineaFuerte px-4 font-medium text-tinta transition-colors duration-150 hover:border-tinta3 hover:bg-hoja2 active:scale-[0.98]"
          >
            <IconoImprimir tam={18} />
            Comprobante para {primerNombre(guardado.nombre)}
          </Link>
          <Link
            to={`/personas/${guardado.personaId}`}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-pieza px-3 text-menuda text-tinta2 transition-colors hover:bg-[rgba(24,24,27,0.05)] hover:text-tinta"
          >
            Ver a {primerNombre(guardado.nombre)}
            <IconoAdelante tam={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function primerNombre(nombre: string) {
  return nombre.split(' ')[0]
}

// ── Buscador ──────────────────────────────────────────────────────────────

import { forwardRef } from 'react'

const BuscadorPersona = forwardRef<
  HTMLInputElement,
  {
    busqueda: string
    setBusqueda: (v: string) => void
    resultados: PersonaEnLista[]
    resaltado: number
    setResaltado: (n: number) => void
    alElegir: (p: PersonaEnLista) => void
    hayPersonas: boolean
    alCrear: () => void
  }
>(function BuscadorPersona(
  { busqueda, setBusqueda, resultados, resaltado, setResaltado, alElegir, hayPersonas, alCrear },
  ref,
) {
  return (
    <div>
      <div className="border-b border-linea p-5 pb-4">
        <label htmlFor="buscar-pago" className="mb-1.5 block text-menuda font-medium text-tinta2">
          ¿Quién está pagando?
        </label>
        <div className="relative">
          <IconoBuscar
            tam={20}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta3"
          />
          <input
            ref={ref}
            id="buscar-pago"
            type="search"
            autoComplete="off"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setResaltado(Math.min(resaltado + 1, resultados.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setResaltado(Math.max(resaltado - 1, 0))
              } else if (e.key === 'Enter' && resultados[resaltado]) {
                e.preventDefault()
                alElegir(resultados[resaltado])
              }
            }}
            placeholder="Escribe el nombre…"
            className="w-full rounded-pieza border border-lineaFuerte bg-hoja2 py-3 pl-11 pr-4 text-guia transition-colors duration-150 placeholder:text-tinta3 focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(99,91,255,0.18)]"
          />
        </div>
        <p className="mt-2 text-menuda text-tinta3">
          No hace falta poner tildes.
        </p>
      </div>

      {busqueda.trim() === '' ? (
        <div className="px-5 py-12 text-center text-tinta2">
          {hayPersonas ? (
            'Empieza a escribir un nombre y aparecerá aquí abajo.'
          ) : (
            <>
              Todavía no hay personas inscritas.{' '}
              <button type="button" onClick={alCrear} className="font-medium text-accionTexto underline">
                Agrega la primera
              </button>
              .
            </>
          )}
        </div>
      ) : resultados.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-tinta2">
            No hay nadie inscrito que se llame “
            <span className="font-medium text-tinta">{busqueda}</span>”.
          </p>
          <Boton variante="principal" className="mt-4" icono={<IconoMas tam={18} />} onClick={alCrear}>
            Agregar a “{busqueda.trim()}” y cobrarle
          </Boton>
        </div>
      ) : (
        <ul role="listbox" aria-label="Personas encontradas">
          {resultados.map((p, i) => (
            <li key={p.id} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
              <button
                type="button"
                role="option"
                aria-selected={i === resaltado}
                onMouseEnter={() => setResaltado(i)}
                onClick={() => alElegir(p)}
                className={[
                  'flex w-full min-h-[62px] items-center gap-3 px-5 py-3 text-left',
                  'transition-colors duration-150',
                  i === resaltado ? 'bg-[rgba(138,51,64,0.06)]' : 'hover:bg-hoja2',
                ].join(' ')}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{p.nombre}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2.5">
                    <EtiquetaIglesia nombre={p.iglesia} color={p.iglesia_color} />
                    <span className="text-menuda text-tinta3">{p.categoria}</span>
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  {p.balance > 0 ? (
                    <>
                      <span className="block text-menuda text-tinta2">Le faltan</span>
                      <Monto centavos={p.balance} tam="guia" />
                    </>
                  ) : (
                    // El estado viene calculado: no se asume "pagado" por tener
                    // balance 0, porque un cupo de precio 0 sin abonos también
                    // da balance 0 y ahí el estado es "Sin pagos".
                    <ChipEstado estado={p.estado} />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
