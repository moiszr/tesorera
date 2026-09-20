import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/cliente'
import type { Resumen } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { cuentaRegresiva, fechaLarga, fechaRelativa } from '../lib/fechas'
import { proporcionPagada } from '../lib/estados'
import { Boton, EstadoVacio, Monto, colorIglesia } from '../components/Piezas'
import { IconoMas, IconoPago, IconoAdelante } from '../components/Iconos'

export default function Inicio() {
  const [datos, setDatos] = useState<Resumen | null>(null)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    api
      .resumen()
      .then((r) => {
        if (vigente) {
          setDatos(r)
          setError('')
        }
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
    return () => {
      vigente = false
    }
  }, [revision])
  if (error)
    return (
      <div className="hoja">
        <EstadoVacio
          titulo="No pude cargar el resumen"
          explicacion={error}
          accion={<Boton onClick={() => setRevision((r) => r + 1)}>Volver a intentar</Boton>}
        />
      </div>
    )
  if (!datos)
    return (
      <p role="status" className="p-6">
        Cargando el resumen de tu evento…
      </p>
    )
  if (!datos.evento || !datos.totales)
    return (
      <div>
        <header className="cabecera-pagina">
          <div>
            <h1>Bienvenida a Tesorera</h1>
            <p>Prepara la convención y empieza a llevar tus cuentas.</p>
          </div>
        </header>
        <div className="hoja">
          <EstadoVacio
            titulo="Empecemos por tu evento"
            explicacion="Ponle un nombre y crea los tipos de cupo con sus precios. Después podrás agregar personas y registrar sus pagos."
            accion={
              <Link className="enlace-accion" to="/cupos">
                Preparar el evento
                <IconoAdelante />
              </Link>
            }
          />
        </div>
      </div>
    )
  const { evento, totales, ultimos_pagos, iglesias } = datos
  const proporcion = proporcionPagada(totales.recaudado, totales.meta)
  const porcentaje = Math.round(proporcion * 100)
  const excedente = totales.recaudado_real - totales.recaudado
  return (
    <div>
      <header className="cabecera-pagina">
        <div>
          <h1>Inicio</h1>
          <p>
            {evento.nombre}
            {evento.fecha_inicio && <> · {cuentaRegresiva(evento.fecha_inicio)}</>}
          </p>
        </div>
        <Link className="boton-enlace-principal" to="/personas">
          <IconoPago tam={20} />
          Registrar un pago
        </Link>
      </header>
      <div className="hoja inicio-balance">
        <section className="balance-principal" aria-label="Recaudación del evento">
          <p>Recaudado para la convención</p>
          <Monto centavos={totales.recaudado_real} tam="cifraEnorme" className="balance-monto" />
          <div
            className="h-2 overflow-hidden rounded-full bg-linea"
            role="progressbar"
            aria-label="Avance de los pagos"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentaje}
          >
            <div
              className="h-full origin-left rounded-full bg-accion"
              style={{ transform: `scaleX(${proporcion})` }}
            />
          </div>
          <div className="balance-meta">
            <span>
              <strong>{porcentaje}%</strong> de los cupos cubiertos
            </span>
            <span>Meta {formatoRD(totales.meta)}</span>
          </div>
          {excedente > 0 && (
            <p className="!mb-0 mt-3 text-menuda">Incluye {formatoRD(excedente)} de pagos de más.</p>
          )}
        </section>
        <dl className="balance-secundario">
          <div>
            <dt>Falta por cobrar</dt>
            <dd className="cifra">{formatoRD(totales.pendiente)}</dd>
          </div>
          <div>
            <dt>Personas inscritas</dt>
            <dd className="cifra">
              {totales.inscritos}
              <small>{totales.pagados} pagaron completo</small>
            </dd>
          </div>
          <div>
            <dt>Fecha del evento</dt>
            <dd className="!text-base">
              {evento.fecha_inicio ? fechaLarga(evento.fecha_inicio) : 'Por definir'}
            </dd>
          </div>
          <div>
            <dt>Inscribir a alguien</dt>
            <dd>
              <Link className="enlace-accion" to="/personas?nueva=1">
                <IconoMas tam={17} />
                Agregar persona
              </Link>
            </dd>
          </div>
        </dl>
      </div>
      <div className="inicio-estados" aria-label="Personas por estado de pago">
        {[
          { estado: 'pagado', color: 'pagado', nombre: 'Pagaron completo', cantidad: totales.pagados },
          { estado: 'abonando', color: 'abonando', nombre: 'Están abonando', cantidad: totales.abonando },
          { estado: 'sinpagos', color: 'sinpagos', nombre: 'Sin pagos todavía', cantidad: totales.sinpagos },
        ].map((e) => (
          <Link key={e.estado} to={`/personas?estado=${e.estado}`}>
            <span className="punto-estado" style={{ background: `var(--${e.color}-marca)` }} />
            <strong>{e.cantidad}</strong>
            {e.nombre}
          </Link>
        ))}
      </div>
      <div className="inicio-listas">
        <section className="hoja overflow-hidden">
          <header className="seccion-cabecera">
            <h2>Últimos pagos</h2>
            <Link className="enlace-accion" to="/personas">
              Ver personas
              <IconoAdelante tam={16} />
            </Link>
          </header>
          {ultimos_pagos.length ? (
            <ul>
              {ultimos_pagos.map((p) => (
                <li key={p.id} className="renglon">
                  <Link to={`/personas?persona=${p.persona_id}`} className="pago-reciente">
                    <div>
                      <strong>{p.persona}</strong>
                      <small>
                        {fechaRelativa(p.fecha)} ·{' '}
                        {p.metodo === 'efectivo'
                          ? 'Efectivo'
                          : p.metodo === 'transferencia'
                            ? 'Transferencia'
                            : 'Otro'}
                      </small>
                    </div>
                    <Monto centavos={p.monto} className="font-semibold" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              titulo="El primer abono empieza aquí"
              explicacion="Busca a la persona y escribe cuánto está pagando."
              accion={
                <Link className="enlace-accion" to="/personas">
                  Ir a Personas
                </Link>
              }
            />
          )}
        </section>
        <section className="hoja overflow-hidden">
          <header className="seccion-cabecera">
            <h2>Por iglesia</h2>
            <Link className="enlace-accion" to="/reporte">
              Ver reporte
              <IconoAdelante tam={16} />
            </Link>
          </header>
          {iglesias.length ? (
            <ul>
              {iglesias.map((g) => (
                <li key={g.nombre} className="renglon p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="punto-estado mt-2 shrink-0"
                      style={{ background: colorIglesia(g.color) }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold">{g.nombre}</h3>
                      <p className="text-menuda text-tinta2 mt-1">
                        {g.personas} personas · falta {formatoRD(g.pendiente)}
                      </p>
                      <p className="mt-3 text-menuda text-tinta2">
                        Recaudado <Monto centavos={g.recaudado} className="ml-1 font-semibold text-tinta" />
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              titulo="Cada iglesia tiene su lugar"
              explicacion="Agrega las iglesias participantes y asígnalas a las personas para ver sus cuentas."
              accion={
                <Link className="enlace-accion" to="/iglesias">
                  Agregar iglesias
                </Link>
              }
            />
          )}
        </section>
      </div>
    </div>
  )
}
