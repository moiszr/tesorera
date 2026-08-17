import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { cuentaRegresiva, fechaLarga, fechaRelativa } from '../lib/fechas'
import { proporcionPagada } from '../lib/estados'
import { Boton, EstadoVacio, EtiquetaIglesia, Monto } from '../components/Piezas'
import { IconoAdelante, IconoAviso, IconoMas, IconoPago } from '../components/Iconos'

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

      {/* Fila de métricas: cuatro tarjetas iguales, que es como se lee un
          panel de datos actual. Antes era un bloque con una cifra de 56px y
          un renglón de conteos; la cifra gigante no se leía mejor, solo se
          veía desproporcionada. */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          rotulo="Recaudado"
          valor={formatoRD(totales.recaudado_real)}
          apoyo={`${porciento}% de la meta`}
          fuerte
        />
        <Metrica
          rotulo="Falta por cobrar"
          valor={formatoRD(totales.pendiente)}
          apoyo={`Meta ${formatoRD(totales.meta)}`}
        />
        <Metrica
          rotulo="Inscritos"
          valor={String(totales.inscritos)}
          apoyo={`${totales.pagados} pagaron completo`}
        />
        <Metrica
          rotulo="Por cobrar"
          valor={String(totales.abonando + totales.sinpagos)}
          apoyo={`${totales.abonando} abonando · ${totales.sinpagos} sin pagos`}
        />
      </div>

      {/* Progreso y acciones */}
      <div className="hoja mb-4 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-menuda font-medium">
            <span className="cifra text-tinta">{porciento}%</span>{' '}
            <span className="text-tinta2">de lo que suman todos los cupos</span>
          </p>
          <p className="text-menuda text-tinta2">
            <span className="cifra">{formatoRD(totales.recaudado_real)}</span> de{' '}
            <span className="cifra">{formatoRD(totales.meta)}</span>
          </p>
        </div>

        <div
          className="mt-2.5 h-2 w-full overflow-hidden rounded-full"
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
              background: proporcion >= 1 ? 'var(--pagado-marca)' : 'var(--accion)',
              transform: `scaleX(${proporcion})`,
            }}
          />
        </div>

        {excedente > 0 && (
          <p className="mt-2.5 flex items-start gap-1.5 text-menuda text-tinta2">
            <IconoAviso tam={15} className="mt-0.5 shrink-0 text-tinta3" />
            <span>
              Incluye <span className="cifra font-medium text-tinta">{formatoRD(excedente)}</span> de pagos
              de más, por eso lo recaudado y lo que falta no suman justo la meta.
            </span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/registrar-pago">
            <Boton variante="principal" icono={<IconoPago tam={18} />}>
              Registrar pago
            </Boton>
          </Link>
          <Link to="/personas?nueva=1">
            <Boton variante="contorno" icono={<IconoMas tam={18} />}>
              Agregar persona
            </Boton>
          </Link>
        </div>
      </div>

      {/* Las dos listas */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <section className="hoja overflow-hidden">
          <div className="flex items-baseline justify-between gap-3 border-b border-linea px-4 py-3">
            <h2 className="text-menuda font-semibold">Últimos pagos</h2>
            <Link
              to="/personas"
              className="inline-flex items-center gap-1 text-menuda text-tinta2 underline-offset-4 transition-colors hover:text-accionTexto hover:underline"
            >
              Ver todas
              <IconoAdelante tam={14} />
            </Link>
          </div>

          {ultimos_pagos.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-menuda text-tinta2">Cuando alguien abone, aparecerá aquí.</p>
              <Link to="/registrar-pago">
                <Boton variante="principal" className="mt-3">
                  Registrar el primero
                </Boton>
              </Link>
            </div>
          ) : (
            <ul>
              {ultimos_pagos.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                  <Link
                    to={`/personas/${p.persona_id}`}
                    className="flex min-h-[46px] items-center gap-3 px-4 py-1.5 transition-colors duration-150 hover:bg-hoja2"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{p.persona}</span>
                    <span className="shrink-0 text-menuda text-tinta3">
                      {fechaRelativa(p.fecha)}
                    </span>
                    <Monto centavos={p.monto} className="w-[96px] shrink-0 text-right font-medium" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="hoja overflow-hidden">
          <div className="border-b border-linea px-4 py-3">
            <h2 className="text-menuda font-semibold">Por iglesia</h2>
          </div>
          {iglesias.length === 0 ? (
            <p className="px-4 py-8 text-center text-menuda text-tinta2">
              Cuando agregues personas con su iglesia, aquí verás cuánto lleva cada una.
            </p>
          ) : (
            <ul>
              {iglesias.map((g, i) => (
                <li key={g.nombre} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                  <div className="px-4 py-2.5">
                    <div className="flex items-baseline gap-3">
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <EtiquetaIglesia
                          nombre={g.nombre}
                          color={g.color}
                          className="!text-base !text-tinta"
                        />
                      </span>
                      <Monto centavos={g.recaudado} className="shrink-0 font-medium" />
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span
                        className="h-1 flex-1 overflow-hidden rounded-full"
                        style={{ background: 'var(--linea)' }}
                        aria-hidden
                      >
                        <span
                          className="block h-full origin-left rounded-full transition-transform duration-[420ms] ease-salida"
                          style={{
                            background:
                              g.pendiente === 0 ? 'var(--pagado-marca)' : 'var(--accion)',
                            transform: `scaleX(${proporcionPagada(g.meta - g.pendiente, g.meta)})`,
                          }}
                        />
                      </span>
                      <span className="shrink-0 text-menuda text-tinta3">
                        <span className="cifra">{g.personas}</span> personas · falta{' '}
                        <span className="cifra">{formatoRD(g.pendiente)}</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

/**
 * Una métrica del panel. Rótulo arriba, cifra en el medio, apoyo debajo: el
 * apoyo es lo que evita que la cifra sea un número sin contexto.
 */
function Metrica({
  rotulo,
  valor,
  apoyo,
  fuerte,
}: {
  rotulo: string
  valor: string
  apoyo: string
  fuerte?: boolean
}) {
  // Las cuatro son idénticas. La jerarquía la da el orden y el tamaño de la
  // cifra, no pintar una de color: una tarjeta de color entre tres blancas se
  // lee como "seleccionada", no como "la más importante".
  return (
    <div className="hoja p-4">
      <p className="rotulo">{rotulo}</p>
      <p
        className={`cifra mt-1.5 font-semibold leading-none ${
          fuerte ? 'text-cifraGrande' : 'text-cifra'
        }`}
      >
        {valor}
      </p>
      <p className="mt-1.5 truncate text-menuda text-tinta3">{apoyo}</p>
    </div>
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
