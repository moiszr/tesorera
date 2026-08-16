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
 * El marco es el libro: lomo de tela a la izquierda, hoja a la derecha.
 * La navegación son las cuatro pestañas del libro; nunca hay más de cuatro.
 */
export function Marco({ evento, children }: { evento: Evento | null; children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen">
      <nav
        className="no-imprimir sticky top-0 flex h-screen w-[224px] shrink-0 flex-col bg-lomo text-lomoTexto"
        aria-label="Secciones"
      >
        <div className="px-5 pb-1 pt-6">
          <p className="text-titulo font-semibold tracking-[-0.015em] text-white">Tesorera</p>
          {evento ? (
            <p className="mt-1 text-menuda leading-snug text-[rgba(246,233,227,0.72)]">
              {evento.nombre}
              {evento.fecha_inicio && (
                <>
                  <br />
                  <span className="text-[rgba(246,233,227,0.58)]">
                    {cuentaRegresiva(evento.fecha_inicio)}
                  </span>
                </>
              )}
            </p>
          ) : (
            <p className="mt-1 text-menuda text-[rgba(246,233,227,0.72)]">Sin evento todavía</p>
          )}
        </div>

        <div className="mx-5 my-4 h-px bg-[rgba(246,233,227,0.16)]" />

        <ul className="flex flex-col gap-0.5 px-3">
          {ENTRADAS.map(({ a, texto, Icono }) => (
            <li key={a}>
              <NavLink
                to={a}
                end={a === '/'}
                className={({ isActive }) =>
                  [
                    'group relative flex min-h-[46px] items-center gap-3 rounded-pieza px-3 text-[1rem]',
                    'transition-colors duration-150',
                    isActive
                      ? 'bg-lomoAlto font-semibold text-white'
                      : 'text-[rgba(246,233,227,0.82)] hover:bg-[rgba(255,255,255,0.07)] hover:text-white',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {/* La pestaña marcada del libro */}
                    <span
                      aria-hidden
                      className={[
                        'absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#e8b4a0]',
                        'transition-opacity duration-150',
                        isActive ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                    />
                    <Icono tam={20} className="shrink-0 opacity-90" />
                    {texto}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto px-5 pb-5 pt-4">
          <p className="text-micro font-medium uppercase text-[rgba(246,233,227,0.45)]">
            Se respalda sola al abrir
          </p>
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
