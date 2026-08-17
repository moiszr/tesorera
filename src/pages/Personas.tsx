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
import { FiltroMenu } from '../components/FiltroMenu'
import { IconoBuscar, IconoMas } from '../components/Iconos'

type Orden = 'nombre' | 'menos_pagado' | 'recientes'

/**
 * Quién enseña botón de cobrar en su renglón: el que está inscrito y todavía
 * debe algo. Vive aquí, en una sola definición, porque la regla se usa dos
 * veces en la fila (el botón y su zona de clic) y separarlas dejaría huecos
 * muertos sobre el enlace del renglón.
 *
 * Se mira el estado y no el balance: un cupo de precio 0 también tiene balance
 * 0, pero ahí el chip dice "Sin pagos" y cobrarle sí tiene sentido.
 */
function puedeCobrar(p: PersonaEnLista): boolean {
  return p.inscripcion_id !== null && p.estado !== 'pagado'
}

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

      {/* Barra de herramientas: una sola fila. Antes esto eran cinco filas de
          píldoras con una columna de etiquetas al lado, que ocupaban media
          pantalla y encima no escalaban al crecer las iglesias o los cupos.
          Cada filtro muestra en el propio botón lo que está filtrando. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
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
            className="h-[44px] w-full rounded-pieza border border-linea bg-hoja pl-11 pr-4 text-guia transition-colors duration-150 placeholder:text-tinta3 focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(99,91,255,0.18)]"
          />
        </div>

        <FiltroMenu
          etiqueta="Cómo va"
          valor={estado}
          alElegir={(v) => setEstado(v as Estado | undefined)}
          textoTodas="Todos"
          opciones={(['pagado', 'abonando', 'sinpagos'] as Estado[]).map((e) => ({
            valor: e,
            etiqueta: NOMBRE_ESTADO[e],
            cuenta: conteos?.estado?.[e],
          }))}
        />

        {categoriasVisibles.length > 0 && (
          <FiltroMenu
            etiqueta="Cupo"
            valor={categoriaId}
            alElegir={(v) => setCategoriaId(v as number | undefined)}
            ancho={320}
            opciones={categoriasVisibles.map((c) => ({
              valor: c.id,
              etiqueta: c.nombre,
              cuenta: conteos?.categoria?.[c.id] ?? 0,
            }))}
          />
        )}

        {pastores.length > 0 && (
          <FiltroMenu
            etiqueta="Pastor"
            valor={pastor}
            alElegir={(v) => setPastor(v as string | undefined)}
            textoTodas="Todos"
            ancho={320}
            opciones={pastores.map((ps) => ({
              valor: ps.nombre,
              etiqueta: ps.nombre,
              nota: ps.iglesias > 1 ? `${ps.iglesias} iglesias` : undefined,
              cuenta: conteos?.pastor?.[normalizar(ps.nombre)] ?? 0,
            }))}
          />
        )}

        {iglesias.length > 0 && (
          <FiltroMenu
            etiqueta="Iglesia"
            valor={iglesia}
            alElegir={(v) => setIglesia(v as number | undefined)}
            ancho={340}
            opciones={iglesias.map((g) => ({
              valor: g.id,
              etiqueta: g.nombre,
              color: colorIglesia(g.color),
              cuenta: conteos?.iglesia?.[g.id] ?? 0,
            }))}
          />
        )}

        {/* El orden no es un filtro: va aparte, al final. */}
        <FiltroMenu
          etiqueta="Orden"
          valor={orden}
          alElegir={(v) => setOrden((v as Orden) ?? 'nombre')}
          permiteTodas={false}
          opciones={ORDENES.map((o) => ({ valor: o.valor, etiqueta: o.texto }))}
        />

        {hayFiltro && (
          <Boton variante="texto" onClick={limpiar} className="text-menuda">
            Limpiar
          </Boton>
        )}
      </div>

      <div className="hoja overflow-hidden">
        <div className="hidden border-b border-linea px-5 py-2.5 text-base sm:flex">
          <span className="rotulo min-w-[170px] flex-[1.15]">Nombre</span>
          <span className="rotulo hidden min-w-[180px] flex-1 pr-4 xl:block">Iglesia</span>
          <span className="rotulo w-[112px] shrink-0 text-right">Ha pagado</span>
          <span className="rotulo hidden w-[112px] shrink-0 text-right md:block">Su cupo</span>
          <span className="rotulo w-[128px] shrink-0 pl-5">Cómo va</span>
          <span className="w-[112px] shrink-0" aria-hidden />
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
              <li
                key={p.id}
                style={{ ['--i' as string]: Math.min(i, 12) }}
                className="entra-renglon renglon group relative"
              >
                {/* El enlace cubre la fila entera por detrás y el contenido no
                    intercepta clics; así se puede hacer clic en cualquier punto
                    del renglón y el botón de cobrar sigue siendo suyo. */}
                <Link
                  to={`/personas/${p.id}`}
                  className="absolute inset-0 z-0 transition-colors duration-150 group-hover:bg-hoja2"
                  aria-label={`Ver la ficha de ${p.nombre}`}
                />

                <div className="pointer-events-none relative z-10 flex min-h-[52px] items-center px-5 py-1">
                  {/* Una sola escala en toda la fila: el nombre pesa más por su
                      grosor, no por su tamaño. Mezclar tamaños entre columnas
                      hace que la tabla se lea desnivelada. */}
                  <span className="min-w-[170px] flex-[1.15] truncate pr-4 font-semibold">{p.nombre}</span>

                  {/* Solo la iglesia. El tipo de cupo no va aquí: su precio ya
                      está en la columna "Su cupo", y meter los dos truncaba
                      ambos hasta dejarlos ilegibles. */}
                  <span className="hidden min-w-[180px] flex-1 overflow-hidden pr-4 xl:block">
                    <EtiquetaIglesia nombre={p.iglesia} color={p.iglesia_color} className="!text-base" />
                  </span>

                  {/* Dos columnas de cifras, cada una alineada consigo misma.
                      Antes iban pegadas en un solo bloque y lo pagado bailaba
                      de izquierda a derecha según lo largo que fuera el precio. */}
                  {p.inscripcion_id ? (
                    <>
                      <span className="w-[112px] shrink-0 text-right">
                        <Monto centavos={p.pagado} />
                      </span>
                      <span className="hidden w-[112px] shrink-0 text-right md:block">
                        <Monto centavos={p.precio} tenue />
                      </span>
                    </>
                  ) : (
                    <span className="w-[112px] shrink-0 text-right text-tinta2 md:w-[224px]">
                      Sin inscribir
                    </span>
                  )}

                  <span className="w-[128px] shrink-0 pl-5">
                    <ChipEstado estado={p.estado} />
                  </span>

                  {/* Cobrar desde la fila, pero solo donde queda algo por
                      cobrar. Un renglón que dice "Pagado" y al lado ofrece
                      "Cobrar" se contradice a sí mismo. Y hay premio: mostrando
                      el botón solo donde falta, la columna deja de ser una pared
                      de botones que grita más que los propios números y pasa a
                      decir de un vistazo a quién hay que cobrarle.
                      A quien ya pagó se le sigue pudiendo cobrar —un abono de
                      más, una corrección—: el renglón entero es un enlace a su
                      ficha, y allí "Registrar abono" está siempre, con el total
                      pagado y el excedente delante antes de tocar nada.
                      La caja de 112px se queda aunque el botón no esté: es lo
                      que mantiene las columnas a plomo. Lo que no se queda es su
                      captura de clics, o serían 112px muertos encima del enlace
                      de la fila.
                      Contorno blanco en vez de relleno: 64 botones con fondo de
                      color forman una columna que le grita más fuerte que los
                      propios números. Sin icono —el billete a 16px se leía como
                      un rectangulito sucio y la palabra ya lo dice todo—, y el
                      relleno del acento se reserva para el hover, que es cuando
                      hay UN botón mirándote y no sesenta y cuatro.
                      El ::before le devuelve los 46px de zona de clic que la
                      caja de 34px no tiene, sin deformarla ni salirse de la fila. */}
                  <span
                    className={`flex w-[112px] shrink-0 justify-end pl-3 ${
                      puedeCobrar(p) ? 'pointer-events-auto' : ''
                    }`}
                  >
                    {puedeCobrar(p) && (
                      <Link
                        to={`/registrar-pago?persona=${p.id}`}
                        aria-label={`Registrar un abono de ${p.nombre}`}
                        className="relative inline-flex h-[34px] items-center rounded-pieza border border-linea bg-hoja px-3.5 text-menuda font-medium text-tinta shadow-[0_1px_1px_rgba(24,24,27,0.04)] transition-colors duration-150 before:absolute before:inset-x-0 before:-inset-y-[6px] before:content-[''] group-hover:border-lineaFuerte hover:!border-accion hover:!bg-accion hover:!text-white active:scale-[0.97]"
                      >
                        Cobrar
                      </Link>
                    )}
                  </span>
                </div>
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
