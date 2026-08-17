import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Categoria, Evento, Iglesia } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { fechaLarga } from '../lib/fechas'
import {
  Aviso,
  Boton,
  Campo,
  EstadoVacio,
  NOMBRES_COLOR,
  colorIglesia,
} from '../components/Piezas'
import { Confirmacion, Dialogo } from '../components/Dialogo'
import {
  IconoArchivar,
  IconoBajar,
  IconoExportar,
  IconoIglesia,
  IconoImprimir,
  IconoLapiz,
  IconoMas,
  IconoRespaldo,
  IconoSubir,
} from '../components/Iconos'

export default function Ajustes() {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    const [ev, gs] = await Promise.all([api.eventoActivo(), api.iglesias()])
    setEvento(ev)
    setIglesias(gs)
  }, [])

  useEffect(() => {
    cargar()
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false))
  }, [cargar])

  if (cargando) {
    return (
      <div className="animate-pulse" aria-busy="true">
        <div className="mb-5 h-8 w-40 rounded bg-linea" />
        <div className="hoja mb-5 h-40" />
        <div className="hoja h-64" />
      </div>
    )
  }

  return (
    <div className="entra-hoja space-y-5">
      <header>
        <h1 className="text-titulo font-semibold">Ajustes</h1>
        <p className="mt-0.5 text-tinta2">Todo lo que se configura de la app cabe en esta página.</p>
      </header>

      {evento ? (
        <>
          <SeccionEvento evento={evento} alCambiar={cargar} />
          <SeccionCategorias evento={evento} alCambiar={cargar} />
        </>
      ) : (
        <SinEvento alCrear={cargar} />
      )}

      <SeccionIglesias iglesias={iglesias} alCambiar={cargar} />
      <SeccionDatos hayEvento={Boolean(evento)} />
      <SeccionAcercaDe />
    </div>
  )
}

// ── Evento ────────────────────────────────────────────────────────────────

function SinEvento({ alCrear }: { alCrear: () => void }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <section className="hoja">
      <EstadoVacio
        titulo="Todavía no hay un evento"
        explicacion="Crea la convención con su nombre y sus fechas. Después le pones los tipos de cupo con sus precios."
        accion={
          <Boton variante="principal" grande onClick={() => setAbierto(true)}>
            Crear el evento
          </Boton>
        }
      />
      <DialogoEvento
        abierto={abierto}
        alCerrar={() => setAbierto(false)}
        evento={null}
        alGuardar={() => {
          setAbierto(false)
          alCrear()
        }}
      />
    </section>
  )
}

function SeccionEvento({ evento, alCambiar }: { evento: Evento; alCambiar: () => void }) {
  const [editando, setEditando] = useState(false)
  return (
    <section className="hoja p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="rotulo mb-1">El evento</p>
          <h2 className="text-guia font-semibold">{evento.nombre}</h2>
          <p className="mt-0.5 text-menuda text-tinta2">
            {evento.fecha_inicio ? (
              <>
                {fechaLarga(evento.fecha_inicio)}
                {evento.fecha_fin && evento.fecha_fin !== evento.fecha_inicio && (
                  <> al {fechaLarga(evento.fecha_fin)}</>
                )}
              </>
            ) : (
              'Sin fechas puestas'
            )}
          </p>
        </div>
        <Boton variante="contorno" icono={<IconoLapiz tam={17} />} onClick={() => setEditando(true)}>
          Editar
        </Boton>
      </div>
      <DialogoEvento
        abierto={editando}
        alCerrar={() => setEditando(false)}
        evento={evento}
        alGuardar={() => {
          setEditando(false)
          alCambiar()
        }}
      />
    </section>
  )
}

