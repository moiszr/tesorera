import { ResumenCifras } from '../components/ResumenCifras'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { DatosHabitacion, Habitacion, HabitacionesDatos, PlanHabitacion } from '../api/tipos'
import { Boton, Campo, EstadoVacio, ChipEstado } from '../components/Piezas'
import { Confirmacion, Dialogo } from '../components/Dialogo'
import { IconoMas, IconoBuscar, IconoCerrar, IconoLapiz, IconoArchivar } from '../components/Iconos'
import { formatoRD } from '../lib/dinero'
import { normalizar } from '../lib/fechas'

export default function Habitaciones() {
  const [datos, setDatos] = useState<HabitacionesDatos | null>(null)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()
  const [buscar, setBuscar] = useState('')
  const [archivadas, setArchivadas] = useState(false)
  const [viendoId, setViendoId] = useState<number | null>(null)
  const [archivo, setArchivo] = useState<Habitacion | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    api
      .habitaciones()
      .then((r) => {
        if (vigente) {
          setDatos(r)
          setError('')
        }
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
    return () => {
      vigente = false
    }
  }, [revision])
  const editar = params.get('editar')
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [editar])
  const habitacion = datos?.habitaciones.find((h) => String(h.id) === editar)
  function cerrar() {
    setParams({})
  }
  async function archivar() {
    if (!archivo) return
    setOcupado(true)
    try {
      await api.archivarHabitacion(archivo.id, !archivo.archivada)
      toast.success(archivo.archivada ? 'Habitación devuelta a la lista' : 'Habitación archivada')
      setArchivo(null)
      setRevision((r) => r + 1)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }
  if (error)
    return (
      <EstadoVacio
        titulo="No pude cargar las habitaciones"
        explicacion={error}
        accion={<Boton onClick={() => setRevision((r) => r + 1)}>Volver a intentar</Boton>}
      />
    )
  if (!datos)
    return <div className="hoja h-96 animate-pulse" aria-label="Cargando habitaciones" aria-busy="true" />
  if (!datos.evento)
    return (
      <EstadoVacio
        titulo="Primero prepara el evento"
        explicacion="Después podrás organizar las habitaciones y sus integrantes."
        accion={
          <Link className="enlace-accion" to="/ajustes">
            Ir a Ajustes
          </Link>
        }
      />
    )
  if (editar && (editar === 'nueva' || habitacion))
    return (
      <EditorHabitacion
        key={editar}
        datos={datos}
        habitacion={habitacion}
        personaInicial={Number(params.get('persona'))}
        alCerrar={cerrar}
        alGuardar={() => {
          cerrar()
          setRevision((r) => r + 1)
        }}
      />
    )
  const viendo = datos.habitaciones.find((h) => h.id === viendoId)
  const activas = datos.habitaciones.filter((h) => !h.archivada)
  const sin = datos.personas.filter((p) => !p.archivada && !p.habitacion_id)
  const lista = datos.habitaciones.filter(
    (h) =>
      Boolean(h.archivada) === archivadas &&
      normalizar(h.nombre + ' ' + h.integrantes.map((p) => p.nombre).join(' ')).includes(normalizar(buscar)),
  )
  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <h1>Habitaciones</h1>
          <p>Cada grupo en su lugar, con sus cuentas claras.</p>
        </div>
        <Boton
          variante="principal"
          icono={<IconoMas />}
          onClick={() =>
            setParams({
              editar: 'nueva',
              ...(params.get('persona') ? { persona: params.get('persona')! } : {}),
            })
          }
        >
          Crear habitación
        </Boton>
      </header>
      {params.get('persona') && (
        <p className="aviso-carga">
          Elige «Editar» para ubicar a{' '}
          {datos.personas.find((p) => String(p.id) === params.get('persona'))?.nombre ?? 'esta persona'}, o
          crea una habitación.
        </p>
      )}
      <div className="resumen-habitaciones hoja">
        <div>
          <strong>{activas.length}</strong>
          <span>habitaciones</span>
        </div>
        <div>
          <strong>{activas.reduce((s, h) => s + h.integrantes.length, 0)}</strong>
          <span>personas ubicadas</span>
        </div>
        <div>
          <strong>{activas.reduce((s, h) => s + h.capacidad - h.integrantes.length, 0)}</strong>
          <span>espacios libres</span>
        </div>
        <Link to="/personas?habitacion=sin">
          <strong>{sin.length}</strong>
          <span>sin habitación asignada</span>
        </Link>
      </div>
      <div className="herramientas-habitaciones no-imprimir">
        <div className="busqueda-personas hoja">
          <IconoBuscar />
          <input
            aria-label="Buscar habitación o integrante"
            placeholder="Buscar habitación o integrante…"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>
        <div className="segmentos" aria-label="Lista de habitaciones">
          <button aria-pressed={!archivadas} onClick={() => setArchivadas(false)}>
            Activas <span>{activas.length}</span>
          </button>
          <button aria-pressed={archivadas} onClick={() => setArchivadas(true)}>
            Archivadas <span>{datos.habitaciones.length - activas.length}</span>
          </button>
        </div>
      </div>
      {lista.length === 0 ? (
        <div className="hoja">
          <EstadoVacio
            titulo={
              buscar
                ? 'No encontré esa habitación'
                : archivadas
                  ? 'No hay habitaciones archivadas'
                  : 'Organiza la primera habitación'
            }
            explicacion={
              archivadas
                ? 'Cuando archives una habitación vacía, podrás devolverla desde aquí.'
                : 'Ponle un nombre, indica cuántas personas caben y elige quiénes se alojarán juntos.'
            }
            accion={
              !archivadas && (
                <Boton
                  onClick={() =>
                    setParams({
                      editar: 'nueva',
                      ...(params.get('persona') ? { persona: params.get('persona')! } : {}),
                    })
                  }
                >
                  Crear habitación
                </Boton>
              )
            }
          />
        </div>
      ) : (
        <div className="habitaciones-lista">
          {lista.map((h) => (
            <section className="hoja habitacion-tarjeta" key={h.id}>
              <div className="habitacion-cabecera">
                <div>
                  <h2>{h.nombre}</h2>
                  <p>
                    {h.archivada ? 'Archivada' : h.categoria_privada_id ? 'Privada' : 'Compartida'} ·{' '}
                    {h.integrantes.length} de {h.capacidad} personas
                  </p>
                </div>
              </div>
              <div className="habitacion-etiquetas">
                <span
                  className={`etiqueta-habitacion ${h.integrantes.length === h.capacidad ? 'completa' : ''}`}
                >
                  {h.capacidad === h.integrantes.length
                    ? 'Completa'
                    : `${h.capacidad - h.integrantes.length} ${h.capacidad - h.integrantes.length === 1 ? 'libre' : 'libres'}`}
                </span>
                {h.categoria_privada_id && (
                  <span
                    className="etiqueta-habitacion extra-privado"
                    title="Extra total de la habitación, repartido entre sus integrantes"
                  >
                    {formatoRD(h.extra_total)} extra entre todos
                  </span>
                )}
              </div>
              <div
                className="ocupacion-habitacion"
                aria-label={`${h.integrantes.length} de ${h.capacidad} espacios ocupados`}
              >
                {Array.from({ length: Math.min(h.capacidad, 20) }, (_, i) => (
                  <span key={i} className={i < h.integrantes.length ? 'ocupado' : ''} />
                ))}
              </div>
              <ResumenCifras
                cifras={[
                  {
                    etiqueta: 'Personas pagadas',
                    valor: `${h.integrantes.filter((p) => p.estado === 'pagado').length} de ${h.integrantes.length}`,
                  },
                  {
                    etiqueta: 'Por cobrar al grupo',
                    valor: formatoRD(h.integrantes.reduce((s, p) => s + p.balance, 0)),
                  },
                ]}
              />
              <div className="acciones-tarjeta no-imprimir">
                <Boton
                  className="accion-tarjeta accion-ver"
                  onClick={() => setViendoId(h.id)}
                  aria-label={`Ver integrantes de ${h.nombre}`}
                >
                  Ver integrantes
                </Boton>
                {!h.archivada && (
                  <Boton
                    className="accion-tarjeta accion-editar"
                    icono={<IconoLapiz tam={18} />}
                    onClick={() =>
                      setParams({
                        editar: String(h.id),
                        ...(params.get('persona') ? { persona: params.get('persona')! } : {}),
                      })
                    }
                  >
                    Editar
                  </Boton>
                )}
                <Boton
                  variante="texto"
                  className="accion-tarjeta accion-archivar"
                  icono={<IconoArchivar tam={18} />}
                  onClick={() => setArchivo(h)}
                >
                  {h.archivada ? 'Devolver' : 'Archivar'}
                </Boton>
              </div>
            </section>
          ))}
        </div>
      )}
      <Dialogo
        abierto={!!viendo}
        alCerrar={() => setViendoId(null)}
        titulo={viendo?.nombre ?? 'Integrantes de la habitación'}
        lateral
        ancho={560}
        pie={
          viendo && !viendo.archivada ? (
            <Boton
              className="accion-tarjeta accion-editar"
              icono={<IconoLapiz tam={18} />}
              onClick={() => {
                setViendoId(null)
                setParams({ editar: String(viendo.id) })
              }}
            >
              Editar habitación
            </Boton>
          ) : undefined
        }
      >
        {viendo && (
          <>
            <p className="text-tinta2 mb-4">
              {viendo.integrantes.length} de {viendo.capacidad} personas ·{' '}
              {viendo.categoria_privada_id ? 'Habitación privada' : 'Habitación compartida'}
            </p>
            {!!viendo.categoria_privada_id && (
              <p className="mb-4 text-menuda text-accionTexto">
                {formatoRD(viendo.extra_total)} de extra total, repartido entre sus integrantes e incluido en
                sus cuentas.
              </p>
            )}
            {viendo.integrantes.length ? (
              <ul className="integrantes-habitacion">
                {viendo.integrantes.map((p) => (
                  <li key={p.id}>
                    <Link to={`/personas?persona=${p.id}`}>
                      <strong>
                        {p.nombre}
                        {p.archivada ? ' · Archivada' : ''}
                      </strong>
                      <span>{p.iglesia ?? 'Sin iglesia asignada'}</span>
                    </Link>
                    <ChipEstado estado={p.estado} />
                  </li>
                ))}
              </ul>
            ) : (
              <EstadoVacio
                titulo="Todavía no tiene integrantes"
                explicacion="Pulsa Editar habitación para elegir a las personas que se alojarán juntas."
              />
            )}
            {viendo.notas && <p className="text-tinta2 mt-5 break-words">{viendo.notas}</p>}
          </>
        )}
      </Dialogo>
      <Confirmacion
        abierto={!!archivo}
        alCerrar={() => setArchivo(null)}
        alConfirmar={archivar}
        cargando={ocupado}
        titulo={archivo?.archivada ? '¿Devolver esta habitación?' : '¿Archivar esta habitación?'}
        textoConfirmar={archivo?.archivada ? 'Devolver habitación' : 'Archivar habitación'}
      >
        <p>
          {archivo?.integrantes.length
            ? 'Antes de archivarla, mueve o retira a sus integrantes desde «Editar». Así podrás revisar cualquier cambio del extra.'
            : 'La habitación y su historial se conservan. Podrás volver a mostrarla cuando la necesites.'}
        </p>
      </Confirmacion>
    </div>
  )
}

