import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD, soloNumero } from '../lib/dinero'
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
 * Inicio responde tres preguntas y nada más: cuánto se lleva, cuánto falta y
 * quién pagó últimamente. Todo lo demás vive en Personas.
 *
 * La cifra recaudada es el objeto de la pantalla: se le da el tamaño y el aire
 * que le corresponde en vez de meterla en una tarjeta con borde, que es lo que
 * la hacía parecer una ficha de formulario.
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
      <div className="hoja entra-hoja mx-auto max-w-[560px]">
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
  const excedente = totales.recaudado_real - totales.recaudado

  return (
    <div className="entra-hoja">
      {/* ── La cifra, sin caja ──────────────────────────────────────────── */}
      <header className="mb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-titulo font-semibold">{evento.nombre}</h1>
          {evento.fecha_inicio && (
            <p className="text-tinta2">
              {fechaLarga(evento.fecha_inicio)}
              <span className="text-tinta3"> · {cuentaRegresiva(evento.fecha_inicio)}</span>
            </p>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <p className="rotulo mb-1">Recaudado</p>
            <p className="cifra text-cifraTitular font-semibold">
              <span className="mr-2.5 align-baseline text-[0.34em] font-medium text-tinta2">RD$</span>
              {soloNumero(totales.recaudado_real)}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-x-9 gap-y-4">
            <Cifra rotulo="Falta por cobrar" valor={formatoRD(totales.pendiente)} />
            <Cifra rotulo="Meta" valor={formatoRD(totales.meta)} tenue />
          </div>
        </div>

        <div className="mt-6">
          <div
            className="h-2 w-full overflow-hidden rounded-full"
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
                background: `var(--${calcularEstado(totales.recaudado, totales.meta)}-marca)`,
                transform: `scaleX(${proporcion})`,
              }}
            />
          </div>

          {/* El reparto de la gente, leído como una frase y no como cuatro
              cuadritos de panel de control. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-menuda text-tinta2">
            <span className="cifra font-semibold text-tinta">{porciento}%</span>
            <span>cobrado ·</span>
            <Reparto n={totales.inscritos} texto="inscritos" />
            <Punto />
            <Reparto n={totales.pagados} texto="completos" tono="var(--pagado-tinta)" />
            <Punto />
            <Reparto n={totales.abonando} texto="abonando" tono="var(--abonando-tinta)" />
            <Punto />
            <Reparto n={totales.sinpagos} texto="sin pagos" />
          </div>
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
      </header>

      {/* ── Las dos listas ──────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <section className="hoja overflow-hidden">
          <div className="flex items-baseline justify-between gap-3 px-5 py-3.5">
            <h2 className="font-semibold">Últimos pagos</h2>
            <Link
              to="/personas"
              className="inline-flex items-center gap-1 text-menuda text-tinta2 underline-offset-4 transition-colors hover:text-accion hover:underline"
            >
              Ver todas
              <IconoAdelante tam={15} />
            </Link>
          </div>

          {ultimos_pagos.length === 0 ? (
            <div className="px-5 pb-8 pt-2 text-center">
              <p className="text-tinta2">Cuando alguien abone, aparecerá aquí.</p>
              <Link to="/registrar-pago">
                <Boton variante="principal" className="mt-4">
                  Registrar el primero
                </Boton>
              </Link>
            </div>
          ) : (
            <ul className="border-t border-linea">
              {ultimos_pagos.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                  <Link
                    to={`/personas/${p.persona_id}`}
                    className="flex min-h-[50px] items-center gap-3 px-5 py-2 transition-colors duration-150 hover:bg-hoja2"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{p.persona}</span>
                    <span className="shrink-0 text-menuda text-tinta2">
                      {fechaRelativa(p.fecha)}
                      <span className="hidden sm:inline"> · {NOMBRE_METODO[p.metodo] ?? 'Otro'}</span>
                    </span>
                    <Monto centavos={p.monto} className="w-[104px] shrink-0 text-right font-medium" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="hoja overflow-hidden">
          <div className="px-5 py-3.5">
            <h2 className="font-semibold">Por iglesia</h2>
          </div>
          {iglesias.length === 0 ? (
            <p className="px-5 pb-8 text-tinta2">
              Cuando agregues personas con su iglesia, aquí verás cuánto lleva cada una.
            </p>
          ) : (
            <>
              <div className="flex border-y border-linea px-5 py-2">
                <span className="rotulo flex-1">Iglesia</span>
                <span className="rotulo w-[100px] shrink-0 text-right">Recaudado</span>
                <span className="rotulo w-[100px] shrink-0 text-right">Falta</span>
              </div>
              <ul>
                {iglesias.map((g, i) => (
                  <li key={g.nombre} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                    <div className="flex min-h-[50px] items-center px-5 py-2">
                      <span className="min-w-0 flex-1 overflow-hidden pr-3">
                        <EtiquetaIglesia
                          nombre={g.nombre}
                          color={g.color}
                          className="!text-base !text-tinta"
                        />
                        <span className="block text-menuda text-tinta2">
                          {g.personas} {g.personas === 1 ? 'persona' : 'personas'}
                        </span>
                      </span>
                      <Monto
                        centavos={g.recaudado}
                        className="w-[100px] shrink-0 text-right font-medium"
                      />
                      <Monto centavos={g.pendiente} className="w-[100px] shrink-0 text-right" tenue />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

/** Una cifra de apoyo del encabezado. */
function Cifra({ rotulo, valor, tenue }: { rotulo: string; valor: string; tenue?: boolean }) {
  return (
    <div>
      <p className="rotulo mb-1">{rotulo}</p>
      <p className={`cifra text-cifra font-semibold leading-none ${tenue ? 'text-tinta2' : ''}`}>{valor}</p>
    </div>
  )
}

function Reparto({ n, texto, tono }: { n: number; texto: string; tono?: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="cifra font-semibold" style={tono ? { color: tono } : { color: 'var(--tinta)' }}>
        {n}
      </span>{' '}
      {texto}
    </span>
  )
}

function Punto() {
  return (
    <span aria-hidden className="text-tinta3">
      ·
    </span>
  )
}

function Esqueleto() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Cargando">
      <div className="h-7 w-72 rounded bg-linea" />
      <div className="mt-7 h-16 w-80 rounded bg-linea" />
      <div className="mt-6 h-2 w-full rounded-full bg-linea" />
      <div className="mt-6 h-[52px] w-64 rounded-pieza bg-linea" />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="hoja h-72" />
        <div className="hoja h-72" />
      </div>
    </div>
  )
}
