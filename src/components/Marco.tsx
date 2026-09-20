import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/cliente'
import {
  IconoAjustes,
  IconoInicio,
  IconoPersonas,
  IconoIglesia,
  IconoCupo,
  IconoExportar,
  IconoHabitacion,
} from './Iconos'

const ENTRADAS = [
  { a: '/', texto: 'Inicio', Icono: IconoInicio },
  { a: '/personas', texto: 'Personas', Icono: IconoPersonas },
  { a: '/iglesias', texto: 'Iglesias', Icono: IconoIglesia },
  { a: '/habitaciones', texto: 'Habitaciones', Icono: IconoHabitacion },
  { a: '/cupos', texto: 'Cupos', Icono: IconoCupo },
  { a: '/reporte', texto: 'Reportes', Icono: IconoExportar },
]

export function Marco({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  const [evento, setEvento] = useState('Tu convención')
  useEffect(() => {
    let vigente = true
    api
      .eventoActivo()
      .then((e) => {
        if (vigente) setEvento(e?.nombre ?? 'Prepara tu evento')
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [pathname])
  return (
    <div className="app-marco">
      <a href="#contenido" className="saltar-contenido">
        Ir al contenido
      </a>
      <aside className="lateral no-imprimir">
        <NavLink to="/" className="marca" aria-label="Tesorera, inicio">
          <span className="marca-simbolo">
            <IconoInicio tam={25} />
          </span>
          <span>
            Tesorera<span className="marca-apoyo">Control de pagos</span>
          </span>
        </NavLink>
        <div className="evento-lateral">
          <span className="evento-punto" aria-hidden />
          <span>{evento}</span>
        </div>
        <nav aria-label="Secciones" className="navegacion">
          {ENTRADAS.map(({ a, texto, Icono }) => (
            <NavLink
              key={a}
              to={a}
              end={a === '/'}
              className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
            >
              <Icono tam={21} />
              <span>{texto}</span>
            </NavLink>
          ))}
        </nav>
        <div className="lateral-pie">
          <NavLink to="/ajustes" className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}>
            <IconoAjustes tam={21} />
            Ajustes
          </NavLink>
        </div>
      </aside>
      <main id="contenido" className="contenido" tabIndex={-1}>
        <div className="contenido-interior">{children}</div>
      </main>
    </div>
  )
}