function EditorHabitacion({
  datos,
  habitacion,
  personaInicial,
  alCerrar,
  alGuardar,
}: {
  datos: HabitacionesDatos
  habitacion?: Habitacion
  personaInicial: number
  alCerrar: () => void
  alGuardar: () => void
}) {
  const inicial = datos.personas.find((p) => p.id === personaInicial)?.inscripcion_id
  const [form, setForm] = useState<DatosHabitacion>({
    id: habitacion?.id,
    nombre: habitacion?.nombre ?? '',
    capacidad: habitacion?.capacidad ?? 5,
    categoria_privada_id: habitacion?.categoria_privada_id ?? null,
    notas: habitacion?.notas ?? '',
    integrantes: [
      ...new Set([
        ...(habitacion?.integrantes.map((p) => p.inscripcion_id!) ?? []),
        ...(inicial ? [inicial] : []),
      ]),
    ],
  })
  const [buscar, setBuscar] = useState('')
  const [plan, setPlan] = useState<PlanHabitacion | null>(null)
  const tituloRevision = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (plan) {
      tituloRevision.current?.focus()
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [plan])
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const opciones = datos.evento!.categorias.filter(
    (c) => (!c.archivada && c.extra_privado !== null) || c.id === habitacion?.categoria_privada_id,
  )
  const elegidas = datos.personas.filter((p) => form.integrantes.includes(p.inscripcion_id!))
  const candidatas = datos.personas.filter(
    (p) =>
      (!p.archivada || p.habitacion_id === habitacion?.id) &&
      normalizar(p.nombre + ' ' + (p.iglesia ?? '')).includes(normalizar(buscar)),
  )
  async function revisar(e: React.FormEvent) {
    e.preventDefault()
    setOcupado(true)
    setError('')
    try {
      setPlan(await api.revisarHabitacion(form))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }
  async function guardar() {
    if (!plan || ocupado) return
    setOcupado(true)
    setError('')
    try {
      await api.guardarHabitacion(form, plan.firma)
      toast.success('Habitación guardada', {
        description: 'Las cuentas de sus integrantes ya están actualizadas.',
      })
      alGuardar()
    } catch (e) {
      setError((e as Error).message)
      setPlan(null)
    } finally {
      setOcupado(false)
    }
  }
  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <button className="enlace-accion" onClick={alCerrar} disabled={ocupado}>
            Volver a habitaciones
          </button>
          <h1 ref={tituloRevision} tabIndex={-1}>
            {plan ? 'Revisar el reparto' : habitacion ? `Organizar ${habitacion.nombre}` : 'Crear habitación'}
          </h1>
          <p>
            {plan
              ? 'Confirma los integrantes y lo que le corresponde a cada persona.'
              : 'Agrupa a las personas y define si compartirán o tendrán una habitación privada.'}
          </p>
        </div>
      </header>
      {error && (
        <p role="alert" className="aviso-carga">
          {error}
        </p>
      )}
      {plan ? (
        <section className="hoja revision-habitacion">
          <div className="habitacion-cabecera">
            <div>
              <h2>{plan.destino.nombre}</h2>
              <p>
                {plan.destino.integrantes.length} de {plan.destino.capacidad} personas ·{' '}
                {plan.destino.categoria_privada_id ? 'Privada' : 'Compartida'}
              </p>
            </div>
            <div className="text-right">
              <strong>{formatoRD(plan.destino.extra_total)}</strong>
              <p className="text-menuda text-tinta2">extra total por habitación</p>
            </div>
          </div>
          <p className="explicacion-reparto">
            El extra se reparte entre los integrantes actuales. Al agregar, retirar o mover a alguien, se
            vuelve a repartir y se revisa antes de guardar. Los precios base y los pagos realizados se
            conservan.
          </p>
          {plan.origenes.length > 0 && (
            <p className="aviso-carga">También se actualizará el reparto de: {plan.origenes.join(', ')}.</p>
          )}
          <div className="tabla-desplazable">
            <table className="tabla-reporte">
              <thead>
                <tr>
                  <th>Persona y destino</th>
                  <th>Extra anterior</th>
                  <th>Extra nuevo</th>
                  <th>Total a pagar</th>
                  <th>Le faltará</th>
                </tr>
              </thead>
              <tbody>
                {plan.cambios.map((c) => (
                  <tr key={c.inscripcion_id}>
                    <td>
                      <strong>{c.nombre}</strong>
                      <small>
                        {c.anterior && c.anterior !== c.habitacion ? `${c.anterior} → ` : ''}
                        {c.habitacion ?? 'Sin habitación'}
                      </small>
                    </td>
                    <td>{formatoRD(c.extra_anterior)}</td>
                    <td>{formatoRD(c.extra)}</td>
                    <td>{formatoRD(c.total)}</td>
                    <td>{formatoRD(c.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!plan.cambios.length && (
            <p className="py-5 text-tinta2">
              Esta habitación quedará lista para asignar integrantes más adelante. Aún no se cobrará ningún
              extra.
            </p>
          )}
          {plan.cambios.some((c) => c.pagado > c.total) && (
            <p className="aviso-carga">
              Hay personas con pagos por encima de su nuevo total. Ese dinero seguirá visible como excedente
              en su cuenta.
            </p>
          )}
          <p className="text-menuda text-tinta2 mt-4">
            Si la división no es exacta, algunos integrantes reciben un centavo adicional para que la suma
            coincida con el extra total.
          </p>
          <div className="acciones-editor">
            <Boton disabled={ocupado} onClick={() => setPlan(null)}>
              Volver a editar
            </Boton>
            <Boton variante="principal" cargando={ocupado} onClick={guardar}>
              Confirmar y guardar habitación
            </Boton>
          </div>
        </section>
      ) : (
        <form onSubmit={revisar}>
          <fieldset disabled={ocupado} className="editor-habitacion">
            <section className="hoja configuracion-habitacion">
              <h2>La habitación</h2>
              <Campo
                etiqueta="Nombre o número"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Habitación 12 · Familia Pérez"
                required
                autoFocus
              />
              <Campo
                etiqueta="¿Cuántas personas caben?"
                type="number"
                min={1}
                max={100}
                value={form.capacidad || ''}
                onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
                required
              />
              <label className="campo-etiqueta">
                Modalidad
                <select
                  className="campo-select"
                  value={form.categoria_privada_id ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoria_privada_id: e.target.value ? Number(e.target.value) : null,
                      actualizar_extra: false,
                    })
                  }
                >
                  <option value="">Compartida · sin extra</option>
                  {opciones.map((c) => (
                    <option key={c.id} value={c.id}>
                      Privada · {c.nombre}
                    </option>
                  ))}
                </select>
              </label>
              {form.categoria_privada_id ? (
                <div className="opcion-privada">
                  <strong>
                    {formatoRD(
                      habitacion?.categoria_privada_id === form.categoria_privada_id && !form.actualizar_extra
                        ? habitacion.extra_total
                        : (opciones.find((c) => c.id === form.categoria_privada_id)?.extra_privado ?? 0),
                    )}{' '}
                    extra entre todos
                  </strong>
                  <p className="text-menuda text-tinta2">
                    La opción de Cupos define el extra de la habitación. Cada integrante conserva su propio
                    cupo, precio o descuento.
                  </p>
                  {habitacion?.categoria_privada_id === form.categoria_privada_id &&
                    opciones.find((c) => c.id === form.categoria_privada_id)?.extra_privado != null &&
                    opciones.find((c) => c.id === form.categoria_privada_id)?.extra_privado !==
                      habitacion.extra_total && (
                      <label className="check-archivadas">
                        <input
                          type="checkbox"
                          checked={!!form.actualizar_extra}
                          onChange={(e) => setForm({ ...form, actualizar_extra: e.target.checked })}
                        />{' '}
                        Aplicar el extra actual de Cupos
                      </label>
                    )}
                </div>
              ) : (
                <p className="text-menuda text-tinta2">
                  Para ofrecer una privada, activa su extra en{' '}
                  <Link to="/cupos" className="enlace-accion">
                    Cupos
                  </Link>
                  .
                </p>
              )}
              <Campo
                etiqueta="Nota (opcional)"
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                placeholder="Piso, ubicación o indicaciones"
              />
            </section>
            <section className="hoja seleccionar-integrantes">
              <div className="habitacion-cabecera">
                <div>
                  <h2>Integrantes</h2>
                  <p>
                    {elegidas.length} de {form.capacidad || 0} espacios seleccionados
                  </p>
                </div>
              </div>
              {elegidas.length > 0 && (
                <div className="integrantes-elegidos">
                  {elegidas.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      aria-label={`Retirar a ${p.nombre}`}
                      onClick={() =>
                        setForm({
                          ...form,
                          integrantes: form.integrantes.filter((id) => id !== p.inscripcion_id),
                        })
                      }
                    >
                      {p.nombre}
                      <IconoCerrar tam={16} />
                    </button>
                  ))}
                </div>
              )}
              <Campo
                etiqueta="Buscar integrantes"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="Nombre o iglesia"
              />
              <div className="opciones-integrantes">
                {candidatas.map((p) => (
                  <label key={p.id}>
                    <input
                      type="checkbox"
                      checked={form.integrantes.includes(p.inscripcion_id!)}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          integrantes: e.target.checked
                            ? [...form.integrantes, p.inscripcion_id!]
                            : form.integrantes.filter((id) => id !== p.inscripcion_id),
                        })
                      }
                    />
                    <span>
                      <strong>
                        {p.nombre}
                        {p.archivada ? ' · Archivada' : ''}
                      </strong>
                      <small>
                        {p.iglesia ?? 'Sin iglesia'} · {p.categoria}
                      </small>
                      <small>
                        {p.habitacion_id && p.habitacion_id !== habitacion?.id
                          ? `Se moverá desde ${p.habitacion}`
                          : (p.habitacion ?? 'Sin habitación asignada')}
                      </small>
                    </span>
                  </label>
                ))}
                {!candidatas.length && (
                  <p className="p-4 text-tinta2">
                    No hay personas que coincidan. Agrega las personas primero desde Personas.
                  </p>
                )}
              </div>
              <div className="acciones-editor">
                <Boton type="button" onClick={alCerrar}>
                  Cancelar
                </Boton>
                <Boton type="submit" variante="principal" cargando={ocupado}>
                  Revisar habitación y reparto
                </Boton>
              </div>
            </section>
          </fieldset>
        </form>
      )}
    </div>
  )
}
