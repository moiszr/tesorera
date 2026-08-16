import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Evento, Ficha, Iglesia, Pago } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { fechaLarga, fechaRelativa } from '../lib/fechas'
import {
  Aviso,
  BarraProgreso,
  Boton,
  Campo,
  ChipEstado,
  EtiquetaIglesia,
  Monto,
  colorIglesia,
} from '../components/Piezas'
import { Confirmacion, Dialogo } from '../components/Dialogo'
import {
  IconoAnular,
  IconoArchivar,
  IconoImprimir,
  IconoLapiz,
  IconoPago,
  IconoVolver,
} from '../components/Iconos'
import { BotonCategoria } from './Personas'

const NOMBRE_METODO: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  otro: 'Otro',
}

export default function FichaPersona() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [ficha, setFicha] = useState<Ficha | null>(null)
  const [evento, setEvento] = useState<Evento | null>(null)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [cambiandoCupo, setCambiandoCupo] = useState(false)
  const [aAnular, setAAnular] = useState<Pago | null>(null)
  const [notaAnulacion, setNotaAnulacion] = useState('')
  const [anulando, setAnulando] = useState(false)
  const [archivando, setArchivando] = useState(false)

  const cargar = useCallback(async () => {
    const [f, ev, gs] = await Promise.all([api.persona(Number(id)), api.eventoActivo(), api.iglesias()])
    setFicha(f)
    setEvento(ev)
    setIglesias(gs.filter((g) => !g.archivada))
  }, [id])

  useEffect(() => {
    setCargando(true)
    cargar()
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false))
  }, [cargar])

  if (cargando || !ficha) {
    return (
      <div className="animate-pulse" aria-busy="true" aria-label="Cargando">
        <div className="mb-5 h-8 w-72 rounded bg-linea" />
        <div className="hoja mb-5 h-48" />
        <div className="hoja h-64" />
      </div>
    )
  }

  const { persona, inscripcion, cuenta, pagos } = ficha
  const pagosVivos = pagos.filter((p) => !p.anulado)

  async function anular() {
    if (!aAnular) return
    setAnulando(true)
    try {
      const r = await api.anularPago(aAnular.id, notaAnulacion || undefined)
      setFicha(r.ficha)
      toast.success('Pago anulado', {
        description: 'Queda tachado en el historial y el saldo ya se corrigió.',
      })
      setAAnular(null)
      setNotaAnulacion('')
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude anular el pago.')
    } finally {
      setAnulando(false)
    }
  }

  async function archivar() {
    setArchivando(true)
    try {
      await api.editarPersona(persona.id, { archivada: persona.archivada ? 0 : 1 })
      toast.success(persona.archivada ? `${persona.nombre} volvió a la lista` : `${persona.nombre} se archivó`, {
        description: persona.archivada
          ? 'Ya aparece otra vez en Personas.'
          : 'No se borró nada: su historial de pagos sigue completo.',
      })
      if (!persona.archivada) navegar('/personas')
      else cargar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude archivar.')
    } finally {
      setArchivando(false)
    }
  }

  return (
    <div className="entra-hoja">
      <Link
        to="/personas"
        className="mb-3 inline-flex min-h-[36px] items-center gap-1 text-menuda text-tinta2 transition-colors hover:text-accion"
      >
        <IconoVolver tam={16} />
        Todas las personas
      </Link>

      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-titulo font-semibold">{persona.nombre}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-tinta2">
            <EtiquetaIglesia nombre={persona.iglesia} color={persona.iglesia_color} className="!text-base" />
            {inscripcion && <span className="text-menuda">{inscripcion.categoria}</span>}
            {persona.telefono && (
              <a href={`tel:${persona.telefono}`} className="cifra text-menuda underline-offset-4 hover:text-accion hover:underline">
                {persona.telefono}
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Boton variante="texto" icono={<IconoLapiz tam={17} />} onClick={() => setEditando(true)}>
            Editar
          </Boton>
          <Boton
            variante="texto"
            icono={<IconoArchivar tam={17} />}
            onClick={archivar}
            cargando={archivando}
          >
            {persona.archivada ? 'Devolver a la lista' : 'Archivar'}
          </Boton>
        </div>
      </header>

      {persona.archivada === 1 && (
        <div className="mb-4">
          <Aviso tono="ojo">
            Esta persona está archivada: no aparece en la lista ni en la búsqueda de pagos. Su historial
            sigue completo.
          </Aviso>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* La cuenta: lo que falta es el número más grande. */}
        <div className="hoja h-fit p-5">
          {!inscripcion ? (
            <div className="text-center">
              <p className="text-tinta2">Esta persona no está inscrita en el evento activo.</p>
              {evento && evento.categorias.filter((c) => !c.archivada).length > 0 && (
                <Boton variante="principal" className="mt-4" onClick={() => setCambiandoCupo(true)}>
                  Inscribir en {evento.nombre}
                </Boton>
              )}
            </div>
          ) : (
            <>
              {/* Mientras deba algo, lo que falta es el número más grande de la
                  pantalla. Cuando ya pagó, "le falta RD$ 0" se lee raro: pasa a
                  mandar el total que pagó, que es lo que ella va a querer decir. */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="rotulo">{cuenta.balance > 0 ? 'Le falta' : 'Pagó en total'}</span>
                <ChipEstado estado={cuenta.estado} />
              </div>
              <p className="cifra mt-1 text-cifraEnorme font-semibold leading-none tracking-[-0.03em]">
                <span className="mr-2 align-baseline text-[0.4em] font-medium text-tinta2">RD$</span>
                {formatoRD(cuenta.balance > 0 ? cuenta.balance : cuenta.pagado).replace('RD$ ', '')}
              </p>

              <div className="mt-4">
                <BarraProgreso
                  pagado={cuenta.pagado}
                  precio={cuenta.precio}
                  estado={cuenta.estado}
                  alto={10}
                />
              </div>

              <dl className="mt-4 space-y-2 border-t border-linea pt-4 text-menuda">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-tinta2">Precio del cupo</dt>
                  <dd>
                    <Monto centavos={cuenta.precio} className="font-medium" />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-tinta2">Ha pagado</dt>
                  <dd>
                    <Monto centavos={cuenta.pagado} className="font-medium" />
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-tinta2">Abonos</dt>
                  <dd className="cifra font-medium">{pagosVivos.length}</dd>
                </div>
              </dl>

              {cuenta.excedente > 0 && (
                <div className="mt-3">
                  <Aviso>
                    Pagó <span className="cifra font-medium">{formatoRD(cuenta.excedente)}</span> de más.
                  </Aviso>
                </div>
              )}

              {inscripcion.precio_a_mano === 1 && (
                <div className="mt-3">
                  <Aviso>
                    Este precio se puso a mano, así que no cambia cuando actualizas el precio del tipo de
                    cupo.
                  </Aviso>
                </div>
              )}

              <Link to={`/registrar-pago?persona=${persona.id}`} className="mt-4 block">
                <Boton variante="principal" grande className="w-full" icono={<IconoPago tam={19} />}>
                  Registrar abono
                </Boton>
              </Link>
              <Boton variante="texto" className="mt-1.5 w-full" onClick={() => setCambiandoCupo(true)}>
                Cambiar tipo de cupo o precio
              </Boton>
            </>
          )}
        </div>

        {/* Historial */}
        <div className="hoja overflow-hidden">
          <div className="border-b border-linea px-5 py-3.5">
            <h2 className="font-semibold">Historial de pagos</h2>
            {pagos.length > 0 && (
              <p className="mt-0.5 text-menuda text-tinta2">
                Los pagos anulados quedan tachados; nunca se borran.
              </p>
            )}
          </div>

          {pagos.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-medium">Todavía no ha abonado nada</p>
              <p className="mx-auto mt-1 max-w-[36ch] text-menuda text-tinta2">
                Cuando registres su primer abono aparecerá aquí, con la fecha y la forma de pago.
              </p>
              {inscripcion && (
                <Link to={`/registrar-pago?persona=${persona.id}`}>
                  <Boton variante="principal" className="mt-4">
                    Registrar su primer abono
                  </Boton>
                </Link>
              )}
            </div>
          ) : (
            <ul>
              {pagos.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: Math.min(i, 10) }} className="entra-renglon renglon">
                  <div className="flex min-h-[64px] items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${p.anulado ? 'text-tinta3' : ''}`}>
                        <span className={p.anulado ? 'line-through' : ''}>
                          <Monto centavos={p.monto} tam="guia" className={p.anulado ? 'opacity-70' : ''} />
                        </span>
                        {p.anulado === 1 && (
                          <span className="ml-2 rounded-full bg-[var(--sinpagos-fondo)] px-2 py-0.5 text-micro font-semibold uppercase text-[var(--sinpagos-tinta)]">
                            Anulado
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-menuda text-tinta2">
                        {fechaLarga(p.fecha)} · {NOMBRE_METODO[p.metodo] ?? 'Otro'}
                        <span className="text-tinta3"> · {fechaRelativa(p.fecha)}</span>
                      </p>
                      {p.nota && <p className="mt-1 text-menuda text-tinta2">“{p.nota}”</p>}
                      {p.anulado === 1 && (
                        <p className="mt-1 text-menuda text-tinta3">
                          Anulado{p.nota_anulacion ? `: ${p.nota_anulacion}` : ' sin nota'}
                        </p>
                      )}
                    </div>

                    {p.anulado === 0 && (
                      <div className="flex shrink-0 gap-1">
                        <Link
                          to={`/comprobante/${p.id}`}
                          aria-label={`Comprobante de ${formatoRD(p.monto)}`}
                          title="Comprobante"
                          className="flex h-11 w-11 items-center justify-center rounded-pieza text-tinta2 transition-colors hover:bg-[rgba(36,31,27,0.06)] hover:text-tinta"
                        >
                          <IconoImprimir tam={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setAAnular(p)}
                          aria-label={`Anular el pago de ${formatoRD(p.monto)}`}
                          title="Anular este pago"
                          className="flex h-11 w-11 items-center justify-center rounded-pieza text-tinta2 transition-colors hover:bg-[rgba(138,51,64,0.09)] hover:text-accion"
                        >
                          <IconoAnular tam={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Anular un pago: confirmación clara y nota opcional del porqué. */}
      <Confirmacion
        abierto={aAnular !== null}
        alCerrar={() => {
          setAAnular(null)
          setNotaAnulacion('')
        }}
        alConfirmar={anular}
        cargando={anulando}
        titulo={aAnular ? `¿Anular el abono de ${formatoRD(aAnular.monto)}?` : ''}
        textoConfirmar="Sí, anular este pago"
      >
        <p>
          El pago quedará <span className="font-medium text-tinta">tachado en el historial</span> y el saldo
          de {persona.nombre} se corregirá solo. No se borra nada.
        </p>
        <Campo
          etiqueta="¿Por qué lo anulas? (opcional)"
          value={notaAnulacion}
          onChange={(e) => setNotaAnulacion(e.target.value)}
          placeholder="Por ejemplo: me equivoqué de persona"
        />
      </Confirmacion>

      <DialogoEditarPersona
        abierto={editando}
        alCerrar={() => setEditando(false)}
        ficha={ficha}
        iglesias={iglesias}
        alGuardar={() => {
          setEditando(false)
          cargar()
        }}
      />

      <DialogoCupo
        abierto={cambiandoCupo}
        alCerrar={() => setCambiandoCupo(false)}
        ficha={ficha}
        evento={evento}
        alGuardar={() => {
          setCambiandoCupo(false)
          cargar()
        }}
      />
    </div>
  )
}

// ── Editar datos ──────────────────────────────────────────────────────────

function DialogoEditarPersona({
  abierto,
  alCerrar,
  ficha,
  iglesias,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  ficha: Ficha
  iglesias: Iglesia[]
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState(ficha.persona.nombre)
  const [iglesiaId, setIglesiaId] = useState<number | undefined>(ficha.persona.iglesia_id ?? undefined)
  const [telefono, setTelefono] = useState(ficha.persona.telefono ?? '')
  const [notas, setNotas] = useState(ficha.persona.notas ?? '')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(ficha.persona.nombre)
    setIglesiaId(ficha.persona.iglesia_id ?? undefined)
    setTelefono(ficha.persona.telefono ?? '')
    setNotas(ficha.persona.notas ?? '')
    setProblema(null)
  }, [abierto, ficha])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('El nombre no puede quedar vacío.')
      return
    }
    setGuardando(true)
    try {
      await api.editarPersona(ficha.persona.id, {
        nombre: nombre.trim(),
        iglesia_id: iglesiaId ?? null,
        telefono: telefono || null,
        notas: notas || null,
      })
      toast.success('Datos guardados')
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="Editar persona" ancho={480}>
      <form onSubmit={guardar} className="space-y-4">
        <Campo etiqueta="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
        {iglesias.length > 0 && (
          <div>
            <span className="mb-1.5 block text-menuda font-medium text-tinta2">Iglesia</span>
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
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: colorIglesia(g.color) }}
                    aria-hidden
                  />
                  {g.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
        <Campo etiqueta="Teléfono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <Campo etiqueta="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
        {problema && <p className="text-menuda text-accion">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            Guardar cambios
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

// ── Cambiar tipo de cupo o precio ─────────────────────────────────────────

function DialogoCupo({
  abierto,
  alCerrar,
  ficha,
  evento,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  ficha: Ficha
  evento: Evento | null
  alGuardar: () => void
}) {
  const inscripcion = ficha.inscripcion
  const [categoriaId, setCategoriaId] = useState<number | undefined>(inscripcion?.categoria_id)
  const [precio, setPrecio] = useState(aTextoEditable(inscripcion?.precio ?? 0))
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const categorias = (evento?.categorias ?? []).filter((c) => !c.archivada || c.id === inscripcion?.categoria_id)
  const elegida = categorias.find((c) => c.id === categoriaId)
  const precioActual = aCentavos(precio)
  const difiere = elegida && precioActual !== null && precioActual !== elegida.precio

  useEffect(() => {
    if (!abierto) return
    setCategoriaId(inscripcion?.categoria_id)
    setPrecio(aTextoEditable(inscripcion?.precio ?? 0))
    setProblema(null)
  }, [abierto, inscripcion])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!categoriaId) {
      setProblema('Elige el tipo de cupo.')
      return
    }
    const valor = aCentavos(precio)
    if (valor === null || valor < 0) {
      setProblema('Escribe un precio válido.')
      return
    }

    setGuardando(true)
    try {
      if (!inscripcion) {
        await api.inscribir(ficha.persona.id, categoriaId)
        toast.success(`${ficha.persona.nombre} quedó inscrita`)
      } else {
        await api.editarInscripcion(inscripcion.id, { categoria_id: categoriaId, precio: valor })
        toast.success('Cupo actualizado')
      }
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={inscripcion ? 'Cambiar tipo de cupo o precio' : 'Inscribir en el evento'}
      ancho={520}
    >
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-menuda font-medium text-tinta2">Tipo de cupo</span>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {categorias.map((c) => (
              <BotonCategoria
                key={c.id}
                categoria={c}
                elegida={categoriaId === c.id}
                onClick={() => {
                  setCategoriaId(c.id)
                  // Solo arrastramos el precio si nadie lo había tocado a mano.
                  if (!inscripcion || inscripcion.precio_a_mano === 0) setPrecio(aTextoEditable(c.precio))
                  setProblema(null)
                }}
              />
            ))}
          </div>
        </div>

        <Campo
          etiqueta="Precio para esta persona"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          adorno={<span className="text-menuda font-medium">RD$</span>}
          className="cifra"
          inputMode="decimal"
          ayuda={
            difiere
              ? `Distinto del precio del tipo de cupo (${formatoRD(elegida!.precio)}). Se guardará como precio puesto a mano y no cambiará cuando actualices ese tipo de cupo.`
              : 'Puedes cambiarlo si esta persona tiene una beca o un descuento.'
          }
        />

        {problema && <p className="text-menuda text-accion">{problema}</p>}

        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            Guardar
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}