function DialogoEvento({
  abierto,
  alCerrar,
  evento,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  evento: Evento | null
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(evento?.nombre ?? '')
    setInicio(evento?.fecha_inicio ?? '')
    setFin(evento?.fecha_fin ?? '')
    setProblema(null)
  }, [abierto, evento])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Ponle nombre al evento.')
      return
    }
    setGuardando(true)
    try {
      const datos = {
        nombre: nombre.trim(),
        fecha_inicio: inicio || null,
        fecha_fin: fin || null,
        activo: true,
      }
      if (evento) await api.editarEvento(evento.id, datos)
      else await api.crearEvento(datos)
      toast.success(evento ? 'Evento actualizado' : 'Evento creado', {
        description: evento ? undefined : 'Ahora crea sus tipos de cupo con sus precios.',
      })
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo={evento ? 'Editar evento' : 'Crear el evento'}>
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="Nombre del evento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Convención Octubre"
          autoFocus
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo etiqueta="Empieza" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <Campo etiqueta="Termina" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
        </div>
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            {evento ? 'Guardar cambios' : 'Crear evento'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

// ── Tipos de cupo (aquí viven los precios) ────────────────────────────────

function SeccionCategorias({ evento, alCambiar }: { evento: Evento; alCambiar: () => void }) {
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [creando, setCreando] = useState(false)
  const [aArchivar, setAArchivar] = useState<Categoria | null>(null)
  const [trabajando, setTrabajando] = useState(false)

  const activas = evento.categorias.filter((c) => !c.archivada)
  const archivadas = evento.categorias.filter((c) => c.archivada)

  async function mover(c: Categoria, direccion: -1 | 1) {
    const lista = activas
    const i = lista.findIndex((x) => x.id === c.id)
    const j = i + direccion
    if (j < 0 || j >= lista.length) return
    try {
      await Promise.all([
        api.editarCategoria(c.id, { orden: lista[j].orden }),
        api.editarCategoria(lista[j].id, { orden: c.orden }),
      ])
      alCambiar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude reordenar.')
    }
  }

  async function archivar() {
    if (!aArchivar) return
    setTrabajando(true)
    try {
      await api.editarCategoria(aArchivar.id, { archivada: aArchivar.archivada ? 0 : 1 })
      toast.success(aArchivar.archivada ? 'Tipo de cupo devuelto' : 'Tipo de cupo archivado', {
        description: aArchivar.archivada
          ? 'Vuelve a aparecer al agregar personas.'
          : 'Ya no aparece al agregar personas. Quienes lo tienen no cambian.',
      })
      setAArchivar(null)
      alCambiar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude archivar.')
    } finally {
      setTrabajando(false)
    }
  }

  return (
    <section className="hoja overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-5 py-3.5">
        <div>
          <h2 className="font-semibold">Tipos de cupo y precios</h2>
          <p className="mt-0.5 text-menuda text-tinta2">
            Aquí se pone cuánto cuesta cada cupo. Puedes agregar más cuando quieras.
          </p>
        </div>
        <Boton variante="contorno" icono={<IconoMas tam={18} />} onClick={() => setCreando(true)}>
          Agregar tipo de cupo
        </Boton>
      </div>

      {activas.length === 0 ? (
        <EstadoVacio
          titulo="Este evento todavía no tiene tipos de cupo"
          explicacion="Crea al menos uno con su precio. Sin tipos de cupo no se pueden agregar personas."
          accion={
            <Boton variante="principal" grande onClick={() => setCreando(true)}>
              Crear el primero
            </Boton>
          }
        />
      ) : (
        <ul>
          {activas.map((c, i) => (
            <li key={c.id} className="renglon">
              <div className="flex min-h-[66px] flex-wrap items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.nombre}</p>
                  <p className="mt-0.5 text-menuda text-tinta2">
                    {c.inscritos === 0
                      ? 'Nadie lo usa todavía'
                      : `${c.inscritos} ${c.inscritos === 1 ? 'persona' : 'personas'}`}
                  </p>
                </div>
                <span className="cifra shrink-0 text-guia font-semibold">{formatoRD(c.precio)}</span>
                <div className="flex shrink-0 items-center gap-0.5">
                  <BotonIcono
                    etiqueta={`Subir ${c.nombre}`}
                    onClick={() => mover(c, -1)}
                    deshabilitado={i === 0}
                  >
                    <IconoSubir tam={17} />
                  </BotonIcono>
                  <BotonIcono
                    etiqueta={`Bajar ${c.nombre}`}
                    onClick={() => mover(c, 1)}
                    deshabilitado={i === activas.length - 1}
                  >
                    <IconoBajar tam={17} />
                  </BotonIcono>
                  <BotonIcono etiqueta={`Editar ${c.nombre}`} onClick={() => setEditando(c)}>
                    <IconoLapiz tam={17} />
                  </BotonIcono>
                  <BotonIcono etiqueta={`Archivar ${c.nombre}`} onClick={() => setAArchivar(c)}>
                    <IconoArchivar tam={17} />
                  </BotonIcono>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {archivadas.length > 0 && (
        <div className="border-t border-linea bg-hoja2 px-5 py-3">
          <p className="rotulo mb-2">Archivados</p>
          <ul className="space-y-1.5">
            {archivadas.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 text-menuda text-tinta2">
                <span className="min-w-0 flex-1 truncate">{c.nombre}</span>
                <span className="cifra">{formatoRD(c.precio)}</span>
                <span className="text-tinta3">
                  {c.inscritos} {c.inscritos === 1 ? 'persona' : 'personas'}
                </span>
                <Boton variante="texto" className="!min-h-[44px] !px-3" onClick={() => setAArchivar(c)}>
                  Devolver
                </Boton>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogoCategoria
        abierto={creando || editando !== null}
        alCerrar={() => {
          setCreando(false)
          setEditando(null)
        }}
        eventoId={evento.id}
        categoria={editando}
        alGuardar={() => {
          setCreando(false)
          setEditando(null)
          alCambiar()
        }}
      />

      <Confirmacion
        abierto={aArchivar !== null}
        alCerrar={() => setAArchivar(null)}
        alConfirmar={archivar}
        cargando={trabajando}
        titulo={
          aArchivar?.archivada
            ? `¿Devolver "${aArchivar?.nombre}"?`
            : `¿Archivar "${aArchivar?.nombre}"?`
        }
        textoConfirmar={aArchivar?.archivada ? 'Sí, devolverlo' : 'Sí, archivarlo'}
      >
        {aArchivar?.archivada ? (
          <p>Volverá a aparecer cuando agregues personas.</p>
        ) : (
          <p>
            No aparecerá al agregar personas. Las{' '}
            <span className="font-medium text-tinta">
              {aArchivar?.inscritos} {aArchivar?.inscritos === 1 ? 'persona que ya lo tiene' : 'personas que ya lo tienen'}
            </span>{' '}
            no cambian: conservan su precio y su historial.
          </p>
        )}
      </Confirmacion>
    </section>
  )
}

function BotonIcono({
  etiqueta,
  onClick,
  deshabilitado,
  children,
}: {
  etiqueta: string
  onClick: () => void
  deshabilitado?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      aria-label={etiqueta}
      title={etiqueta}
      className="flex h-11 w-11 items-center justify-center rounded-pieza text-tinta2 transition-colors duration-150 hover:bg-[rgba(24,24,27,0.06)] hover:text-tinta disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function DialogoCategoria({
  abierto,
  alCerrar,
  eventoId,
  categoria,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  eventoId: number
  categoria: Categoria | null
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [afectadas, setAfectadas] = useState<{ cuantas: number; precio: number } | null>(null)
  const [aplicando, setAplicando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(categoria?.nombre ?? '')
    setPrecio(categoria ? aTextoEditable(categoria.precio) : '')
    setProblema(null)
    setAfectadas(null)
  }, [abierto, categoria])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Ponle nombre, por ejemplo "Adulto — habitación familiar".')
      return
    }
    const valor = aCentavos(precio)
    if (valor === null || valor < 0) {
      setProblema('Escribe cuánto cuesta, por ejemplo 3,500.')
      return
    }

    setGuardando(true)
    try {
      if (categoria) {
        await api.editarCategoria(categoria.id, { nombre: nombre.trim(), precio: valor })
        const cambioPrecio = valor !== categoria.precio
        if (cambioPrecio) {
          // Nada se aplica solo: primero le decimos a cuántas personas afecta.
          const cuantas = await api.afectadas(categoria.id)
          if (cuantas.cuantas > 0) {
            setAfectadas(cuantas)
            setGuardando(false)
            return
          }
        }
        toast.success('Tipo de cupo actualizado')
      } else {
        await api.crearCategoria(eventoId, { nombre: nombre.trim(), precio: valor })
        toast.success('Tipo de cupo creado')
      }
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  async function aplicar() {
    if (!categoria) return
    setAplicando(true)
    try {
      const r = await api.aplicarPrecio(categoria.id)
      toast.success(`Precio aplicado a ${r.cambiadas} ${r.cambiadas === 1 ? 'persona' : 'personas'}`)
      setAfectadas(null)
      alGuardar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude aplicar el precio.')
    } finally {
      setAplicando(false)
    }
  }

  // Segundo paso: el precio ya cambió, ahora se decide a quién se le aplica.
  if (afectadas) {
    return (
      <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="¿Se lo aplico a quienes ya están inscritos?">
        <div className="space-y-4">
          <p className="text-tinta2">
            El precio nuevo es <span className="cifra font-medium text-tinta">{formatoRD(afectadas.precio)}</span>.
            Le cambiará el precio a{' '}
            <span className="font-medium text-tinta">
              {afectadas.cuantas} {afectadas.cuantas === 1 ? 'persona' : 'personas'}
            </span>{' '}
            que todavía no han pagado completo.
          </p>
          <Aviso>
            Nadie que ya pagó completo cambia, y tampoco cambia quien tenga un precio puesto a mano (becas o
            descuentos).
          </Aviso>
          <div className="flex flex-wrap justify-end gap-2 border-t border-linea pt-4">
            <Boton
              variante="texto"
              onClick={() => {
                setAfectadas(null)
                alGuardar()
              }}
            >
              No, dejarlos como están
            </Boton>
            <Boton variante="principal" onClick={aplicar} cargando={aplicando}>
              Sí, aplicar a {afectadas.cuantas}
            </Boton>
          </div>
        </div>
      </Dialogo>
    )
  }

  return (
    <Dialogo
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={categoria ? 'Editar tipo de cupo' : 'Agregar tipo de cupo'}
    >
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="¿Cómo se llama?"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Adulto — habitación familiar"
          ayuda="Ponle un nombre que ella reconozca de un vistazo."
          autoFocus
        />
        <Campo
          etiqueta="¿Cuánto cuesta?"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="3,500"
          inputMode="decimal"
          adorno={<span className="text-menuda font-medium">RD$</span>}
          className="cifra"
        />
        {categoria && categoria.inscritos > 0 && (
          <Aviso>
            {categoria.inscritos} {categoria.inscritos === 1 ? 'persona usa' : 'personas usan'} este tipo de
            cupo. Si cambias el precio, te preguntaré si se lo aplico a quienes no han pagado completo.
          </Aviso>
        )}
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            {categoria ? 'Guardar cambios' : 'Agregar'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

// ── Iglesias ──────────────────────────────────────────────────────────────

function SeccionIglesias({ iglesias, alCambiar }: { iglesias: Iglesia[]; alCambiar: () => void }) {
  const [editando, setEditando] = useState<Iglesia | null>(null)
  const [creando, setCreando] = useState(false)

  const activas = iglesias.filter((g) => !g.archivada)
  const pastores = [...new Set(iglesias.map((g) => g.pastor).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b, 'es'),
  )

  return (
    <section className="hoja overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-5 py-3.5">
        <div>
          <h2 className="font-semibold">Iglesias</h2>
          <p className="mt-0.5 text-menuda text-tinta2">
            Sirven para etiquetar a cada persona y para el reporte por iglesia.
          </p>
        </div>
        <Boton variante="contorno" icono={<IconoMas tam={18} />} onClick={() => setCreando(true)}>
          Agregar iglesia
        </Boton>
      </div>

      {activas.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hay iglesias"
          explicacion="Agrega las iglesias que participan. Cada persona lleva la suya y el reporte se separa por ellas."
          accion={
            <Boton variante="principal" onClick={() => setCreando(true)}>
              Agregar la primera
            </Boton>
          }
        />
      ) : (
        <ul>
          {activas.map((g) => (
            <li key={g.id} className="renglon">
              <div className="flex min-h-[62px] items-center gap-3 px-5 py-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: colorIglesia(g.color) }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{g.nombre}</span>
                  {g.pastor && (
                    <span className="block truncate text-menuda text-tinta2">Pastor {g.pastor}</span>
                  )}
                </span>
                <span className="cifra shrink-0 text-menuda text-tinta2">
                  {g.personas} {g.personas === 1 ? 'persona' : 'personas'}
                </span>
                <BotonIcono etiqueta={`Editar ${g.nombre}`} onClick={() => setEditando(g)}>
                  <IconoLapiz tam={17} />
                </BotonIcono>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DialogoIglesia
        pastores={pastores}
        abierto={creando || editando !== null}
        alCerrar={() => {
          setCreando(false)
          setEditando(null)
        }}
        iglesia={editando}
        alGuardar={() => {
          setCreando(false)
          setEditando(null)
          alCambiar()
        }}
      />
    </section>
  )
}

function DialogoIglesia({
  abierto,
  alCerrar,
  iglesia,
  pastores,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  iglesia: Iglesia | null
  pastores: string[]
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [pastor, setPastor] = useState('')
  const [color, setColor] = useState('arcilla')
  const [archivada, setArchivada] = useState(false)
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(iglesia?.nombre ?? '')
    setPastor(iglesia?.pastor ?? '')
    setColor(iglesia?.color ?? 'arcilla')
    setArchivada(Boolean(iglesia?.archivada))
    setProblema(null)
  }, [abierto, iglesia])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Escribe el nombre de la iglesia.')
      return
    }
    setGuardando(true)
    try {
      const datos = { nombre: nombre.trim(), pastor: pastor.trim() || null, color }
      if (iglesia) await api.editarIglesia(iglesia.id, { ...datos, archivada })
      else await api.crearIglesia(datos)
      toast.success(iglesia ? 'Iglesia actualizada' : 'Iglesia agregada')
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo={iglesia ? 'Editar iglesia' : 'Agregar iglesia'}>
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="Nombre de la iglesia"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Iglesia Central de Villa Duarte"
          autoFocus
        />
        {/* El pastor se escribe libre, pero se ofrecen los que ya existen: así
            "Juan Pérez" no termina siendo dos pastores distintos por una tilde. */}
        <Campo
          etiqueta="Pastor (opcional)"
          value={pastor}
          onChange={(e) => setPastor(e.target.value)}
          placeholder="Nombre del pastor"
          list="pastores-existentes"
          autoComplete="off"
          ayuda={
            pastores.length > 0
              ? 'Si es el mismo pastor de otra iglesia, escríbelo igual para poder agruparlas.'
              : undefined
          }
        />
        <datalist id="pastores-existentes">
          {pastores.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <div>
          <span className="mb-1.5 block text-menuda font-medium text-tinta2">Color de la etiqueta</span>
          <div className="flex flex-wrap gap-1.5">
            {NOMBRES_COLOR.map((c) => (
              <button
                key={c.valor}
                type="button"
                onClick={() => setColor(c.valor)}
                aria-pressed={color === c.valor}
                className={[
                  'inline-flex min-h-[44px] items-center gap-2 rounded-pieza px-3 text-menuda',
                  'border transition-colors duration-150 active:scale-[0.98]',
                  color === c.valor ? 'border-accion bg-[rgba(99,91,255,0.09)] font-medium' : 'border-lineaFuerte text-tinta2 hover:border-tinta3',
                ].join(' ')}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ background: colorIglesia(c.valor) }}
                  aria-hidden
                />
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
        {iglesia && (
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-menuda text-tinta2">
            <input
              type="checkbox"
              checked={archivada}
              onChange={(e) => setArchivada(e.target.checked)}
              className="h-[18px] w-[18px] rounded border-lineaFuerte"
            />
            Archivar esta iglesia (deja de aparecer al agregar personas; nadie pierde su etiqueta)
          </label>
        )}
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            {iglesia ? 'Guardar cambios' : 'Agregar'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

// ── Datos ─────────────────────────────────────────────────────────────────

function SeccionDatos({ hayEvento }: { hayEvento: boolean }) {
  const [respaldando, setRespaldando] = useState(false)
  const [ultimo, setUltimo] = useState<{ nombre: string; carpeta: string } | null>(null)

  async function respaldar() {
    setRespaldando(true)
    try {
      const r = await api.respaldar()
      setUltimo(r)
      toast.success('Respaldo hecho', { description: `Se guardó como ${r.nombre}` })
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude hacer el respaldo.')
    } finally {
      setRespaldando(false)
    }
  }

  return (
    <section className="hoja p-5">
      <h2 className="font-semibold">Tus datos</h2>
      <p className="mt-0.5 text-menuda text-tinta2">
        La app hace un respaldo sola cada vez que la abres, y guarda los últimos 30.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Boton
          variante="contorno"
          icono={<IconoRespaldo tam={18} />}
          onClick={respaldar}
          cargando={respaldando}
        >
          Hacer respaldo ahora
        </Boton>
        <a href="/api/exportar.csv" download>
          <Boton variante="contorno" icono={<IconoExportar tam={18} />}>
            Exportar a Excel
          </Boton>
        </a>
        {hayEvento && (
          <Link to="/reporte">
            <Boton variante="contorno" icono={<IconoImprimir tam={18} />}>
              Reporte por iglesia
            </Boton>
          </Link>
        )}
      </div>

      {ultimo && (
        <div className="mt-3">
          <Aviso>
            El respaldo quedó guardado como <span className="font-medium">{ultimo.nombre}</span> dentro de la
            carpeta <span className="cifra">{ultimo.carpeta}</span>
          </Aviso>
        </div>
      )}
    </section>
  )
}

function SeccionAcercaDe() {
  return (
    <section className="flex items-center gap-3 px-1 pb-2 text-menuda text-tinta3">
      <IconoIglesia tam={17} />
      <span>
        Tesorera 1.0 · Todo se guarda en esta laptop, sin internet. Nada se borra: los pagos se anulan y las
        personas se archivan.
      </span>
    </section>
  )
}
