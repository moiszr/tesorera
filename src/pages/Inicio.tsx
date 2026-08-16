import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD, soloNumero } from '../lib/dinero'
import { cuentaRegresiva, fechaLarga, fechaRelativa } from '../lib/fechas'
import { proporcionPagada } from '../lib/estados'
import { Boton, EstadoVacio, EtiquetaIglesia, Monto } from '../components/Piezas'
import { IconoAdelante, IconoMas, IconoPago } from '../components/Iconos'

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

  return (
    <div className="entra-hoja">
      <header className="mb-5">
        <h1 className="text-titulo font-semibold">{evento.nombre}</h1>
        <p className="mt-0.5 text-tinta2">
          {evento.fecha_inicio && (
            <>
              {fechaLarga(evento.fecha_inicio)} · {cuentaRegresiva(evento.fecha_inicio)}
            </>
          )}
        </p>
      </header>

      {/* Lo recaudado: el número más grande de la pantalla. */}
      <section className="hoja mb-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="rotulo mb-1">Recaudado</p>
            <p className="cifra text-cifraEnorme font-semibold leading-none tracking-[-0.03em]">
              <span className="mr-2 align-baseline text-[0.42em] font-medium text-tinta2">RD$</span>
              {soloNumero(totales.recaudado_real)}
            </p>
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
              style={{ background: 'var(--pagado-marca)', transform: `scaleX(${proporcion})` }}
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
      </section>

      {/* Cuatro cifras del evento */}
      <section className="hoja mb-5 grid grid-cols-2 divide-x divide-linea sm:grid-cols-4">
        <Cifra rotulo="Inscritos" valor={totales.inscritos} />
        <Cifra rotulo="Pagaron completo" valor={totales.pagados} tono="var(--pagado-tinta)" />
        <Cifra rotulo="Abonando" valor={totales.abonando} tono="var(--abonando-tinta)" />
        <Cifra rotulo="Sin pagos" valor={totales.sinpagos} tono="var(--sinpagos-tinta)" />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Últimos pagos */}
        <section className="hoja overflow-hidden">
          <div className="flex items-center justify-between border-b border-linea px-5 py-3.5">
            <h2 className="font-semibold">Últimos pagos</h2>
            <Link
              to="/personas"
              className="inline-flex items-center gap-1 text-menuda text-tinta2 underline-offset-4 hover:text-accion hover:underline"
            >
              Ver todas las personas
              <IconoAdelante tam={15} />
            </Link>
          </div>

          {ultimos_pagos.length === 0 ? (
            <EstadoVacio
              titulo="Todavía no se ha registrado ningún pago"
              explicacion="Cuando alguien abone, aquí aparecerán los últimos ocho pagos."
              accion={
                <Link to="/registrar-pago">
                  <Boton variante="principal">Registrar el primer pago</Boton>
                </Link>
              }
            />
          ) : (
            <ul>
              {ultimos_pagos.map((p, i) => (
                <li key={p.id} style={{ ['--i' as string]: i }} className="entra-renglon renglon">
                  <Link
                    to={`/personas/${p.persona_id}`}
                    className="flex min-h-[54px] items-center gap-3 px-5 py-2.5 transition-colors duration-150 hover:bg-[rgba(138,51,64,0.05)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.persona}</span>
                      <span className="text-menuda text-tinta2">
                        {fechaRelativa(p.fecha)} · {p.metodo === 'efectivo' ? 'Efectivo' : p.metodo === 'transferencia' ? 'Transferencia' : 'Otro'}
                      </span>
                    </span>
                    <Monto centavos={p.monto} tam="guia" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Por iglesia */}
        <section className="hoja overflow-hidden">
          <div className="border-b border-linea px-5 py-3.5">
            <h2 className="font-semibold">Por iglesia</h2>
          </div>
          {iglesias.length === 0 ? (
            <p className="px-5 py-8 text-center text-tinta2">
              Cuando agregues personas con su iglesia, aquí verás cuánto lleva cada una.
            </p>
          ) : (
            <ul className="px-5 py-2">
              {iglesias.map((g, i) => {
                const prop = proporcionPagada(g.meta - g.pendiente, g.meta)
                return (
                  <li
                    key={g.nombre}
                    style={{ ['--i' as string]: i }}
                    className="entra-renglon border-b border-linea py-3.5 last:border-b-0"
                  >
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <EtiquetaIglesia nombre={g.nombre} color={g.color} className="!text-base !text-tinta" />
                      <Monto centavos={g.recaudado} tam="base" className="font-medium" />
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full"
                      style={{ background: 'var(--linea)' }}
                    >
                      <div
                        className="h-full origin-left rounded-full transition-transform duration-[420ms] ease-salida"
                        style={{ background: 'var(--pagado-marca)', transform: `scaleX(${prop})` }}
                      />
                    </div>
                    <p className="mt-1.5 text-menuda text-tinta2">
                      {g.personas} {g.personas === 1 ? 'persona' : 'personas'} ·{' '}
                      <span className="cifra">falta {formatoRD(g.pendiente)}</span>
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Cifra({ rotulo, valor, tono }: { rotulo: string; valor: number; tono?: string }) {
  return (
    <div className="px-5 py-4">
      <p className="cifra text-cifra font-semibold leading-none" style={tono ? { color: tono } : undefined}>
        {valor}
      </p>
      <p className="rotulo mt-1.5">{rotulo}</p>
    </div>
  )
}

function Esqueleto() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Cargando">
      <div className="mb-5 h-7 w-64 rounded bg-linea" />
      <div className="hoja mb-5 p-6">
        <div className="h-14 w-72 rounded bg-linea" />
        <div className="mt-6 h-3 w-full rounded-full bg-linea" />
        <div className="mt-6 h-[52px] w-56 rounded-pieza bg-linea" />
      </div>
      <div className="hoja mb-5 h-[92px]" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="hoja h-72" />
        <div className="hoja h-72" />
      </div>
    </div>
  )
}
