import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Categoria, Conteos, Evento, Iglesia, PersonaEnLista } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { proporcionPagada, type Estado } from '../lib/estados'
import {
  Boton,
  Campo,
  ChipEstado,
  EstadoVacio,
  EtiquetaIglesia,
  Monto,
  colorIglesia,
} from '../components/Piezas'
import { Dialogo } from '../components/Dialogo'
import { IconoBuscar, IconoMas } from '../components/Iconos'

type Orden = 'nombre' | 'menos_pagado' | 'recientes'

const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: 'nombre', texto: 'Por nombre' },
  { valor: 'menos_pagado', texto: 'Los que más deben' },
  { valor: 'recientes', texto: 'Agregados hace poco' },
]

export default function Personas() {
  const [params, setParams] = useSearchParams()
  const [personas, setPersonas] = useState<PersonaEnLista[]>([])
  const [conteos, setConteos] = useState<Conteos | null>(null)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [evento, setEvento] = useState<Evento | null>(null)
  const [cargando, setCargando] = useState(true)
  const [nuevaAbierta, setNuevaAbierta] = useState(params.get('nueva') === '1')

  const [buscar, setBuscar] = useState('')
  const [iglesia, setIglesia] = useState<number | undefined>()
  const [categoriaId, setCategoriaId] = useState<number | undefined>()
  const [estado, setEstado] = useState<Estado | undefined>()
  const [orden, setOrden] = useState<Orden>('nombre')

  const campoBuscar = useRef<HTMLInputElement>(null)

  const cargar = useCallback(async () => {
    const [r, gs, ev] = await Promise.all([
      api.personas({ buscar, iglesia, categoria_id: categoriaId, estado, orden }),
      api.iglesias(),
      api.eventoActivo(),
    ])
    setPersonas(r.personas)
    setConteos(r.conteos)
    setIglesias(gs.filter((g) => !g.archivada))
    setEvento(ev)
  }, [buscar, iglesia, categoriaId, estado, orden])

  useEffect(() => {
    setCargando(true)
    const t = setTimeout(() => {
      cargar()
        .catch((e) => toast.error(e.message))
        .finally(() => setCargando(false))
    }, buscar ? 90 : 0)
    return () => clearTimeout(t)
  }, [cargar, buscar])

  useEffect(() => {
    campoBuscar.current?.focus()
  }, [])

  // Las categorías archivadas solo se muestran si alguien inscrito todavía las usa.
  const categoriasVisibles = (evento?.categorias ?? []).filter(
    (c) => !c.archivada || (conteos?.categoria?.[c.id] ?? 0) > 0,
  )

  const hayFiltro = Boolean(iglesia || categoriaId || estado || buscar)

  function limpiar() {
    setIglesia(undefined)
    setCategoriaId(undefined)
    setEstado(undefined)
    setBuscar('')
    campoBuscar.current?.focus()
  }

  function cerrarNueva() {
    setNuevaAbierta(false)
    if (params.get('nueva')) {
      params.delete('nueva')
      setParams(params, { replace: true })
    }
  }

  return (
    <div className="entra-hoja">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-titulo font-semibold">Personas</h1>
          <p className="mt-0.5 text-tinta2">
            {conteos ? (
              <>
                <span className="cifra">{personas.length}</span>
                {hayFiltro ? ` de ${conteos.total}` : personas.length === 1 ? ' persona' : ' personas'}
                {hayFiltro && ' con estos filtros'}
              </>
            ) : (
              ' '
            )}
          </p>
        </div>
        <Boton variante="principal" icono={<IconoMas tam={19} />} onClick={() => setNuevaAbierta(true)}>
          Agregar persona
        </Boton>
      </header>

      <div className="hoja mb-4 p-4">
        <div className="relative">
          <IconoBuscar
            tam={20}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta3"
          />
          <input
            ref={campoBuscar}
            type="search"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar por nombre…"
            aria-label="Buscar persona por nombre"
            className="w-full rounded-pieza border border-lineaFuerte bg-hoja2 py-2.5 pl-11 pr-4 text-guia transition-colors duration-150 placeholder:text-tinta3 focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(138,51,64,0.18)]"
          />
        </div>

        <div className="mt-3 space-y-2">
          <FilaChips rotulo="Cómo va">
            {(['pagado', 'abonando', 'sinpagos'] as Estado[]).map((e) => (
              <Chip
                key={e}
                activo={estado === e}
                cuenta={conteos?.estado?.[e]}
                onClick={() => setEstado(estado === e ? undefined : e)}
              >
                {e === 'pagado' ? 'Pagado' : e === 'abonando' ? 'Abonando' : 'Sin pagos'}
              </Chip>
            ))}
          </FilaChips>

          {categoriasVisibles.length > 0 && (
            <FilaChips rotulo="Tipo de cupo">
              {categoriasVisibles.map((c) => (
                <Chip
                  key={c.id}
                  activo={categoriaId === c.id}
                  cuenta={conteos?.categoria?.[c.id] ?? 0}
                  onClick={() => setCategoriaId(categoriaId === c.id ? undefined : c.id)}
                >
                  {c.nombre}
                </Chip>
              ))}
            </FilaChips>
          )}

          {iglesias.length > 0 && (
            <FilaChips rotulo="Iglesia">
              {iglesias.map((g) => (
                <Chip
                  key={g.id}
                  activo={iglesia === g.id}
                  cuenta={conteos?.iglesia?.[g.id] ?? 0}
                  color={colorIglesia(g.color)}
                  onClick={() => setIglesia(iglesia === g.id ? undefined : g.id)}
                >
                  {g.nombre}
                </Chip>
              ))}
            </FilaChips>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-linea pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rotulo mr-1">Orden</span>
            {ORDENES.map((o) => (
              <button
                key={o.valor}
                type="button"
                onClick={() => setOrden(o.valor)}
                aria-pressed={orden === o.valor}
                className={[
                  'min-h-[36px] rounded-full px-3 text-menuda font-medium transition-colors duration-150',
                  orden === o.valor
                    ? 'bg-[rgba(36,31,27,0.08)] text-tinta'
                    : 'text-tinta2 hover:bg-[rgba(36,31,27,0.05)] hover:text-tinta',
                ].join(' ')}
              >
                {o.texto}
              </button>
            ))}
          </div>
          {hayFiltro && (
            <Boton variante="texto" onClick={limpiar} className="!min-h-[36px] !px-3 text-menuda">
              Quitar filtros
            </Boton>
          )}
        </div>
      </div>

      <div className="hoja overflow-hidden">
        <div className="margen-rubrica hidden border-b border-lineaFuerte px-5 py-2 sm:flex">
          <span className="rotulo w-[44px] shrink-0">#</span>
          <span className="rotulo flex-1 pl-4">Nombre</span>
          <span className="rotulo w-[178px] shrink-0 text-right">Pagado de</span>
          <span className="rotulo w-[126px] shrink-0 pl-4">Cómo va</span>
        </div>

        {cargando && personas.length === 0 ? (
          <ListaEsqueleto />
        ) : personas.length === 0 ? (
          hayFiltro ? (
            <EstadoVacio
              titulo="No encontré a nadie así"
              explicacion="Prueba con menos filtros, o escribe solo el primer nombre. No hace falta poner tildes."
              accion={<Boton onClick={limpiar}>Quitar filtros</Boton>}
            />
          ) : (
            <EstadoVacio
              titulo="Todavía no hay personas"
              explicacion="Agrega a la primera persona con su iglesia y su tipo de cupo. La app le lleva la cuenta desde el primer abono."
              accion={
                <Boton variante="principal" grande onClick={() => setNuevaAbierta(true)}>
                  Agregar la primera persona
                </Boton>
              }
            />
          )
        ) : (
          <ul className="margen-rubrica">
            {personas.map((p, i) => (
              <li key={p.id} style={{ ['--i' as string]: Math.min(i, 12) }} className="entra-renglon renglon">
                <Link
                  to={`/personas/${p.id}`}
                  className="flex min-h-[62px] items-center px-5 py-2.5 transition-colors duration-150 hover:bg-[rgba(138,51,64,0.05)]"
                >
                  <span className="cifra hidden w-[44px] shrink-0 text-menuda text-tinta3 sm:block">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 sm:pl-4">
                    <span className="block truncate font-medium">{p.nombre}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      <EtiquetaIglesia nombre={p.iglesia} color={p.iglesia_color} />
                      {p.categoria && <span className="text-menuda text-tinta3">{p.categoria}</span>}
                    </span>
                  </span>
                  <span className="w-[178px] shrink-0 text-right">
                    {p.inscripcion_id ? (
                      <>
                        <span className="block">
                          <Monto centavos={p.pagado} className="font-medium" />
                          <span className="cifra text-menuda text-tinta2"> / {formatoRD(p.precio)}</span>
                        </span>
                        <span
                          className="mt-1.5 ml-auto block h-1 w-[92px] overflow-hidden rounded-full"
                          style={{ background: 'var(--linea)' }}
                          aria-hidden
                        >
                          <span
                            className="block h-full origin-left rounded-full transition-transform duration-[420ms] ease-salida"
                            style={{
                              background: `var(--${p.estado}-marca)`,
                              transform: `scaleX(${proporcionPagada(p.pagado, p.precio)})`,
                            }}
                          />
                        </span>
                      </>
                    ) : (
                      <span className="text-menuda text-tinta3">Sin inscribir</span>
                    )}
                  </span>
                  <span className="hidden w-[126px] shrink-0 pl-4 sm:block">
                    <ChipEstado estado={p.estado} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DialogoNuevaPersona
        abierto={nuevaAbierta}
        alCerrar={cerrarNueva}
        iglesias={iglesias}
        evento={evento}
        alGuardar={() => {
          cerrarNueva()
          cargar()
        }}
      />
    </div>
  )
}

function FilaChips({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="rotulo mr-1 w-[86px] shrink-0">{rotulo}</span>
      {children}
    </div>
  )
}

function Chip({
  activo,
  cuenta,
  color,
  onClick,
  children,
}: {
  activo: boolean
  cuenta?: number
  color?: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={[
        'inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-menuda font-medium',
        'border transition-colors duration-150 active:scale-[0.98]',
        activo
          ? 'border-accion bg-[rgba(138,51,64,0.09)] text-accion'
          : 'border-linea text-tinta2 hover:border-lineaFuerte hover:bg-hoja2 hover:text-tinta',
      ].join(' ')}
    >
      {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />}
      <span className="max-w-[24ch] truncate">{children}</span>
      {cuenta !== undefined && (
        <span className={`cifra text-micro ${activo ? 'text-accion' : 'text-tinta3'}`}>{cuenta}</span>
      )}
    </button>
  )
}

function ListaEsqueleto() {
  return (
    <ul aria-busy="true" aria-label="Cargando personas">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="renglon flex min-h-[62px] items-center gap-4 px-5 py-3">
          <span className="h-4 flex-1 animate-pulse rounded bg-linea" style={{ maxWidth: 220 }} />
          <span className="h-4 w-28 animate-pulse rounded bg-linea" />
        </li>
      ))}
    </ul>
  )
}

// ── Agregar persona ───────────────────────────────────────────────────────

function DialogoNuevaPersona({
  abierto,
  alCerrar,
  iglesias,
  evento,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  iglesias: Iglesia[]
  evento: Evento | null
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [iglesiaId, setIglesiaId] = useState<number | undefined>()
  const [categoriaId, setCategoriaId] = useState<number | undefined>()
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const categorias = (evento?.categorias ?? []).filter((c) => !c.archivada)

  useEffect(() => {
    if (!abierto) return
    setNombre('')
    setIglesiaId(iglesias.length === 1 ? iglesias[0].id : undefined)
    setCategoriaId(undefined)
    setTelefono('')
    setNotas('')
    setProblema(null)
  }, [abierto, iglesias])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Escribe el nombre completo de la persona.')
      return
    }
    if (evento && categorias.length > 0 && !categoriaId) {
      setProblema('Elige el tipo de cupo.')
      return
    }

    setGuardando(true)
    try {
      const r = await api.crearPersona({
        nombre: nombre.trim(),
        iglesia_id: iglesiaId,
        categoria_id: categoriaId,
        telefono: telefono || undefined,
        notas: notas || undefined,
      })
      toast.success(`${nombre.trim()} quedó agregada`, {
        description: r.aviso_repetida
          ? `Ojo: ya había alguien llamado "${r.aviso_repetida}". Revisa que no esté repetida.`
          : 'Ya puedes registrarle un pago.',
      })
      alGuardar()
    } catch (err) {
      const mensaje = err instanceof ErrorDeTesorera ? err.message : 'No pude guardar la persona.'
      setProblema(mensaje)
    } finally {
      setGuardando(false)
    }
  }

  const sinCategorias = Boolean(evento) && categorias.length === 0

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="Agregar persona" ancho={520}>
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="Nombre completo"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value)
            setProblema(null)
          }}
          placeholder="María Altagracia Pérez"
          autoFocus
        />

        {iglesias.length > 0 && (
          <div>
            <span className="mb-1.5 block text-menuda font-medium text-tinta2">¿De qué iglesia es?</span>
            <div className="flex flex-wrap gap-1.5">
              {iglesias.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setIglesiaId(iglesiaId === g.id ? undefined : g.id)}
                  aria-pressed={iglesiaId === g.id}
                  className={[
                    'inline-flex min-h-[44px] items-center gap-2 rounded-pieza px-3 text-menuda font-medium',
                    'border transition-colors duration-150 active:scale-[0.98]',
                    iglesiaId === g.id
                      ? 'border-accion bg-[rgba(138,51,64,0.08)] text-accion'
                      : 'border-lineaFuerte text-tinta2 hover:border-tinta3',
                  ].join(' ')}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: colorIglesia(g.color) }}
                    aria-hidden
                  />
                  {g.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {sinCategorias ? (
          <p className="rounded-pieza bg-[var(--abonando-fondo)] px-3 py-2.5 text-menuda text-[var(--abonando-tinta)]">
            Este evento todavía no tiene tipos de cupo. Créalos en Ajustes y después vuelve aquí.
          </p>
        ) : (
          categorias.length > 0 && (
            <div>
              <span className="mb-1.5 block text-menuda font-medium text-tinta2">¿Qué tipo de cupo?</span>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {categorias.map((c) => (
                  <BotonCategoria
                    key={c.id}
                    categoria={c}
                    elegida={categoriaId === c.id}
                    onClick={() => {
                      setCategoriaId(c.id)
                      setProblema(null)
                    }}
                  />
                ))}
              </div>
            </div>
          )
        )}

        <details className="group">
          <summary className="cursor-pointer list-none text-menuda font-medium text-tinta2 transition-colors hover:text-tinta">
            <span className="inline-flex min-h-[36px] items-center gap-1.5">
              <span className="text-tinta3 transition-transform duration-150 group-open:rotate-90">›</span>
              Teléfono y notas (opcional)
            </span>
          </summary>
          <div className="mt-2 space-y-3">
            <Campo
              etiqueta="Teléfono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="809-000-0000"
            />
            <Campo
              etiqueta="Notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Lo que quieras recordar de esta persona"
            />
          </div>
        </details>

        {problema && <p className="text-menuda text-accion">{problema}</p>}

        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            Guardar persona
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

/** Botón grande de tipo de cupo: se ve el nombre y el precio a la vez. */
export function BotonCategoria({
  categoria,
  elegida,
  onClick,
}: {
  categoria: Categoria
  elegida: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={elegida}
      className={[
        'flex min-h-[62px] flex-col justify-center rounded-pieza px-3.5 py-2.5 text-left',
        'border transition-colors duration-150 active:scale-[0.99]',
        elegida
          ? 'border-accion bg-[rgba(138,51,64,0.07)]'
          : 'border-lineaFuerte hover:border-tinta3 hover:bg-hoja2',
      ].join(' ')}
    >
      <span className={`text-menuda font-medium leading-snug ${elegida ? 'text-accion' : 'text-tinta'}`}>
        {categoria.nombre}
      </span>
      <span className={`cifra mt-0.5 font-semibold ${elegida ? 'text-accion' : 'text-tinta2'}`}>
        {formatoRD(categoria.precio)}
      </span>
    </button>
  )
}
