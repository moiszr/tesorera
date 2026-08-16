import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Conteos, Evento, Iglesia, Pastor, PersonaEnLista } from '../api/tipos'
import { NOMBRE_ESTADO, type Estado } from '../lib/estados'
import { normalizar } from '../lib/fechas'
import {
  Boton,
  ChipEstado,
  EstadoVacio,
  EtiquetaIglesia,
  Monto,
  colorIglesia,
} from '../components/Piezas'
import { DialogoPersona } from '../components/DialogoPersona'
import { IconoBuscar, IconoCerrar, IconoFiltro, IconoMas } from '../components/Iconos'

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
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [nombreParaCrear, setNombreParaCrear] = useState('')
  const [pastor, setPastor] = useState<string | undefined>()
  const [pastores, setPastores] = useState<Pastor[]>([])

  const campoBuscar = useRef<HTMLInputElement>(null)

  const cargar = useCallback(async () => {
    const [r, gs, ev, ps] = await Promise.all([
      api.personas({ buscar, iglesia, pastor, categoria_id: categoriaId, estado, orden }),
      api.iglesias(),
      api.eventoActivo(),
      api.pastores(),
    ])
    setPersonas(r.personas)
    setConteos(r.conteos)
    setIglesias(gs.filter((g) => !g.archivada))
    setEvento(ev)
    setPastores(ps)
  }, [buscar, iglesia, pastor, categoriaId, estado, orden])

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

  const cuantosFiltros = [iglesia, categoriaId, estado, pastor].filter(Boolean).length
  const hayFiltro = cuantosFiltros > 0 || Boolean(buscar)

  function limpiar() {
    setPastor(undefined)
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
        <Boton
          variante="principal"
          icono={<IconoMas tam={19} />}
          onClick={() => {
            setNombreParaCrear(buscar.trim())
            setNuevaAbierta(true)
          }}
        >
          Agregar persona
        </Boton>
      </header>

      {/* Buscar siempre a la vista; los filtros guardados detrás de un botón.
          Lo que ella hace veinte veces al día es buscar un nombre, no filtrar. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
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
            className="h-[46px] w-full rounded-pieza border border-linea bg-hoja pl-11 pr-4 text-guia transition-colors duration-150 placeholder:text-tinta3 focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(138,51,64,0.18)]"
          />
        </div>

        <Boton
          variante={filtrosAbiertos || cuantosFiltros > 0 ? 'suave' : 'contorno'}
          onClick={() => setFiltrosAbiertos((v) => !v)}
          aria-expanded={filtrosAbiertos}
          icono={<IconoFiltro tam={18} />}
        >
          Filtros
          {cuantosFiltros > 0 && <span className="cifra">({cuantosFiltros})</span>}
        </Boton>
      </div>

      {/* Con los filtros cerrados, lo que está filtrando sigue a la vista y se
          quita de a uno. Un filtro escondido que ella no ve es una lista que
          "perdió" gente. */}
      {!filtrosAbiertos && cuantosFiltros > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {estado && (
            <FiltroPuesto texto={NOMBRE_ESTADO[estado]} alQuitar={() => setEstado(undefined)} />
          )}
          {categoriaId && (
            <FiltroPuesto
              texto={categoriasVisibles.find((c) => c.id === categoriaId)?.nombre ?? ''}
              alQuitar={() => setCategoriaId(undefined)}
            />
          )}
          {pastor && (
            <FiltroPuesto texto={`Pastor ${pastor}`} alQuitar={() => setPastor(undefined)} />
          )}
          {iglesia && (
            <FiltroPuesto
              texto={iglesias.find((g) => g.id === iglesia)?.nombre ?? ''}
              color={colorIglesia(iglesias.find((g) => g.id === iglesia)?.color)}
              alQuitar={() => setIglesia(undefined)}
            />
          )}
          <button
            type="button"
            onClick={limpiar}
            className="ml-1 min-h-[44px] rounded-full px-3.5 text-menuda font-medium text-tinta2 transition-colors hover:bg-[rgba(36,31,27,0.05)] hover:text-tinta"
          >
            Quitar todos
          </button>
        </div>
      )}

      {filtrosAbiertos && (
        <div className="hoja entra-hoja mb-3 p-4">
          <div className="space-y-2">
            <FilaChips rotulo="Cómo va">
              {(['pagado', 'abonando', 'sinpagos'] as Estado[]).map((e) => (
                <Chip
                  key={e}
                  activo={estado === e}
                  cuenta={conteos?.estado?.[e]}
                  onClick={() => setEstado(estado === e ? undefined : e)}
                >
                  {NOMBRE_ESTADO[e]}
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

            {pastores.length > 0 && (
              <FilaChips rotulo="Pastor">
                {pastores.map((ps) => (
                  <Chip
                    key={ps.nombre}
                    activo={pastor === ps.nombre}
                    cuenta={conteos?.pastor?.[normalizar(ps.nombre)] ?? 0}
                    onClick={() => setPastor(pastor === ps.nombre ? undefined : ps.nombre)}
                  >
                    {ps.nombre}
                    {ps.iglesias > 1 && <span className="text-tinta3"> · {ps.iglesias} iglesias</span>}
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

            <FilaChips rotulo="Orden">
              {ORDENES.map((o) => (
                <Chip key={o.valor} activo={orden === o.valor} onClick={() => setOrden(o.valor)}>
                  {o.texto}
                </Chip>
              ))}
            </FilaChips>
          </div>

          {hayFiltro && (
            <div className="mt-3 border-t border-linea pt-3">
              <Boton variante="texto" onClick={limpiar} className="!min-h-[44px] !px-3 text-menuda">
                Quitar filtros
              </Boton>
            </div>
          )}
        </div>
      )}

      <div className="hoja overflow-hidden">
        <div className="hidden border-b border-linea px-5 py-2.5 sm:flex">
          <span className="rotulo min-w-[150px] flex-1">Nombre</span>
          <span className="rotulo hidden w-[220px] shrink-0 pr-4 xl:block">Iglesia</span>
          <span className="rotulo w-[112px] shrink-0 text-right">Ha pagado</span>
          <span className="rotulo hidden w-[112px] shrink-0 text-right md:block">Su cupo</span>
          <span className="rotulo w-[128px] shrink-0 pl-5">Cómo va</span>
        </div>

        {cargando && personas.length === 0 ? (
          <ListaEsqueleto />
        ) : personas.length === 0 ? (
          hayFiltro ? (
            <EstadoVacio
              titulo={buscar.trim() ? `No hay nadie llamado “${buscar.trim()}”` : 'No encontré a nadie así'}
              explicacion={
                buscar.trim()
                  ? 'Puedes agregarla ahora mismo con ese nombre, o revisar si está escrito distinto.'
                  : 'Prueba quitando algún filtro.'
              }
              accion={
                <div className="flex flex-wrap justify-center gap-2">
                  {buscar.trim() && (
                    <Boton
                      variante="principal"
                      icono={<IconoMas tam={18} />}
                      onClick={() => {
                        setNombreParaCrear(buscar.trim())
                        setNuevaAbierta(true)
                      }}
                    >
                      Agregar a “{buscar.trim()}”
                    </Boton>
                  )}
                  <Boton onClick={limpiar}>Quitar filtros</Boton>
                </div>
              }
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
          <ul>
            {personas.map((p, i) => (
              <li key={p.id} style={{ ['--i' as string]: Math.min(i, 12) }} className="entra-renglon renglon">
                {/* Un renglón = una línea. Antes eran dos y cabían la mitad
                    de las personas en pantalla. */}
                <Link
                  to={`/personas/${p.id}`}
                  className="flex min-h-[46px] items-center px-5 py-1.5 transition-colors duration-150 hover:bg-hoja2"
                >
                  <span className="min-w-[150px] flex-1 truncate pr-4 font-medium">{p.nombre}</span>

                  {/* Solo la iglesia. El tipo de cupo no va aquí: su precio ya
                      está en la columna "Su cupo", y meter los dos truncaba
                      ambos hasta dejarlos ilegibles. */}
                  <span className="hidden w-[220px] shrink-0 overflow-hidden pr-4 xl:block">
                    <EtiquetaIglesia nombre={p.iglesia} color={p.iglesia_color} />
                  </span>

                  {/* Dos columnas de cifras, cada una alineada consigo misma.
                      Antes iban pegadas en un solo bloque y lo pagado bailaba
                      de izquierda a derecha según lo largo que fuera el precio. */}
                  {p.inscripcion_id ? (
                    <>
                      <span className="w-[112px] shrink-0 text-right">
                        <Monto centavos={p.pagado} className="font-medium" />
                      </span>
                      <span className="hidden w-[112px] shrink-0 text-right md:block">
                        <Monto centavos={p.precio} tenue />
                      </span>
                    </>
                  ) : (
                    <span className="w-[112px] shrink-0 text-right text-menuda text-tinta2 md:w-[224px]">
                      Sin inscribir
                    </span>
                  )}

                  <span className="w-[128px] shrink-0 pl-5">
                    <ChipEstado estado={p.estado} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Si venía buscando un nombre que no existe, el diálogo abre con ese
          nombre ya escrito: no se escribe dos veces lo mismo. */}
      <DialogoPersona
        abierto={nuevaAbierta}
        alCerrar={cerrarNueva}
        iglesias={iglesias}
        evento={evento}
        personas={personas}
        nombreInicial={nombreParaCrear}
        alGuardar={() => {
          cerrarNueva()
          setBuscar('')
          cargar()
        }}
      />
    </div>
  )
}

function FilaChips({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="rotulo mr-1 w-[104px] shrink-0 leading-tight">{rotulo}</span>
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
        'inline-flex min-h-[44px] items-center gap-2 rounded-full px-3.5 text-menuda font-medium',
        'border transition-colors duration-150 active:scale-[0.98]',
        activo
          ? 'border-accion bg-[rgba(138,51,64,0.09)] text-accion'
          : 'border-linea text-tinta2 hover:border-lineaFuerte hover:bg-hoja2 hover:text-tinta',
      ].join(' ')}
    >
      {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />}
      <span className="max-w-[34ch] truncate">{children}</span>
      {cuenta !== undefined && (
        <span className={`cifra text-micro ${activo ? 'text-accion' : 'text-tinta3'}`}>{cuenta}</span>
      )}
    </button>
  )
}

/** Un filtro que está puesto, con su × para quitarlo de una. */
function FiltroPuesto({
  texto,
  color,
  alQuitar,
}: {
  texto: string
  color?: string
  alQuitar: () => void
}) {
  return (
    <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-accion bg-[rgba(138,51,64,0.08)] pl-3 pr-1 text-menuda font-medium text-accion">
      {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />}
      <span className="max-w-[26ch] truncate">{texto}</span>
      <button
        type="button"
        onClick={alQuitar}
        aria-label={`Quitar el filtro ${texto}`}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgba(138,51,64,0.16)]"
      >
        <IconoCerrar tam={14} />
      </button>
    </span>
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
