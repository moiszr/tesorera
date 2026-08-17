import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { IconoAjustes, IconoInicio, IconoPago, IconoPersonas } from './Iconos'
import { cuentaRegresiva } from '../lib/fechas'
import type { Evento } from '../api/tipos'

const ENTRADAS = [
  { a: '/', texto: 'Inicio', Icono: IconoInicio },
  { a: '/personas', texto: 'Personas', Icono: IconoPersonas },
  { a: '/registrar-pago', texto: 'Registrar pago', Icono: IconoPago },
  { a: '/ajustes', texto: 'Ajustes', Icono: IconoAjustes },
]

/**
 * Barra lateral clara, del mismo tono que el lienzo y separada por una raya
 * fina. Un bloque de color saturado a la izquierda es lo que más envejecía la
 * pantalla: pesa mucho, compite con el contenido y no lo hace ninguna
 * herramienta actual. El acento se guarda para la entrada activa.
 */
export function Marco({ evento, children }: { evento: Evento | null; children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen">
      <nav
        className="no-imprimir sticky top-0 flex h-screen w-[236px] shrink-0 flex-col border-r border-linea bg-lomo"
        aria-label="Secciones"
      >
        <div className="px-5 pb-2 pt-5">
          <p className="text-[1.0625rem] font-semibold tracking-[-0.012em] text-tinta">Tesorera</p>
          {evento ? (
            <p className="mt-0.5 text-menuda leading-snug text-tinta3">
              {evento.nombre}
              {evento.fecha_inicio && (
                <>
                  <br />
                  {cuentaRegresiva(evento.fecha_inicio)}
                </>
              )}
            </p>
          ) : (
            <p className="mt-0.5 text-menuda text-tinta3">Sin evento todavía</p>
          )}
        </div>

        <ul className="mt-4 flex flex-col gap-0.5 px-3">
          {ENTRADAS.map(({ a, texto, Icono }) => (
            <li key={a}>
              <NavLink
                to={a}
                end={a === '/'}
                className={({ isActive }) =>
                  [
                    'flex min-h-[44px] items-center gap-2.5 rounded-pieza px-2.5 text-menuda',
                    'transition-colors duration-150',
                    // Píldora sólida en el acento. Fondo suave + borde + texto
                    // de color eran tres señales para decir una cosa y se veía
                    // recargado; y el blanco sobre gris no se distinguía. Una
                    // píldora llena no deja duda y es lo que hacen las
                    // herramientas actuales.
                    isActive
                      ? 'bg-accion font-semibold text-white shadow-[0_1px_2px_rgba(99,91,255,0.35)]'
                      : 'font-medium text-tinta2 hover:bg-[rgba(24,24,27,0.05)] hover:text-tinta',
                  ].join(' ')
                }
              >
                <Icono tam={18} className="shrink-0" />
                {texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto px-5 pb-4 pt-4">
          <p className="text-menuda text-tinta3">Se respalda sola al abrir</p>
        </div>
      </nav>

      <main
        className="min-w-0 flex-1 px-7 py-6 xl:px-9"
        key={pathname === '/registrar-pago' ? 'pago' : pathname}
      >
        <div className="mx-auto w-full max-w-[1120px]">{children}</div>
      </main>
    </div>
  )
}
