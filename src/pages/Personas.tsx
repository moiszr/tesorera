import { PersonasArchivadas } from '../components/PersonasArchivadas'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Conteos, Evento, Iglesia, Pastor, PersonaEnLista, Habitacion } from '../api/tipos'
import { NOMBRE_ESTADO, type Estado } from '../lib/estados'
import { Boton, ChipEstado, EstadoVacio, Monto, colorIglesia } from '../components/Piezas'
import { DialogoPersona } from '../components/DialogoPersona'
import { PanelPersona } from '../components/PanelPersona'
import { FiltroMenu } from '../components/FiltroMenu'
import { IconoBuscar, IconoMas, IconoPersonas, IconoPago } from '../components/Iconos'

const ESTADOS: Estado[] = ['pagado', 'abonando', 'sinpagos']
const numero = (v: string | null) =>
  v && Number.isSafeInteger(Number(v)) && Number(v) > 0 ? Number(v) : undefined

export default function Personas() {
  const [params, setParams] = useSearchParams()
  const buscar = params.get('buscar') ?? ''
  const iglesia = numero(params.get('iglesia'))
  const categoria = numero(params.get('categoria_id'))
  const habitacion = params.get('habitacion') ?? undefined
  const estado = ESTADOS.find((e) => e === params.get('estado'))
  const pastor = params.get('pastor') ?? undefined
  const orden = params.get('orden') ?? 'nombre'
  const seleccionada = numero(params.get('persona'))
  const archivadas = params.get('archivadas') === '1'
  const [personas, setPersonas] = useState<PersonaEnLista[]>([])
  const [conteos, setConteos] = useState<Conteos | null>(null)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [evento, setEvento] = useState<Evento | null>(null)
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [pastores, setPastores] = useState<Pastor[]>([])
  const [cargando, setCargando] = useState(true)
  const [preparando, setPreparando] = useState(true)
  const [error, setError] = useState('')
  const [errorOpciones, setErrorOpciones] = useState('')
  const [revision, setRevision] = useState(0)
  const [solicitudCobro, setSolicitudCobro] = useState(0)
  const [ocupado, setOcupado] = useState(false)
  const [nombreParaCrear, setNombreParaCrear] = useState('')
  const [nueva, setNueva] = useState(params.get('nueva') === '1')
  const campoBuscar = useRef<HTMLInputElement>(null)
  const ultimoDisparador = useRef<HTMLElement | null>(null)

  function parametro(clave: string, valor: string | number | undefined) {
    setParams(
      (anterior) => {
        const p = new URLSearchParams(anterior)
        if (valor === undefined || valor === '') p.delete(clave)
        else p.set(clave, String(valor))
        return p
      },
      { replace: true },
    )
  }
  const cargarOpciones = useCallback(async () => {
    setPreparando(true)
    try {
      const [g, e, p, h] = await Promise.all([
        api.iglesias(),
        api.eventoActivo(),
        api.pastores(),
        api.habitaciones(),
      ])
      setHabitaciones(h.habitaciones.filter((h) => !h.archivada))
      setIglesias(g)
      setEvento(e)
      setPastores(p)
      setErrorOpciones('')
    } catch (e) {
      setErrorOpciones(e instanceof Error ? e.message : 'No pude cargar los cupos y las iglesias.')
    } finally {
      setPreparando(false)
    }
  }, [])
  useEffect(() => {
    void cargarOpciones()
  }, [cargarOpciones, revision])
  useEffect(() => {
    let vigente = true
    setCargando(true)
    const timer = setTimeout(
      () => {
        api
          .personas({
            buscar,
            iglesia,
            categoria_id: categoria,
            habitacion,
            estado,
            pastor,
            orden,
            archivadas: undefined,
          })
          .then((r) => {
            if (vigente) {
              setPersonas(r.personas)
              setConteos(r.conteos)
              setError('')
            }
          })
          .catch((e) => {
            if (vigente) setError(e.message)
          })
          .finally(() => {
            if (vigente) setCargando(false)
          })
      },
      buscar ? 120 : 0,
    )
    return () => {
      vigente = false
      clearTimeout(timer)
    }
  }, [buscar, iglesia, categoria, estado, pastor, orden, habitacion, revision])
  useEffect(() => {
    if (!seleccionada && !nueva) campoBuscar.current?.focus({ preventScroll: true })
  }, [])

  function abrir(p: PersonaEnLista, pagar: boolean, disparador: HTMLElement) {
    if (ocupado) return
    ultimoDisparador.current = disparador
    if (pagar) setSolicitudCobro((n) => n + 1)
    setParams(
      (anterior) => {
        const q = new URLSearchParams(anterior)
        q.delete('archivadas')
        q.set('persona', String(p.id))
        if (pagar) q.set('pagar', '1')
        else q.delete('pagar')
        return q
      },
      { replace: true },
    )
  }
  function cerrarPanel() {
    if (ocupado) return
    setParams(
      (anterior) => {
        const q = new URLSearchParams(anterior)
        q.delete('persona')
        q.delete('pagar')
        return q
      },
      { replace: true },
    )
    requestAnimationFrame(() => {
      if (ultimoDisparador.current?.isConnected) ultimoDisparador.current.focus({ preventScroll: true })
      else campoBuscar.current?.focus({ preventScroll: true })
    })
  }
  const refrescar = useCallback(() => setRevision((r) => r + 1), [])
  function cerrarNueva() {
    setNueva(false)
    parametro('nueva', undefined)
  }
  const hayFiltro = Boolean(buscar || iglesia || categoria || estado || pastor || habitacion)
  function limpiar() {
    setParams(
      (anterior) => {
        const p = new URLSearchParams(anterior)
        ;['buscar', 'iglesia', 'categoria_id', 'estado', 'pastor', 'archivadas', 'habitacion'].forEach((k) =>
          p.delete(k),
        )
        return p
      },
      { replace: true },
    )
    campoBuscar.current?.focus()
  }
  const opcionesCupo = evento?.categorias.filter((c) => !c.archivada || c.inscritos > 0) ?? []

  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <h1>Personas</h1>
          <p>Sus cupos, sus pagos y lo que falta. Todo en el mismo lugar.</p>
        </div>
        <Boton
          variante="principal"
          icono={<IconoMas />}
          disabled={preparando || !!errorOpciones || ocupado}
          onClick={() => {
            setNombreParaCrear(buscar.trim())
            setNueva(true)
          }}
        >
          Agregar persona
        </Boton>
      </header>
      {errorOpciones && (
        <div className="aviso-carga" role="alert">
          <span>{errorOpciones}</span>
          <Boton onClick={cargarOpciones}>Volver a intentar</Boton>
        </div>
      )}
      {!preparando && !errorOpciones && (!evento || !opcionesCupo.some((c) => !c.archivada)) && (
        <div className="aviso-carga">
          <span>
            {!evento
              ? 'Primero prepara el evento para inscribir personas.'
              : 'Agrega un tipo de cupo con su precio para empezar.'}
          </span>
          <Link className="enlace-accion" to="/cupos">
            Preparar los cupos
          </Link>
        </div>
      )}
      <div className="espacio-personas">
        {seleccionada && (
          <PanelPersona
            key={seleccionada}
            personaId={seleccionada}
            solicitudCobro={solicitudCobro}
            cobrar={params.get('pagar') === '1'}
            evento={evento}
            iglesias={iglesias.filter((g) => !g.archivada)}
            alCerrar={cerrarPanel}
            alCambiar={refrescar}
            alOcupar={setOcupado}
          />
        )}
        <div className="columna-personas">
          <div className="personas-herramientas">
            <div className="busqueda-personas hoja">
              <IconoBuscar tam={22} />
              <input
                ref={campoBuscar}
                type="search"
                value={buscar}
                onChange={(e) => parametro('buscar', e.target.value)}
                placeholder="Buscar una persona…"
                aria-label="Buscar persona por nombre"
              />
            </div>
            <div className="filtros-personas">
              <FiltroMenu
                etiqueta="Estado de pago"
                valor={estado}
                alElegir={(v) => parametro('estado', v)}
                textoTodas="Todos los estados"
                opciones={ESTADOS.map((e) => ({
                  valor: e,
                  etiqueta: NOMBRE_ESTADO[e],
                  cuenta: conteos?.estado[e],
                }))}
              />
              <FiltroMenu
                etiqueta="Iglesia"
                valor={iglesia}
                alElegir={(v) => parametro('iglesia', v)}
                opciones={iglesias.map((g) => ({
                  valor: g.id,
                  etiqueta: g.nombre,
                  color: colorIglesia(g.color),
                }))}
                ancho={340}
              />
              <FiltroMenu
                etiqueta="Tipo de cupo"
                valor={categoria}
                alElegir={(v) => parametro('categoria_id', v)}
                opciones={opcionesCupo.map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
                ancho={340}
              />
              <FiltroMenu
                etiqueta="Habitación"
                valor={habitacion}
                alElegir={(v) => parametro('habitacion', v)}
                opciones={[
                  { valor: 'sin', etiqueta: 'Sin habitación asignada' },
                  ...habitaciones.map((h) => ({ valor: String(h.id), etiqueta: h.nombre })),
                ]}
              />
              <FiltroMenu
                etiqueta="Pastor"
                valor={pastor}
                alElegir={(v) => parametro('pastor', v)}
                textoTodas="Todos los pastores"
                opciones={pastores.map((p) => ({ valor: p.nombre, etiqueta: p.nombre }))}
                ancho={320}
              />
              {hayFiltro && (
                <Boton variante="texto" onClick={limpiar}>
                  Limpiar filtros
                </Boton>
              )}
            </div>
          </div>
          <div className="lista-controles">
            <p role="status">
              {cargando
                ? 'Actualizando…'
                : `${personas.length} ${personas.length === 1 ? 'persona' : 'personas'}${hayFiltro ? ' en esta lista' : ''}`}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <FiltroMenu
                etiqueta="Orden"
                valor={orden}
                permiteTodas={false}
                alElegir={(v) => parametro('orden', v)}
                opciones={[
                  { valor: 'nombre', etiqueta: 'Por nombre' },
                  { valor: 'menos_pagado', etiqueta: 'Mayor saldo pendiente' },
                  { valor: 'recientes', etiqueta: 'Agregadas hace poco' },
                ]}
              />
            </div>
          </div>
          <div className="lista-personas hoja" aria-busy={cargando}>
            {error ? (
              <EstadoVacio
                titulo="No pude cargar las personas"
                explicacion={error}
                accion={<Boton onClick={refrescar}>Volver a intentar</Boton>}
              />
            ) : cargando && personas.length === 0 ? (
              <div className="p-8" role="status">
                Cargando personas…
              </div>
            ) : personas.length === 0 ? (
              <EstadoVacio
                titulo={hayFiltro ? 'No encontré personas con esos filtros' : 'Aquí empieza tu lista'}
                explicacion={
                  hayFiltro
                    ? 'Prueba con otro nombre o quita los filtros para ver más personas.'
                    : 'Agrega una persona y su cupo. Después podrás registrar sus abonos aquí mismo.'
                }
                accion={
                  <div className="flex flex-wrap justify-center gap-2">
                    {hayFiltro && <Boton onClick={limpiar}>Quitar filtros</Boton>}
                    <Boton
                      variante="principal"
                      disabled={preparando || !!errorOpciones}
                      onClick={() => {
                        setNombreParaCrear(buscar.trim())
                        setNueva(true)
                      }}
                    >
                      Agregar persona
                    </Boton>
                  </div>
                }
              />
            ) : (
              <>
                <div className="fila-persona encabezado-lista" aria-hidden>
                  <span>Persona e iglesia</span>
                  <span className="col-pagado">Ha pagado</span>
                  <span>Le falta</span>
                  <span className="col-estado">Estado</span>
                  <span />
                </div>
                <ul>
                  {personas.map((p) => (
                    <li key={p.id} className={`fila-persona ${seleccionada === p.id ? 'seleccionada' : ''}`}>
                      <button
                        disabled={ocupado || cargando}
                        className="persona-identidad"
                        aria-label={`Ver cuenta de ${p.nombre}`}
                        aria-pressed={seleccionada === p.id}
                        onClick={(e) => abrir(p, false, e.currentTarget)}
                      >
                        <span className="avatar-persona" aria-hidden>
                          {p.nombre
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')}
                        </span>
                        <span className="persona-nombres">
                          <strong>{p.nombre}</strong>
                          <span className="persona-contexto">
                            <span>{p.iglesia ?? 'Sin iglesia asignada'}</span>
                            {p.habitacion && <span className="persona-habitacion">{p.habitacion}</span>}
                          </span>
                        </span>
                      </button>
                      <span className="col-pagado importe-lista">
                        <Monto centavos={p.pagado} />
                      </span>
                      <span className="importe-lista">
                        {p.inscripcion_id ? (
                          <Monto
                            centavos={p.balance}
                            className={p.balance > 0 ? 'font-semibold' : 'text-tinta2'}
                          />
                        ) : (
                          <span className="text-menuda text-tinta2">Sin cupo</span>
                        )}
                      </span>
                      <span className="col-estado">
                        {p.archivada ? (
                          <span className="text-menuda text-tinta2">Archivada</span>
                        ) : p.inscripcion_id ? (
                          <ChipEstado estado={p.estado} />
                        ) : (
                          <span className="text-menuda text-tinta2">Sin inscribir</span>
                        )}
                      </span>
                      <button
                        className="cobrar-fila"
                        disabled={ocupado || cargando}
                        aria-label={`${p.inscripcion_id && !p.archivada && p.estado !== 'pagado' ? 'Registrar pago de' : 'Ver cuenta de'} ${p.nombre}`}
                        onClick={(e) =>
                          abrir(
                            p,
                            Boolean(p.inscripcion_id && !p.archivada && p.estado !== 'pagado'),
                            e.currentTarget,
                          )
                        }
                      >
                        {p.inscripcion_id && !p.archivada && p.estado !== 'pagado' ? (
                          <>
                            <IconoPago tam={18} />
                            <span>Cobrar</span>
                          </>
                        ) : (
                          <span>Ver cuenta</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        {!seleccionada && (
          <div className="ayuda-personas">
            <IconoPersonas tam={19} />
            <span>
              Selecciona una persona para ver su cuenta, o pulsa <strong>Cobrar</strong> para registrar un
              abono.
            </span>
          </div>
        )}
      </div>
      <PersonasArchivadas
        abierto={archivadas}
        revision={revision}
        alCerrar={() => parametro('archivadas', undefined)}
        alAbrir={(p, boton) => abrir(p, false, boton)}
      />
      <DialogoPersona
        abierto={nueva && !preparando && !errorOpciones}
        alCerrar={cerrarNueva}
        iglesias={iglesias.filter((g) => !g.archivada)}
        evento={evento}
        personas={personas}
        nombreInicial={nombreParaCrear}
        iglesiaInicial={iglesia}
        categoriaInicial={categoria}
        alGuardar={(creada) => {
          setNueva(false)
          setParams(
            (anterior) => {
              const p = new URLSearchParams(anterior)
              p.delete('nueva')
              p.set('persona', String(creada.id))
              p.set('pagar', '1')
              return p
            },
            { replace: true },
          )
          refrescar()
          if (hayFiltro) toast.info('La persona se agregó. Los filtros de tu lista se conservan.')
        }}
      />
    </div>
  )
}
