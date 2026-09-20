import { MenuPago } from './MenuPago'
import { CampoDinero } from './CampoDinero'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Evento, Ficha, Iglesia, Pago } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { fechaLarga, hoyISO } from '../lib/fechas'
import { Aviso, Boton, Campo, ChipEstado, EtiquetaIglesia, Monto } from './Piezas'
import { Confirmacion, Dialogo } from './Dialogo'
import { DialogoCupo, DialogoEditarPersona } from './DialogosPersona'
import { IconoCheque, IconoLapiz, IconoPago, IconoArchivar } from './Iconos'

const METODOS: Record<string, string> = { efectivo: 'Efectivo', transferencia: 'Transferencia', otro: 'Otro' }

type Props = {
  personaId: number
  cobrar: boolean
  solicitudCobro: number
  evento: Evento | null
  iglesias: Iglesia[]
  alCerrar: () => void
  alCambiar: () => void
  alOcupar: (ocupado: boolean) => void
}

export function PanelPersona({
  personaId,
  cobrar,
  solicitudCobro,
  evento,
  iglesias,
  alCerrar,
  alCambiar,
  alOcupar,
}: Props) {
  const [centrado, setCentrado] = useState(() => {
    try {
      return localStorage.getItem('tesorera.posicionDetalle') === 'centro'
    } catch {
      return false
    }
  })
  function cambiarPosicion() {
    const siguiente = !centrado
    setCentrado(siguiente)
    try {
      localStorage.setItem('tesorera.posicionDetalle', siguiente ? 'centro' : 'lateral')
    } catch {
      /* La preferencia sigue funcionando durante esta sesión. */
    }
  }
  const [ficha, setFicha] = useState<Ficha | null>(null)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [vista, setVista] = useState<'pago' | 'historial' | 'datos'>(cobrar ? 'pago' : 'historial')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(hoyISO)
  const [metodo, setMetodo] = useState('efectivo')
  const [nota, setNota] = useState('')
  const [problema, setProblema] = useState('')
  const [guardando, setGuardando] = useState(false)
  const enCurso = useRef(false)
  const [ultimo, setUltimo] = useState<{ id: number; monto: number } | null>(null)
  const [editando, setEditando] = useState(false)
  const [campoEdicion, setCampoEdicion] = useState<'nombre' | 'iglesia' | 'telefono' | 'notas'>('nombre')
  const [cupo, setCupo] = useState(false)
  const [aAnular, setAAnular] = useState<Pago | null>(null)
  const [motivo, setMotivo] = useState('')
  const [archivando, setArchivando] = useState(false)
  const campoMonto = useRef<HTMLInputElement>(null)
  const titulo = useRef<HTMLDivElement>(null)
  const confirmacionPago = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (ultimo) confirmacionPago.current?.focus({ preventScroll: true })
  }, [ultimo?.id])

  useEffect(() => {
    let vigente = true
    setError('')
    api
      .persona(personaId)
      .then((f) => {
        if (vigente) setFicha(f)
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
    return () => {
      vigente = false
    }
  }, [personaId, revision])
  useEffect(() => {
    if (cobrar) {
      setVista('pago')
      setUltimo(null)
    }
  }, [cobrar, solicitudCobro])
  useEffect(() => {
    if (!ficha) return
    if (vista === 'pago' && !ultimo && ficha.inscripcion) campoMonto.current?.focus({ preventScroll: true })
  }, [ficha?.persona.id, vista, solicitudCobro])
  useEffect(() => {
    if (ficha && !cobrar) titulo.current?.focus({ preventScroll: true })
  }, [ficha?.persona.id])

  function ocupar(valor: boolean) {
    enCurso.current = valor
    setGuardando(valor)
    alOcupar(valor)
  }
  function editar(campo: typeof campoEdicion = 'nombre') {
    setCampoEdicion(campo)
    setEditando(true)
  }
  function actualizar() {
    setRevision((r) => r + 1)
    alCambiar()
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (enCurso.current || !ficha?.inscripcion) return
    const valor = aCentavos(monto)
    if (valor === null || valor <= 0) {
      setProblema('Escribe un monto mayor que cero, por ejemplo 1,000.')
      campoMonto.current?.focus()
      return
    }
    if (!fecha) {
      setProblema('Elige la fecha del pago.')
      return
    }
    ocupar(true)
    setProblema('')
    try {
      const r = await api.registrarPago({
        inscripcion_id: ficha.inscripcion.id,
        monto: valor,
        fecha,
        metodo,
        nota: nota.trim() || undefined,
      })
      setFicha(r.ficha)
      setUltimo({ id: r.id, monto: valor })
      setMonto('')
      setNota('')
      setFecha(hoyISO())
      setMetodo('efectivo')
      toast.success('Pago guardado', { description: `${formatoRD(valor)} de ${r.ficha.persona.nombre}.` })
      alCambiar()
    } catch (e) {
      setProblema(e instanceof Error ? e.message : 'No pude guardar el pago. Vuelve a intentarlo.')
    } finally {
      ocupar(false)
    }
  }
  async function anular() {
    if (!aAnular || enCurso.current) return
    ocupar(true)
    try {
      const r = await api.anularPago(aAnular.id, motivo || undefined)
      setFicha(r.ficha)
      setAAnular(null)
      setMotivo('')
      setUltimo(null)
      toast.success('Pago anulado. El saldo ya está actualizado.')
      alCambiar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No pude anular el pago.')
    } finally {
      ocupar(false)
    }
  }
  async function archivar() {
    if (!ficha || enCurso.current) return
    ocupar(true)
    try {
      await api.editarPersona(personaId, { archivada: ficha.persona.archivada ? 0 : 1 })
      toast.success(
        ficha.persona.archivada
          ? 'Persona devuelta a la lista'
          : 'Persona archivada. Sus pagos se conservan.',
      )
      setArchivando(false)
      actualizar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No pude guardar el cambio.')
    } finally {
      ocupar(false)
    }
  }
  const centavos = aCentavos(monto)
  const despues = ficha && centavos !== null ? ficha.cuenta.precio - ficha.cuenta.pagado - centavos : null

  return (
    <Dialogo
      abierto
      alCerrar={alCerrar}
      titulo={ficha?.persona.nombre ?? 'Cuenta de la persona'}
      lateral={!centrado}
      ancho={centrado ? 640 : 560}
      ocupado={guardando}
      className={`dialogo-cuenta ${centrado ? 'cuenta-centrada' : ''}`}
      accionesCabecera={
        <button
          type="button"
          className="posicion-detalle"
          onClick={cambiarPosicion}
          aria-label={centrado ? 'Mostrar detalle al lado' : 'Centrar detalle'}
          title={centrado ? 'Mostrar detalle al lado' : 'Centrar detalle'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="3" />
            {centrado ? <path d="M15 4v16" /> : <rect x="8" y="7" width="8" height="10" rx="1.5" />}
          </svg>
        </button>
      }
      pie={
        ficha && !error && vista !== 'pago' ? (
          <div className="cuenta-acciones">
            {ficha.inscripcion && !ficha.persona.archivada && (
              <Boton
                className="accion-tarjeta accion-cobrar"
                variante="principal"
                icono={<IconoPago tam={17} />}
                onClick={() => {
                  setVista('pago')
                  setUltimo(null)
                }}
                disabled={guardando}
              >
                Registrar pago
              </Boton>
            )}
            <Boton
              className="accion-tarjeta accion-editar"
              aria-label="Editar persona"
              icono={<IconoLapiz tam={17} />}
              onClick={() => editar()}
              disabled={guardando}
            >
              Editar
            </Boton>
            <Boton
              className="accion-tarjeta accion-archivar"
              aria-label={ficha.persona.archivada ? 'Devolver a la lista' : 'Archivar persona'}
              icono={<IconoArchivar tam={17} />}
              onClick={() => setArchivando(true)}
              disabled={guardando}
            >
              {ficha.persona.archivada ? 'Devolver a la lista' : 'Archivar'}
            </Boton>
          </div>
        ) : undefined
      }
      icono={
        ficha && (
          <span className="avatar-cuenta" aria-hidden>
            {ficha.persona.nombre
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((n) => n[0])
              .join('')}
          </span>
        )
      }
      descripcion={
        ficha && <EtiquetaIglesia nombre={ficha.persona.iglesia} color={ficha.persona.iglesia_color} />
      }
    >
      <section className="cuenta-lateral" aria-label="Cuenta de la persona">
        {error ? (
          <div className="p-6" role="alert">
            <p>{error}</p>
            <Boton className="mt-3" onClick={() => setRevision((r) => r + 1)}>
              Volver a intentar
            </Boton>
          </div>
        ) : !ficha ? (
          <p className="p-6" role="status">
            Cargando la cuenta…
          </p>
        ) : (
          <>
            <div className="perfil-contenido">
              <div ref={titulo} tabIndex={-1} className="perfil-resumen">
                {ficha.persona.archivada ? (
                  <Aviso>
                    Esta persona está archivada. Sus pagos se conservan.
                    <Boton
                      className="mt-3 accion-editar"
                      disabled={guardando}
                      onClick={() => setArchivando(true)}
                    >
                      Devolver a la lista
                    </Boton>
                  </Aviso>
                ) : null}
                {ficha.inscripcion ? (
                  <>
                    <dl className="cuenta-importes">
                      <div>
                        <dt>Total del cupo</dt>
                        <dd>
                          <Monto centavos={ficha.cuenta.precio} />
                        </dd>
                      </div>
                      <div>
                        <dt>Ha pagado</dt>
                        <dd className="importe-pagado">
                          <Monto centavos={ficha.cuenta.pagado} />
                        </dd>
                      </div>
                      <div>
                        <dt>Pendiente</dt>
                        <dd>
                          <Monto centavos={ficha.cuenta.balance} />
                        </dd>
                      </div>
                    </dl>
                    {ficha.cuenta.excedente > 0 && (
                      <p className="cuenta-aclaracion">
                        Lo pagado incluye {formatoRD(ficha.cuenta.excedente)} de más.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-4">
                    <Aviso>Esta persona aún no está inscrita en el evento.</Aviso>
                    <Boton
                      className="mt-3"
                      variante="principal"
                      onClick={() => setCupo(true)}
                      disabled={!evento?.categorias.some((c) => !c.archivada)}
                    >
                      Asignar un cupo
                    </Boton>
                    {!evento?.categorias.some((c) => !c.archivada) && (
                      <Link className="enlace-accion" to="/cupos">
                        Preparar los cupos
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="perfil-operaciones">
                <div className="cuenta-navegacion" aria-label="Contenido de la cuenta">
                  <div className="cuenta-secciones">
                    <button
                      aria-pressed={vista === 'historial'}
                      onClick={() => setVista('historial')}
                      disabled={guardando}
                    >
                      Pagos <span>{ficha.pagos.filter((p) => !p.anulado).length}</span>
                    </button>
                    <button
                      aria-pressed={vista === 'datos'}
                      onClick={() => setVista('datos')}
                      disabled={guardando}
                    >
                      Datos
                    </button>
                  </div>
                </div>
                <div className="perfil-cuerpo">
                  {vista === 'datos' ? (
                    <div className="cuenta-datos">
                      <dl className="propiedades-persona">
                        <div>
                          <dt>Estado de pago</dt>
                          <dd className="propiedad-estado">
                            {ficha.inscripcion ? (
                              <ChipEstado estado={ficha.cuenta.estado} />
                            ) : (
                              <span className="propiedad-vacia">Sin cupo asignado</span>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Iglesia</dt>
                          <dd>
                            <button
                              className="propiedad-editable"
                              onClick={() => editar('iglesia')}
                              aria-label={`Cambiar iglesia: ${ficha.persona.iglesia}`}
                            >
                              <span>{ficha.persona.iglesia}</span>
                              <IconoLapiz tam={15} />
                            </button>
                          </dd>
                        </div>
                        <div>
                          <dt>Teléfono</dt>
                          <dd>
                            <button
                              className="propiedad-editable"
                              onClick={() => editar('telefono')}
                              aria-label={`Editar teléfono: ${ficha.persona.telefono || 'Sin teléfono'}`}
                            >
                              <span className={!ficha.persona.telefono ? 'propiedad-vacia' : ''}>
                                {ficha.persona.telefono || 'Agregar teléfono'}
                              </span>
                              <IconoLapiz tam={15} />
                            </button>
                          </dd>
                        </div>
                        <div className="propiedad-separada">
                          <dt>Tipo de cupo</dt>
                          <dd>
                            <button
                              className="propiedad-editable"
                              onClick={() => setCupo(true)}
                              aria-label="Cambiar tipo de cupo"
                            >
                              <span>{ficha.inscripcion?.categoria ?? 'Asignar un cupo'}</span>
                              <IconoLapiz tam={15} />
                            </button>
                          </dd>
                        </div>
                        {ficha.inscripcion && (
                          <div>
                            <dt>Precio del cupo</dt>
                            <dd>
                              <button
                                className="propiedad-editable"
                                onClick={() => setCupo(true)}
                                aria-label="Cambiar precio del cupo"
                              >
                                <span>
                                  <Monto centavos={ficha.inscripcion.precio} />
                                  {ficha.inscripcion.precio_a_mano ? (
                                    <small>Precio personalizado</small>
                                  ) : null}
                                </span>
                                <IconoLapiz tam={15} />
                              </button>
                            </dd>
                          </div>
                        )}
                        {!!ficha.inscripcion?.extra_habitacion && (
                          <div>
                            <dt>Extra privado</dt>
                            <dd className="propiedad-valor">
                              <Monto centavos={ficha.inscripcion.extra_habitacion} />
                              <small>Parte de esta persona</small>
                            </dd>
                          </div>
                        )}
                        {!!ficha.inscripcion?.incluye_alojamiento && (
                          <div>
                            <dt>Habitación</dt>
                            <dd>
                              <Link
                                className="propiedad-editable"
                                to={
                                  ficha.inscripcion.habitacion_id
                                    ? `/habitaciones?editar=${ficha.inscripcion.habitacion_id}`
                                    : `/habitaciones?persona=${ficha.persona.id}`
                                }
                              >
                                <span className={!ficha.inscripcion.habitacion ? 'propiedad-vacia' : ''}>
                                  {ficha.inscripcion.habitacion ?? 'Asignar habitación'}
                                </span>
                                <IconoLapiz tam={15} />
                              </Link>
                            </dd>
                          </div>
                        )}
                        <div className="propiedad-separada">
                          <dt>Notas</dt>
                          <dd>
                            <button
                              className="propiedad-editable"
                              onClick={() => editar('notas')}
                              aria-label={`Editar notas: ${ficha.persona.notas || 'Sin notas'}`}
                            >
                              <span className={!ficha.persona.notas ? 'propiedad-vacia' : 'propiedad-notas'}>
                                {ficha.persona.notas || 'Agregar una nota'}
                              </span>
                              <IconoLapiz tam={15} />
                            </button>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : vista === 'pago' ? (
                    ultimo ? (
                      <div className="pago-guardado" role="status">
                        <span className="exito-icono">
                          <IconoCheque tam={24} />
                        </span>
                        <h3 ref={confirmacionPago} tabIndex={-1}>
                          Pago guardado
                        </h3>
                        <p>
                          <strong>{formatoRD(ultimo.monto)}</strong> agregado a esta cuenta.
                        </p>
                        <p className="text-menuda">
                          {ficha.cuenta.balance > 0
                            ? `Le faltan ${formatoRD(ficha.cuenta.balance)}.`
                            : 'Su cupo está pagado completo.'}
                        </p>
                        <Link
                          className="enlace-accion"
                          to={`/comprobante/${ultimo.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver comprobante
                        </Link>
                        <Boton variante="principal" className="w-full mt-4" onClick={alCerrar}>
                          Cobrar a otra persona
                        </Boton>
                        <Boton
                          variante="texto"
                          className="w-full"
                          onClick={() => {
                            setUltimo(null)
                            requestAnimationFrame(() => campoMonto.current?.focus())
                          }}
                        >
                          Registrar otro abono aquí
                        </Boton>
                      </div>
                    ) : ficha.inscripcion && !ficha.persona.archivada ? (
                      <form onSubmit={guardar}>
                        <fieldset disabled={guardando} className="space-y-4">
                          <CampoDinero
                            ref={campoMonto}
                            etiqueta="Monto del abono"
                            placeholder="0"
                            inputMode="decimal"
                            autoComplete="off"
                            value={monto}
                            alCambiar={(valor) => {
                              setMonto(valor)
                              setProblema('')
                            }}
                            adorno={<span>RD$</span>}
                            className="cifra campo-monto"
                          />
                          {ficha.cuenta.balance > 0 && (
                            <button
                              type="button"
                              className="completar-saldo"
                              onClick={() => {
                                setMonto(aTextoEditable(ficha.cuenta.balance))
                                campoMonto.current?.focus()
                              }}
                            >
                              Usar el saldo pendiente
                            </button>
                          )}

                          {despues !== null && centavos !== null && centavos > 0 && (
                            <p className="prevision-pago">
                              {despues > 0
                                ? `Después le faltarán ${formatoRD(despues)}.`
                                : despues === 0
                                  ? 'Con este abono completa su cupo.'
                                  : `Este abono incluye ${formatoRD(-despues)} de más.`}
                            </p>
                          )}
                          {problema && (
                            <p className="text-accionTexto" role="alert">
                              {problema}
                            </p>
                          )}
                          <Boton
                            variante="principal"
                            type="submit"
                            grande
                            className="w-full"
                            cargando={guardando}
                            icono={<IconoPago />}
                          >
                            {guardando ? 'Guardando pago…' : 'Guardar pago'}
                          </Boton>
                          <details className="detalles-pago">
                            <summary>Fecha, forma de pago y nota</summary>
                            <div className="space-y-3 pt-3">
                              <Campo
                                etiqueta="Fecha del pago"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                required
                              />
                              <label className="block text-menuda text-tinta2">
                                Forma de pago
                                <select
                                  className="campo-select mt-1"
                                  value={metodo}
                                  onChange={(e) => setMetodo(e.target.value)}
                                >
                                  {Object.entries(METODOS).map(([v, t]) => (
                                    <option key={v} value={v}>
                                      {t}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <Campo
                                etiqueta="Nota (opcional)"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                              />
                            </div>
                          </details>
                        </fieldset>
                      </form>
                    ) : (
                      <p className="text-tinta2">
                        {ficha.persona.archivada
                          ? 'Devuelve a esta persona a la lista para registrar otro pago.'
                          : 'Asigna un cupo antes de registrar su primer pago.'}
                      </p>
                    )
                  ) : ficha.pagos.length === 0 ? (
                    <div className="historial-vacio">
                      <IconoPago tam={28} />
                      <h3>Todavía no tiene pagos</h3>
                      <p>Su primer abono aparecerá aquí.</p>
                      {ficha.inscripcion && !ficha.persona.archivada && (
                        <Boton className="mt-3" onClick={() => setVista('pago')}>
                          Registrar el primer pago
                        </Boton>
                      )}
                    </div>
                  ) : (
                    <ul className="cuenta-pagos">
                      {ficha.pagos.map((p) => (
                        <li key={p.id} className={p.anulado ? 'pago-anulado' : ''}>
                          <div className="cuenta-pago-fila">
                            <span className="pago-simbolo" aria-hidden>
                              <IconoPago tam={18} />
                            </span>
                            <div className="pago-fecha">
                              <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
                              <span>{p.anulado ? 'Pago anulado' : (METODOS[p.metodo] ?? 'Otro')}</span>
                            </div>
                            <Monto
                              centavos={p.monto}
                              className={p.anulado ? 'line-through text-tinta2' : 'font-semibold'}
                            />
                            {!p.anulado ? (
                              <MenuPago
                                id={p.id}
                                descripcion={`de ${formatoRD(p.monto)} del ${fechaLarga(p.fecha)}`}
                                alAnular={() => {
                                  setAAnular(p)
                                  setMotivo('')
                                }}
                              />
                            ) : (
                              <span className="pago-sin-acciones" />
                            )}
                          </div>
                          {(p.nota || p.nota_anulacion) && (
                            <p className="pago-nota">{p.anulado ? p.nota_anulacion : p.nota}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <DialogoEditarPersona
              abierto={editando}
              campoInicial={campoEdicion}
              alCerrar={() => setEditando(false)}
              ficha={ficha}
              iglesias={iglesias}
              alGuardar={() => {
                setEditando(false)
                actualizar()
              }}
            />
            <DialogoCupo
              abierto={cupo}
              alCerrar={() => setCupo(false)}
              ficha={ficha}
              evento={evento}
              alGuardar={() => {
                setCupo(false)
                setUltimo(null)
                actualizar()
              }}
            />
            <Confirmacion
              abierto={aAnular !== null}
              alCerrar={() => {
                if (!guardando) setAAnular(null)
              }}
              alConfirmar={anular}
              cargando={guardando}
              titulo={`¿Anular el pago de ${formatoRD(aAnular?.monto ?? 0)}?`}
              textoConfirmar="Sí, anular pago"
            >
              <p>
                El saldo de {ficha.persona.nombre} se corregirá. El pago queda tachado en su historial; no se
                borra.
              </p>
              <Campo
                etiqueta="Motivo (opcional)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </Confirmacion>
            <Confirmacion
              abierto={archivando}
              alCerrar={() => {
                if (!guardando) setArchivando(false)
              }}
              alConfirmar={archivar}
              cargando={guardando}
              titulo={
                ficha.persona.archivada
                  ? '¿Devolver a esta persona a la lista?'
                  : `¿Archivar a ${ficha.persona.nombre}?`
              }
              textoConfirmar={ficha.persona.archivada ? 'Sí, devolver a la lista' : 'Sí, archivar persona'}
            >
              <p>
                {ficha.persona.archivada
                  ? 'Volverá a aparecer en la lista y podrás registrar sus pagos.'
                  : 'Dejará de aparecer entre las personas activas. Sus pagos y su historial se conservan, y podrás devolverla desde el panel de personas archivadas.'}
              </p>
            </Confirmacion>
          </>
        )}
      </section>
    </Dialogo>
  )
}
