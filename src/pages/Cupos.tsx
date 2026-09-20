import { IconoMas } from '../components/Iconos'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/cliente'
import type { Evento } from '../api/tipos'
import { GestionCupos } from '../components/GestionCupos'
import { Boton } from '../components/Piezas'
import { SinEvento } from './Ajustes'

export default function Cupos() {
  const [creando, setCreando] = useState(false)
  const [evento, setEvento] = useState<Evento | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const cargar = useCallback(async () => {
    try {
      setEvento(await api.eventoActivo())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pude cargar los cupos.')
    } finally {
      setCargando(false)
    }
  }, [])
  useEffect(() => {
    void cargar()
  }, [cargar])
  const activos = evento?.categorias.filter((c) => !c.archivada) ?? []
  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <h1>Cupos</h1>
          <p>Tipos de cupo, precios y personas inscritas.</p>
        </div>
        <Boton
          variante="principal"
          icono={<IconoMas />}
          disabled={!evento || cargando || !!error}
          onClick={() => setCreando(true)}
        >
          Agregar tipo de cupo
        </Boton>
      </header>
      {error ? (
        <div className="hoja p-6" role="alert">
          <p>{error}</p>
          <Boton onClick={cargar}>Volver a intentar</Boton>
        </div>
      ) : cargando ? (
        <p role="status">Cargando los cupos…</p>
      ) : evento ? (
        <>
          <div className="resumen-linea">
            <span>
              <strong>{activos.length}</strong> tipos disponibles
            </span>
            <span>{evento.nombre}</span>
          </div>
          <GestionCupos
            evento={evento}
            alCambiar={cargar}
            creando={creando}
            alCerrarCrear={() => setCreando(false)}
          />
          <p className="nota-pagina">
            Cada persona conserva el precio que tenía al inscribirse. Si cambias un precio, tú decides a quién
            aplicarlo.
          </p>
        </>
      ) : (
        <SinEvento alCrear={cargar} />
      )}
    </div>
  )
}
