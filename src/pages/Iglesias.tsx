import { ResumenCifras } from '../components/ResumenCifras'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Iglesia, ReporteDatos } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { normalizar } from '../lib/fechas'
import { Boton, Campo, EstadoVacio, colorIglesia } from '../components/Piezas'
import { DialogoIglesia } from '../components/DialogoIglesia'
import { Confirmacion } from '../components/Dialogo'
import { IconoIglesia, IconoMas, IconoLapiz, IconoArchivar } from '../components/Iconos'

export default function Iglesias() {
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [resumen, setResumen] = useState<ReporteDatos['iglesias']>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [buscar, setBuscar] = useState('')
  const [verArchivadas, setVerArchivadas] = useState(false)
  const [editar, setEditar] = useState<Iglesia | null>(null)
  const [crear, setCrear] = useState(false)
  const [archivar, setArchivar] = useState<Iglesia | null>(null)
  const [guardando, setGuardando] = useState(false)
  const cargar = useCallback(async () => {
    try {
      const [lista, reporte] = await Promise.all([api.iglesias(), api.reporte()])
      setIglesias(lista)
      setResumen(reporte.iglesias)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pude cargar las iglesias.')
    } finally {
      setCargando(false)
    }
  }, [])
  useEffect(() => {
    void cargar()
  }, [cargar])
  const visibles = iglesias.filter(
    (g) =>
      Boolean(g.archivada) === verArchivadas &&
      normalizar(`${g.nombre} ${g.pastor ?? ''}`).includes(normalizar(buscar)),
  )
  async function confirmarArchivo() {
    if (!archivar || guardando) return
    setGuardando(true)
    try {
      await api.editarIglesia(archivar.id, { archivada: archivar.archivada ? 0 : 1 })
      toast.success(archivar.archivada ? 'Iglesia devuelta a la lista' : 'Iglesia archivada')
      setArchivar(null)
      void cargar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No pude guardar el cambio.')
    } finally {
      setGuardando(false)
    }
  }
  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <h1>Iglesias</h1>
          <p>Las iglesias que participan, con sus pastores y personas.</p>
        </div>
        <Boton variante="principal" icono={<IconoMas />} onClick={() => setCrear(true)}>
          Agregar iglesia
        </Boton>
      </header>
      <div className="herramientas-iglesias">
        <Campo
          type="search"
          aria-label="Buscar iglesia o pastor"
          placeholder="Buscar iglesia o pastor…"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <div className="segmentos" aria-label="Lista de iglesias">
          <button aria-pressed={!verArchivadas} onClick={() => setVerArchivadas(false)}>
            Participantes <span>{iglesias.filter((g) => !g.archivada).length}</span>
          </button>
          <button aria-pressed={verArchivadas} onClick={() => setVerArchivadas(true)}>
            Archivadas <span>{iglesias.filter((g) => g.archivada).length}</span>
          </button>
        </div>
      </div>
      {error ? (
        <div className="hoja p-6" role="alert">
          <p>{error}</p>
          <Boton onClick={cargar}>Volver a intentar</Boton>
        </div>
      ) : cargando ? (
        <p role="status">Cargando las iglesias…</p>
      ) : visibles.length === 0 ? (
        <div className="hoja">
          <EstadoVacio
            titulo={
              buscar
                ? 'No encontré esa iglesia'
                : verArchivadas
                  ? 'No hay iglesias archivadas'
                  : 'Agrega la primera iglesia'
            }
            explicacion={
              buscar
                ? 'Prueba con otro nombre o con el nombre del pastor.'
                : verArchivadas
                  ? 'Cuando archives una iglesia, podrás devolverla desde aquí.'
                  : 'Después podrás asignarla a las personas que participen.'
            }
            accion={
              !buscar && !verArchivadas ? (
                <Boton variante="principal" onClick={() => setCrear(true)}>
                  Agregar iglesia
                </Boton>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="lista-iglesias">
          {visibles.map((g) => {
            const r = resumen.find((r) => r.id === g.id)
            return (
              <article className="hoja tarjeta-iglesia" key={g.id}>
                <div className="iglesia-identidad">
                  <span className="iglesia-emblema" style={{ color: colorIglesia(g.color) }}>
                    <IconoIglesia tam={28} />
                  </span>
                  <div>
                    <h2>{g.nombre}</h2>
                    <p>{g.pastor ? `Pastor ${g.pastor}` : 'Sin pastor asignado'}</p>
                  </div>
                </div>
                <ResumenCifras
                  cifras={[
                    { etiqueta: 'Recaudado', valor: formatoRD(r?.recaudado ?? 0), positivo: true },
                    { etiqueta: 'Por cobrar', valor: formatoRD(r?.pendiente ?? 0) },
                    { etiqueta: 'Total de cupos', valor: formatoRD(r?.meta ?? 0) },
                  ]}
                />
                {!!r?.excedente && (
                  <p className="iglesia-excedente">
                    Lo recaudado incluye {formatoRD(r.excedente)} pagados de más.
                  </p>
                )}
                <div className="iglesia-estados">
                  <span>
                    <strong>{r?.personas ?? 0}</strong> {r?.personas === 1 ? 'inscrita' : 'inscritas'}
                  </span>
                  <span className="estado-pagado">
                    <strong>{r?.pagados ?? 0}</strong> {r?.pagados === 1 ? 'pagada' : 'pagadas'}
                  </span>
                  <span className="estado-abonando">
                    <strong>{r?.abonando ?? 0}</strong> abonando
                  </span>
                  <span>
                    <strong>{r?.sinpagos ?? 0}</strong> sin pagos
                  </span>
                </div>
                <div className="acciones-tarjeta">
                  <Link
                    className="accion-tarjeta accion-ver"
                    aria-label={`Ver personas de ${g.nombre}`}
                    to={`/personas?iglesia=${g.id}`}
                  >
                    Ver
                  </Link>
                  <Boton
                    variante="texto"
                    className="accion-tarjeta accion-editar"
                    icono={<IconoLapiz tam={18} />}
                    onClick={() => setEditar(g)}
                  >
                    Editar
                  </Boton>
                  <Boton
                    variante="texto"
                    className="accion-tarjeta accion-archivar"
                    icono={<IconoArchivar tam={18} />}
                    onClick={() => setArchivar(g)}
                  >
                    {g.archivada ? 'Devolver' : 'Archivar'}
                  </Boton>
                </div>
              </article>
            )
          })}
        </div>
      )}
      <p className="nota-pagina">
        Importes del evento actual. Incluyen las cuentas de personas archivadas para conservar el total
        recaudado.
      </p>
      <DialogoIglesia
        abierto={crear || editar !== null}
        iglesia={editar}
        pastores={[...new Set(iglesias.flatMap((g) => (g.pastor ? [g.pastor] : [])))]}
        alCerrar={() => {
          setCrear(false)
          setEditar(null)
        }}
        alGuardar={() => {
          setCrear(false)
          setEditar(null)
          void cargar()
        }}
      />
      <Confirmacion
        abierto={archivar !== null}
        alCerrar={() => {
          if (!guardando) setArchivar(null)
        }}
        alConfirmar={confirmarArchivo}
        cargando={guardando}
        titulo={`${archivar?.archivada ? '¿Devolver' : '¿Archivar'} ${archivar?.nombre ?? 'esta iglesia'}?`}
        textoConfirmar={archivar?.archivada ? 'Sí, devolver iglesia' : 'Sí, archivar iglesia'}
      >
        <p>
          {archivar?.archivada
            ? 'Volverá a estar disponible al agregar personas.'
            : 'Dejará de estar disponible para nuevas personas. Las personas que ya pertenecen a esta iglesia conservan su información y todos sus pagos.'}
        </p>
      </Confirmacion>
    </div>
  )
}
