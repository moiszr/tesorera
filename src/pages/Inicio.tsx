import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { cuentaRegresiva, fechaLarga, fechaRelativa } from '../lib/fechas'
import { calcularEstado, proporcionPagada } from '../lib/estados'
import { Boton, EstadoVacio, EtiquetaIglesia, Monto } from '../components/Piezas'
import { IconoAdelante, IconoAviso, IconoMas, IconoPago } from '../components/Iconos'

const NOMBRE_METODO: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  otro: 'Otro',
}

/**
 * Inicio es UNA hoja del libro, abierta: el encabezado con lo recaudado, la
 * línea de resumen, y debajo dos columnas regladas separadas por el doblez.
 * No son cuatro tarjetas sueltas: eso sería un panel de control, y esta app
 * es una libreta de tesorería.
 */
export default function Inicio() {
  const [datos, setDatos] = useState<Resumen | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api
      .resumen()
      .then(setDatos)
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <Esqueleto />

  if (!datos?.evento || !datos.totales) {
    return (
      <div className="hoja entra-hoja">
        <EstadoVacio
          titulo="Todavía no hay un evento"
          explicacion="Crea el evento de la convención con sus tipos de cupo y precios. Después podrás agregar personas y registrar sus pagos."
          accion={
            <Link to="/ajustes">
              <Boton variante="principal" grande>
                Crear el evento
              </Boton>
            </Link>
          }
        />
      </div>
    )
  }

  const { evento, totales, ultimos_pagos, iglesias } = datos
  const proporcion = proporcionPagada(totales.recaudado, totales.meta)
  const porciento = Math.round(proporcion * 100)
  // Lo que se cobró de más: sin esto, recaudado + falta no cuadra con la meta
  // y ella se queda mirando tres números que no suman.
  const excedente = totales.recaudado_real - totales.recaudado

  return (
    <div className="entra-hoja">
      <header className="mb-4">
        <h1 className="text-titulo font-semibold">{evento.nombre}</h1>
        <p className="mt-0.5 text-tinta2">
          {evento.fecha_inicio && (
            <>
              {fechaLarga(evento.fecha_inicio)} · {cuentaRegresiva(evento.fecha_inicio)}
            </>
          )}
        </p>
      </header>

      <div className="hoja overflow-hidden">
        {/* ── Cabecera de la página ───────────────────────────────────── */}
        <div className="px-6 pb-5 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="rotulo mb-1">Recaudado</p>
              <Monto centavos={totales.recaudado_real} tam="cifraEnorme" className="leading-none" />
            </div>
            <div className="text-right">
              <p className="rotulo mb-1">Falta por cobrar</p>
              <Monto centavos={totales.pendiente} tam="cifra" />
            </div>
          </div>

          <div className="mt-5">
            <div
              className="h-3 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--linea)' }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={porciento}
              aria-valuetext={`${porciento} por ciento de ${formatoRD(totales.meta)}`}
            >
              <div
                className="h-full origin-left rounded-full transition-transform duration-[420ms] ease-salida"
                style={{
                  // El color sale del mismo cálculo de estado que todo lo demás:
                  // verde solo cuando de verdad está cobrado completo.
                  background: `var(--${calcularEstado(totales.recaudado, totales.meta)}-marca)`,
                  transform: `scaleX(${proporcion})`,
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-menuda text-tinta2">
              <span>
                <span className="cifra font-medium text-tinta">{porciento}%</span> de lo que suman todos los
                cupos
              </span>
              <span className="cifra">Meta: {formatoRD(totales.meta)}</span>
            </div>
          </div>

          {/* Nota al pie, no alerta: una caja de color aquí compite con la cifra
              que tiene que mandar en la pantalla. */}
          {excedente > 0 && (
            <p className="mt-2.5 flex items-start gap-1.5 text-menuda text-tinta2">
              <IconoAviso tam={15} className="mt-0.5 shrink-0 text-tinta3" />
              <span>
                Incluye <span className="cifra font-medium text-tinta">{formatoRD(excedente)}</span> de pagos
                de más, por eso lo recaudado y lo que falta no suman justo la meta.
              </span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to="/registrar-pago">
              <Boton variante="principal" grande icono={<IconoPago tam={19} />}>
                Registrar pago
              </Boton>
            </Link>
            <Link to="/personas?nueva=1">
              <Boton variante="contorno" grande icono={<IconoMas tam={19} />}>
                Agregar persona
              </Boton>
            </Link>
          </div>
        </div>

        {/* ── Línea de resumen, como el renglón de totales de una libreta ── */}
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y border-linea bg-hoja2 px-6 py-3">
          <Cuenta n={totales.inscritos} rotulo="inscritos" />
          <Cuenta n={totales.pagados} rotulo="pagaron completo" tono="var(--pagado-tinta)" />
          <Cuenta n={totales.abonando} rotulo="abonando" tono="var(--abonando-tinta)" />
          <Cuenta n={totales.sinpagos} rotulo="sin pagos" tono="var(--sinpagos-tinta)" />
        </div>

        {/* ── El doblez del libro: dos columnas regladas ──────────────── */}
        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-linea">
          <section className="min-w-0">
            <div className="flex items-baseline justify-between gap-3 px-6 pb-2 pt-4">
              <h2 className="font-semibold">Últimos pagos</h2>
              <Link
                to="/personas"
                className="inline-flex items-center gap-1 text-menuda text-tinta2 underline-offset-4 hover:text-accion hover:underline"
              >
                Ver todas
                <IconoAdelante tam={15} />
              </Link>
            </div>

            {ultimos_pagos.length === 0 ? (
              <EstadoVacio
                titulo="Todavía no hay ningún pago"
                explicacion="Cuando alguien abone, aquí aparecerán los ocho más recientes."
                accion={
                  <Link to="/registrar-pago">
                    <Boton variante="principal">Registrar el primero</Boton>
                  </Link>
                }
              />
            ) : (
              <>
                <div className="flex border-b border-linea px-6 py-2">
                  <span className="rotulo flex-1">Quién</span>
                  <span className="rotulo">Abonó</span>
                </div>
                <ul >
                  {ultimos_pagos.map((p, i) => (
                    <li key={p.id} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                      <Link
                        to={`/personas/${p.persona_id}`}
                        className="flex min-h-[52px] items-center gap-3 px-6 py-2 transition-colors duration-150 hover:bg-[rgba(138,51,64,0.05)]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{p.persona}</span>
                          <span className="text-menuda text-tinta2">
                            {fechaRelativa(p.fecha)} · {NOMBRE_METODO[p.metodo] ?? 'Otro'}
                          </span>
                        </span>
                        <Monto centavos={p.monto} tam="guia" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="min-w-0 border-t border-linea lg:border-t-0">
            <div className="px-6 pb-2 pt-4">
              <h2 className="font-semibold">Por iglesia</h2>
            </div>
            {iglesias.length === 0 ? (
              <p className="px-6 py-8 text-tinta2">
                Cuando agregues personas con su iglesia, aquí verás cuánto lleva cada una.
              </p>
            ) : (
              <>
                <div className="flex border-b border-linea px-6 py-2">
                  <span className="rotulo flex-1">Iglesia</span>
                  <span className="rotulo w-[104px] text-right">Recaudado</span>
                  <span className="rotulo w-[104px] text-right">Falta</span>
                </div>
                {/* Sin barras: dos columnas de cifras dicen lo mismo y no dejan
                    nada colgando debajo del renglón. */}
                <ul>
                  {iglesias.map((g, i) => (
                    <li key={g.nombre} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                      <div className="flex min-h-[58px] items-center px-6 py-2.5">
                        <span className="min-w-0 flex-1 pr-4">
                          <EtiquetaIglesia
                            nombre={g.nombre}
                            color={g.color}
                            className="!text-base !text-tinta"
                          />
                          <span className="mt-0.5 block text-menuda text-tinta2">
                            {g.personas} {g.personas === 1 ? 'persona' : 'personas'}
                          </span>
                        </span>
                        <Monto
                          centavos={g.recaudado}
                          tam="base"
                          className="w-[104px] shrink-0 text-right font-medium"
                        />
                        <Monto
                          centavos={g.pendiente}
                          tam="base"
                          className="w-[104px] shrink-0 text-right"
                          tenue
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

/** Un dato del renglón de resumen: la cifra manda, el rótulo la acompaña. */
function Cuenta({ n, rotulo, tono }: { n: number; rotulo: string; tono?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="cifra text-cifra font-semibold leading-none" style={tono ? { color: tono } : undefined}>
        {n}
      </span>
      <span className="text-menuda text-tinta2">{rotulo}</span>
    </span>
  )
}

function Esqueleto() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Cargando">
      <div className="mb-4 h-7 w-64 rounded bg-linea" />
      <div className="hoja p-6">
        <div className="h-14 w-72 rounded bg-linea" />
        <div className="mt-6 h-3 w-full rounded-full bg-linea" />
        <div className="mt-6 h-[52px] w-56 rounded-pieza bg-linea" />
        <div className="mt-8 h-px w-full bg-linea" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-64 rounded bg-linea/50" />
          <div className="h-64 rounded bg-linea/50" />
        </div>
      </div>
    </div>
  )
}
