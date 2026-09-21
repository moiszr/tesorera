import { useEffect, useState } from 'react'
import { api } from '../api/cliente'
import type { PersonaEnLista } from '../api/tipos'
import { Dialogo } from './Dialogo'
import { Boton, Campo, EstadoVacio } from './Piezas'
import { normalizar } from '../lib/fechas'
import { formatoRD } from '../lib/dinero'

export function PersonasArchivadas({
  abierto,
  alCerrar,
  alAbrir,
  revision,
}: {
  abierto: boolean
  alCerrar: () => void
  alAbrir: (persona: PersonaEnLista, disparador: HTMLElement) => void
  revision: number
}) {
  const [personas, setPersonas] = useState<PersonaEnLista[]>([])
  const [buscar, setBuscar] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    if (!abierto) return
    let vigente = true
    setCargando(true)
    api
      .personas({ archivadas: '1' })
      .then((r) => {
        if (vigente) {
          setPersonas(r.personas.filter((p) => p.archivada))
          setError('')
        }
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [abierto, revision, intento])
  const visibles = personas.filter((p) =>
    normalizar(`${p.nombre} ${p.iglesia ?? ''}`).includes(normalizar(buscar)),
  )
  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="Personas archivadas" ancho={560} lateral>
      <p className="text-tinta2 mb-5">
        Estas personas se archivaron anteriormente y no cuentan en los totales. Abre su cuenta para
        devolverlas a la lista o eliminarlas definitivamente.
      </p>
      <Campo
        type="search"
        etiqueta="Buscar entre las archivadas"
        placeholder="Nombre o iglesia…"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />
      {error ? (
        <div role="alert" className="py-5">
          <p>{error}</p>
          <Boton onClick={() => setIntento((i) => i + 1)}>Volver a intentar</Boton>
        </div>
      ) : cargando ? (
        <p role="status" className="py-5">
          Cargando personas archivadas…
        </p>
      ) : visibles.length ? (
        <ul className="lista-archivadas">
          {visibles.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.nombre}</strong>
                <span>{p.iglesia ?? 'Sin iglesia asignada'}</span>
                <span>
                  {p.inscripcion_id ? `Le falta ${formatoRD(p.balance)}` : 'Sin cupo en este evento'}
                </span>
              </div>
              <Boton className="accion-editar" onClick={(e) => alAbrir(p, e.currentTarget)}>
                Ver cuenta
              </Boton>
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVacio
          titulo={buscar ? 'No encontré esa persona' : 'No hay personas archivadas'}
          explicacion={
            buscar
              ? 'Prueba con otro nombre o iglesia.'
              : 'Aquí aparecen las personas que se archivaron en versiones anteriores.'
          }
        />
      )}
    </Dialogo>
  )
}
