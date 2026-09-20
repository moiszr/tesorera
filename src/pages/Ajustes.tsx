import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Evento } from '../api/tipos'
import { fechaLarga } from '../lib/fechas'
import { Aviso, Boton, Campo, EstadoVacio } from '../components/Piezas'
import { Dialogo } from '../components/Dialogo'
import { IconoExportar, IconoIglesia, IconoImprimir, IconoLapiz, IconoRespaldo } from '../components/Iconos'

export default function Ajustes() {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [problema, setProblema] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      setEvento(await api.eventoActivo())
      setProblema('')
    } catch (e) {
      setProblema(e instanceof Error ? e.message : 'No pude cargar los ajustes.')
    }
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

  if (problema)
    return (
      <div className="hoja">
        <EstadoVacio
          titulo="No pude cargar los ajustes"
          explicacion={problema}
          accion={<Boton onClick={cargar}>Volver a intentar</Boton>}
        />
      </div>
    )

  return (
    <div className="entra-hoja space-y-5">
      <header className="cabecera-pagina">
        <div>
          <h1>Ajustes</h1>
          <p>Los datos del evento y el respaldo de tu trabajo.</p>
        </div>
      </header>

      {evento ? (
        <>
          <SeccionEvento evento={evento} alCambiar={cargar} />
          <div className="ajustes-enlaces">
            <Link to="/cupos">
              Tipos de cupo y precios <span>Administrar cupos</span>
            </Link>
            <Link to="/iglesias">
              Iglesias participantes <span>Administrar iglesias</span>
            </Link>
          </div>
        </>
      ) : (
        <SinEvento alCrear={cargar} />
      )}

      <SeccionDatos hayEvento={Boolean(evento)} />
      <SeccionAcercaDe />
    </div>
  )
}

// ── Evento ────────────────────────────────────────────────────────────────

export function SinEvento({ alCrear }: { alCrear: () => void }) {
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

export function SeccionEvento({ evento, alCambiar }: { evento: Evento; alCambiar: () => void }) {
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
