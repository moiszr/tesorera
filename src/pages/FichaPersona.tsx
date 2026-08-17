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
  IconoAviso,
  IconoAnular,
  IconoArchivar,
  IconoImprimir,
  IconoLapiz,
  IconoPago,
  IconoVolver,
} from '../components/Iconos'
import { Selector, type Opcion } from '../components/Selector'

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
        className="mb-3 inline-flex min-h-[44px] items-center gap-1 text-menuda text-tinta2 transition-colors hover:text-accion"
      >
        <IconoVolver tam={16} />
        Todas las personas
      </Link>

      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-titulo font-semibold">{persona.nombre}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-tinta2">
            <EtiquetaIglesia nombre={persona.iglesia} color={persona.iglesia_color} className="!text-base" />
            {persona.pastor && <span className="text-menuda">Pastor {persona.pastor}</span>}
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

      {/* Una sola hoja: la cuenta como franja de cabecera y el historial a todo
          el ancho debajo. Antes era una tarjeta estrecha más una columna medio
          vacía, y con muchos pagos la columna se hacía un cordón interminable
          mientras al lado sobraba media pantalla. */}
      <div className="hoja overflow-hidden">
        {!inscripcion ? (
          <div className="px-6 py-12 text-center">
            <p className="text-tinta2">Esta persona no está inscrita en el evento activo.</p>
            {evento && evento.categorias.filter((c) => !c.archivada).length > 0 && (
              <Boton variante="principal" className="mt-4" onClick={() => setCambiandoCupo(true)}>
                Inscribir en {evento.nombre}
              </Boton>
            )}
          </div>
        ) : (
          <>
            <div className="px-6 pb-5 pt-6">
              <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
                <div>
                  {/* Mientras deba algo, lo que falta manda. Cuando ya pagó,
                      "le falta RD$ 0" se lee raro: pasa a mandar el total. */}
                  <div className="mb-1 flex items-center gap-3">
                    <span className="rotulo">{cuenta.balance > 0 ? 'Le falta' : 'Pagó en total'}</span>
                    <ChipEstado estado={cuenta.estado} />
                  </div>
                  <Monto
                    centavos={cuenta.balance > 0 ? cuenta.balance : cuenta.pagado}
                    tam="cifraEnorme"
                    className="leading-none"
                  />
                </div>

                <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                  <Dato rotulo="Precio del cupo" valor={formatoRD(cuenta.precio)} />
                  <Dato rotulo="Ha pagado" valor={formatoRD(cuenta.pagado)} />
                  <Dato rotulo={pagosVivos.length === 1 ? 'Abono' : 'Abonos'} valor={String(pagosVivos.length)} />
                </div>
              </div>

              <div className="mt-5">
                <BarraProgreso
                  pagado={cuenta.pagado}
                  precio={cuenta.precio}
                  estado={cuenta.estado}
                  alto={8}
                />
              </div>

              {(cuenta.excedente > 0 || inscripcion.precio_a_mano === 1) && (
                <div className="mt-3 space-y-1.5">
                  {cuenta.excedente > 0 && (
                    <Nota>
                      Pagó <span className="cifra font-medium text-tinta">{formatoRD(cuenta.excedente)}</span>{' '}
                      de más.
                    </Nota>
                  )}
                  {inscripcion.precio_a_mano === 1 && (
                    <Nota>
                      Este precio se puso a mano, así que no cambia cuando actualizas el precio del tipo de
                      cupo.
                    </Nota>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/registrar-pago?persona=${persona.id}`}>
                  <Boton variante="principal" grande icono={<IconoPago tam={19} />}>
                    Registrar abono
                  </Boton>
                </Link>
                <Boton variante="contorno" grande onClick={() => setCambiandoCupo(true)}>
                  Cambiar cupo o precio
                </Boton>
              </div>
            </div>

            {/* Historial */}
            <div className="flex items-baseline justify-between gap-3 border-t border-linea px-6 pb-2 pt-5">
              <h2 className="font-semibold">Historial de pagos</h2>
              {pagos.some((p) => p.anulado) && (
                <p className="text-menuda text-tinta2">Los anulados quedan tachados; nunca se borran.</p>
              )}
            </div>

            {pagos.length === 0 ? (
              <div className="px-6 pb-10 pt-4 text-center">
                <p className="text-tinta2">
                  Todavía no ha abonado nada. Su primer abono aparecerá aquí con la fecha y la forma de pago.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden border-b border-linea px-6 py-2.5 sm:flex">
                  <span className="rotulo w-[132px] shrink-0 text-right">Monto</span>
                  <span className="rotulo flex-1 pl-6">Fecha</span>
                  <span className="rotulo hidden w-[132px] shrink-0 md:block">Forma de pago</span>
                  <span className="rotulo w-[104px] shrink-0 text-right">Acciones</span>
                </div>

                <ul>
                  {pagos.map((p, i) => (
                    <li
                      key={p.id}
                      style={{ ['--i' as string]: Math.min(i, 10) }}
                      className="entra-renglon renglon"
                    >
                      <div className="flex min-h-[52px] items-center px-6 py-2">
                        <span className="w-[132px] shrink-0 text-right">
                          <span className={p.anulado ? 'line-through' : ''}>
                            <Monto
                              centavos={p.monto}
                              className={p.anulado ? 'text-tinta3' : 'font-medium'}
                            />
                          </span>
                        </span>

                        <span className="min-w-0 flex-1 pl-6">
                          <span className={`block truncate ${p.anulado ? 'text-tinta3' : ''}`}>
                            {fechaLarga(p.fecha)}
                            <span className="text-tinta3"> · {fechaRelativa(p.fecha)}</span>
                          </span>
                          {(p.nota || p.anulado === 1) && (
                            <span className="block truncate text-menuda text-tinta2">
                              {p.anulado === 1
                                ? `Anulado${p.nota_anulacion ? `: ${p.nota_anulacion}` : ' sin nota'}`
                                : `“${p.nota}”`}
                            </span>
                          )}
                        </span>

                        <span className="hidden w-[132px] shrink-0 text-menuda text-tinta2 md:block">
                          {p.anulado === 1 ? (
                            <span className="rounded-full bg-[var(--sinpagos-fondo)] px-2 py-0.5 text-menuda font-medium text-[var(--sinpagos-tinta)]">
                              Anulado
                            </span>
                          ) : (
                            (NOMBRE_METODO[p.metodo] ?? 'Otro')
                          )}
                        </span>

                        <span className="flex w-[104px] shrink-0 justify-end gap-1">
                          {p.anulado === 0 && (
                            <>
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
                            </>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
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

/** Nota al margen: informa sin gritar. Una caja de color aquí compite con la
    cifra, que es lo que tiene que mandar en la pantalla. */
function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-menuda text-tinta2">
      <IconoAviso tam={15} className="mt-0.5 shrink-0 text-tinta3" />
      <span>{children}</span>
    </p>
  )
}

/** Un dato de la franja de cuenta: rótulo arriba, cifra debajo. */
function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="rotulo mb-0.5">{rotulo}</p>
      <p className="cifra text-guia font-medium">{valor}</p>
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
          <Selector
            etiqueta="Iglesia"
            opciones={iglesias.map((g) => ({
              id: g.id,
              etiqueta: g.nombre,
              detalle: g.pastor ? `Pastor ${g.pastor}` : undefined,
              color: colorIglesia(g.color),
            }))}
            valor={iglesiaId}
            alElegir={setIglesiaId}
            textoBuscar="Buscar iglesia…"
          />
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
  const opcionesCupo: Opcion[] = categorias.map((c) => ({
    id: c.id,
    etiqueta: c.nombre,
    detalle: formatoRD(c.precio),
    detalleNumerico: true,
  }))
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
        <Selector
          etiqueta="Tipo de cupo"
          opciones={opcionesCupo}
          valor={categoriaId}
          alElegir={(id) => {
            setCategoriaId(id)
            const c = categorias.find((x) => x.id === id)
            // Solo arrastramos el precio si nadie lo había tocado a mano.
            if (c && (!inscripcion || inscripcion.precio_a_mano === 0)) setPrecio(aTextoEditable(c.precio))
            setProblema(null)
          }}
          textoBuscar="Buscar tipo de cupo…"
        />

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
