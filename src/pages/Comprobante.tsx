import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api/cliente'
import { formatoRD } from '../lib/dinero'
import { fechaLarga } from '../lib/fechas'
import { NOMBRE_ESTADO } from '../lib/estados'
import { Boton, Monto } from '../components/Piezas'
import { IconoImprimir, IconoVolver } from '../components/Iconos'

const NOMBRE_METODO: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  otro: 'Otro',
}

/**
 * El papelito que se le da al hermano que abonó: cuánto pagó y cuánto le falta.
 * Se imprime o se le saca una foto para mandarlo por WhatsApp.
 */
export default function Comprobante() {
  const { id } = useParams()
  const [datos, setDatos] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api
      .comprobante(Number(id))
      .then(setDatos)
      .catch((e) => toast.error(e.message))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <div className="hoja h-96 animate-pulse" aria-busy="true" />
  if (!datos) return <p className="text-tinta2">No encontré ese pago.</p>

  const { pago, cuenta } = datos

  return (
    <div className="entra-hoja">
      <div className="no-imprimir mx-auto mb-4 flex max-w-[560px] flex-wrap items-center justify-between gap-3">
        <Link
          to={`/personas/${pago.persona_id}`}
          className="inline-flex min-h-[44px] items-center gap-1 text-menuda text-tinta2 transition-colors hover:text-accion"
        >
          <IconoVolver tam={16} />
          Volver a {pago.persona.split(' ')[0]}
        </Link>
        <Boton variante="principal" icono={<IconoImprimir tam={18} />} onClick={() => window.print()}>
          Imprimir comprobante
        </Boton>
      </div>

      <div className="mx-auto max-w-[560px]">
        <article className="hoja overflow-hidden">
          {/* Cabecera del recibo */}
          <div className="border-b-2 border-tinta px-7 pb-4 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="rotulo">Comprobante de abono</p>
                <h1 className="mt-0.5 text-guia font-semibold leading-snug">{pago.evento}</h1>
              </div>
              <p className="cifra shrink-0 text-menuda text-tinta2">
                No. {String(pago.id).padStart(5, '0')}
              </p>
            </div>
          </div>

          <div className="px-7 py-5">
            <Renglon rotulo="Recibí de">
              <span className="font-semibold">{pago.persona}</span>
              {pago.iglesia && <span className="block text-menuda text-tinta2">{pago.iglesia}</span>}
            </Renglon>

            <Renglon rotulo="La cantidad de">
              <Monto centavos={pago.monto} tam="cifra" />
            </Renglon>

            <Renglon rotulo="Fecha">{fechaLarga(pago.fecha)}</Renglon>
            <Renglon rotulo="Forma de pago">{NOMBRE_METODO[pago.metodo] ?? 'Otro'}</Renglon>
            <Renglon rotulo="Por concepto de">{pago.categoria ?? 'Cupo de la convención'}</Renglon>
            {pago.nota && <Renglon rotulo="Nota">{pago.nota}</Renglon>}
          </div>

          {/* El estado de cuenta después de este abono */}
          <div className="border-t border-linea bg-hoja2 px-7 py-5">
            <p className="rotulo mb-3">Cómo va su cupo</p>
            <dl className="space-y-1.5">
              <ParClave clave="Precio del cupo" valor={formatoRD(cuenta.precio)} />
              <ParClave clave="Ha pagado" valor={formatoRD(cuenta.pagado)} />
              <div className="flex items-baseline justify-between gap-4 border-t border-linea pt-2 text-guia">
                <dt className="font-medium">
                  {cuenta.balance > 0 ? 'Le falta' : NOMBRE_ESTADO[cuenta.estado as 'pagado']}
                </dt>
                <dd className="cifra font-semibold">
                  {cuenta.balance > 0 ? formatoRD(cuenta.balance) : formatoRD(0)}
                </dd>
              </div>
            </dl>

            {cuenta.excedente > 0 && (
              <p className="mt-3 text-menuda text-tinta2">
                Pagó <span className="cifra">{formatoRD(cuenta.excedente)}</span> de más.
              </p>
            )}
          </div>

          <div className="border-t border-linea px-7 py-4">
            <p className="text-menuda text-tinta3">
              Emitido el {fechaLarga(new Date().toISOString().slice(0, 10))}. Guarde este comprobante.
            </p>
          </div>
        </article>

        <p className="no-imprimir mt-3 text-center text-menuda text-tinta2">
          También puedes tomarle una foto a esta pantalla y mandarla por WhatsApp.
        </p>
      </div>
    </div>
  )
}

function Renglon({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-dotted border-lineaFuerte py-3 last:border-b-0">
      <p className="rotulo mb-1">{rotulo}</p>
      <div>{children}</div>
    </div>
  )
}

function ParClave({ clave, valor }: { clave: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-tinta2">{clave}</dt>
      <dd className="cifra">{valor}</dd>
    </div>
  )
}
