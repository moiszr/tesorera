import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { fechaLarga } from '../lib/fechas'
import { Boton, EstadoVacio } from '../components/Piezas'
import { IconoImprimir, IconoVolver } from '../components/Iconos'

/** El papel que se le entrega al pastor o al comité para rendir cuentas. */
export default function Reporte() {
  const [datos, setDatos] = useState<Resumen | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api
      .resumen()
      .then(setDatos)
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <div className="hoja h-96 animate-pulse" aria-busy="true" />

  if (!datos?.evento || !datos.totales) {
    return (
      <div className="hoja">
        <EstadoVacio
          titulo="Todavía no hay un evento"
          explicacion="Cuando crees el evento y registres pagos, aquí podrás imprimir el reporte por iglesia."
          accion={
            <Link to="/ajustes">
              <Boton variante="principal">Ir a Ajustes</Boton>
            </Link>
          }
        />
      </div>
    )
  }

  const { evento, totales, iglesias, categorias } = datos
  const hoy = fechaLarga(new Date().toISOString().slice(0, 10))

  return (
    <div className="entra-hoja">
      <div className="no-imprimir mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/ajustes"
          className="inline-flex min-h-[36px] items-center gap-1 text-menuda text-tinta2 transition-colors hover:text-accion"
        >
          <IconoVolver tam={16} />
          Volver a Ajustes
        </Link>
        <Boton variante="principal" icono={<IconoImprimir tam={18} />} onClick={() => window.print()}>
          Imprimir reporte
        </Boton>
      </div>

      <article className="hoja overflow-hidden">
        <div className="border-b-2 border-tinta px-7 pb-4 pt-6">
          <p className="rotulo">Reporte de lo recaudado</p>
          <h1 className="mt-0.5 text-titulo font-semibold leading-snug">{evento.nombre}</h1>
          <p className="mt-0.5 text-menuda text-tinta2">Al {hoy}</p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-linea border-b border-linea sm:grid-cols-4">
          <Cifra rotulo="Recaudado" valor={formatoRD(totales.recaudado_real)} fuerte />
          <Cifra rotulo="Falta por cobrar" valor={formatoRD(totales.pendiente)} />
          <Cifra rotulo="Inscritos" valor={String(totales.inscritos)} />
          <Cifra rotulo="Pagaron completo" valor={String(totales.pagados)} />
        </div>

        <Tabla
          titulo="Por iglesia"
          columnas={['Iglesia', 'Personas', 'Recaudado', 'Falta']}
          filas={iglesias.map((g) => [
            g.nombre,
            String(g.personas),
            formatoRD(g.recaudado),
            formatoRD(g.pendiente),
          ])}
          total={[
            'Total',
            String(totales.inscritos),
            formatoRD(totales.recaudado_real),
            formatoRD(totales.pendiente),
          ]}
        />

        <Tabla
          titulo="Por tipo de cupo"
          columnas={['Tipo de cupo', 'Personas', 'Recaudado', 'Falta']}
          filas={categorias
            .filter((c) => c.personas > 0)
            .map((c) => [
              c.nombre,
              String(c.personas),
              formatoRD(c.recaudado),
              formatoRD(c.pendiente),
            ])}
        />

        <div className="px-7 py-8">
          <div className="mx-auto max-w-[320px] border-t border-tinta pt-2 text-center">
            <p className="text-menuda text-tinta2">Firma de quien entrega</p>
          </div>
        </div>
      </article>
    </div>
  )
}

function Cifra({ rotulo, valor, fuerte }: { rotulo: string; valor: string; fuerte?: boolean }) {
  return (
    <div className="px-5 py-4">
      <p className={`cifra leading-none ${fuerte ? 'text-cifra font-semibold' : 'text-guia font-medium'}`}>
        {valor}
      </p>
      <p className="rotulo mt-1.5">{rotulo}</p>
    </div>
  )
}

function Tabla({
  titulo,
  columnas,
  filas,
  total,
}: {
  titulo: string
  columnas: string[]
  filas: string[][]
  total?: string[]
}) {
  if (filas.length === 0) return null
  return (
    <section className="border-b border-linea last:border-b-0">
      <h2 className="px-7 pb-2 pt-5 font-semibold">{titulo}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr className="border-b border-lineaFuerte">
              {columnas.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`rotulo px-7 py-2 ${i === 0 ? 'text-left' : 'text-right'} ${i > 0 ? 'px-3' : ''}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, f) => (
              <tr key={f} className="border-b border-linea last:border-b-0 even:bg-hoja2">
                {fila.map((celda, i) => (
                  <td
                    key={i}
                    className={[
                      'py-2.5',
                      i === 0 ? 'px-7 text-left' : 'cifra px-3 text-right',
                      i === columnas.length - 1 ? 'pr-7' : '',
                    ].join(' ')}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {total && (
            <tfoot>
              <tr className="border-t-2 border-tinta font-semibold">
                {total.map((celda, i) => (
                  <td
                    key={i}
                    className={[
                      'py-2.5',
                      i === 0 ? 'px-7 text-left' : 'cifra px-3 text-right',
                      i === columnas.length - 1 ? 'pr-7' : '',
                    ].join(' ')}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  )
}
