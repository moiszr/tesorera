import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/cliente'
import type { Iglesia, ReporteDatos } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { fechaLarga, hoyISO } from '../lib/fechas'
import { Boton, Campo, ChipEstado, EstadoVacio } from '../components/Piezas'
import { IconoImprimir, IconoExportar } from '../components/Iconos'

const VISTAS = {
  iglesias: 'Por iglesia',
  pagos: 'Pagos recibidos',
  pendientes: 'Pendientes',
  habitaciones: 'Habitaciones',
}
type Vista = keyof typeof VISTAS

export default function Reporte() {
  const [params, setParams] = useSearchParams()
  const vista = ((params.get('vista') ?? '') in VISTAS ? params.get('vista') : 'iglesias') as Vista
  const desde = params.get('desde') ?? '',
    hasta = params.get('hasta') ?? '',
    iglesia = params.get('iglesia') ?? ''
  const consulta = new URLSearchParams({
    ...(desde ? { desde } : {}),
    ...(hasta ? { hasta } : {}),
    ...(iglesia ? { iglesia } : {}),
  }).toString()
  const [datos, setDatos] = useState<ReporteDatos | null>(null)
  const [iglesias, setIglesias] = useState<Iglesia[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let vigente = true
    setCargando(true)
    api
      .reporte(consulta)
      .then((r) => {
        if (vigente) {
          setDatos(r)
          setError('')
        }
      })
      .catch((e) => {
        if (vigente) setError(e.message)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [consulta, revision])
  useEffect(() => {
    api
      .iglesias()
      .then(setIglesias)
      .catch(() => {})
  }, [])
  function parametro(clave: string, valor: string) {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (valor) p.set(clave, valor)
        else p.delete(clave)
        return p
      },
      { replace: true },
    )
  }
  const periodo =
    desde || hasta
      ? `${desde ? fechaLarga(desde) : 'Inicio del evento'} — ${hasta ? fechaLarga(hasta) : 'Todos los pagos'}`
      : 'Todos los pagos del evento'
  if (!cargando && !error && !datos?.evento)
    return (
      <EstadoVacio
        titulo="Todavía no hay un evento"
        explicacion="Prepara tu evento para ver sus cuentas y organizar el alojamiento."
        accion={
          <Link className="enlace-accion" to="/ajustes">
            Ir a Ajustes
          </Link>
        }
      />
    )
  const total = datos?.totales
  const meses = new Map<string, number>()
  datos?.dias.forEach((d) => meses.set(d.fecha.slice(0, 7), (meses.get(d.fecha.slice(0, 7)) ?? 0) + d.monto))
  const maxMes = Math.max(...meses.values(), 1)
  return (
    <div className="reportes-pagina">
      <header className="cabecera-pagina">
        <div>
          <h1>Reportes</h1>
          <p>
            {datos?.evento?.nombre ?? 'Las cuentas de tu evento'} · Al {fechaLarga(hoyISO())}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-imprimir">
          {!cargando && !error && (
            <a className="enlace-accion px-3" href={`/api/reporte.csv?${consulta}&tipo=${vista}`} download>
              <IconoExportar tam={18} /> Descargar tabla
            </a>
          )}
          <Boton
            variante="principal"
            icono={<IconoImprimir tam={18} />}
            disabled={cargando || !!error}
            onClick={() => window.print()}
          >
            Imprimir reporte
          </Boton>
        </div>
      </header>
      <div className="reporte-filtros hoja no-imprimir">
        <label className="campo-etiqueta">
          Iglesia
          <select
            className="campo-select"
            value={iglesia}
            onChange={(e) => parametro('iglesia', e.target.value)}
          >
            <option value="">Todas las iglesias</option>
            {iglesias.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
            <option value="sin">Sin iglesia asignada</option>
          </select>
        </label>
        <Campo
          etiqueta="Pagos desde"
          type="date"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => parametro('desde', e.target.value)}
        />
        <Campo
          etiqueta="Pagos hasta"
          type="date"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => parametro('hasta', e.target.value)}
        />
        <Boton variante="texto" onClick={() => setParams({ vista })} disabled={!desde && !hasta && !iglesia}>
          Quitar filtros
        </Boton>
      </div>
      <p className="reporte-alcance">
        {iglesia
          ? (iglesias.find((g) => String(g.id) === iglesia)?.nombre ?? 'Sin iglesia asignada')
          : 'Todas las iglesias'}{' '}
        · {periodo}
      </p>
      {error ? (
        <EstadoVacio
          titulo="No pude preparar este reporte"
          explicacion={error}
          accion={<Boton onClick={() => setRevision((r) => r + 1)}>Volver a intentar</Boton>}
        />
      ) : cargando ? (
        <div className="hoja h-96 animate-pulse" aria-label="Cargando reporte" aria-busy="true" />
      ) : (
        datos &&
        total && (
          <>
            <div className="reporte-cifras hoja">
              <div>
                <span>Cobrado en el período</span>
                <strong className="cifra">{formatoRD(total.periodo)}</strong>
                <small>
                  {datos.pagos.length} {datos.pagos.length === 1 ? 'pago recibido' : 'pagos recibidos'}
                  {datos.anulados ? ` · ${datos.anulados} anulados excluidos` : ''}
                </small>
              </div>
              <div>
                <span>Recaudado acumulado</span>
                <strong className="cifra">{formatoRD(total.recaudado)}</strong>
                <small>De {formatoRD(total.meta)} a cobrar</small>
              </div>
              <div>
                <span>Falta por cobrar</span>
                <strong className="cifra">{formatoRD(total.pendiente)}</strong>
                <small>Saldo actual · {datos.pendientes.length} personas</small>
              </div>
            </div>
            <p className="reporte-aclaracion">
              Las fechas filtran los pagos recibidos. El acumulado y los pendientes muestran la cuenta actual
              del evento.
              {' Las personas archivadas no se incluyen en estos totales.'}
              {total.excedente > 0
                ? ` Hay ${formatoRD(total.excedente)} de excedente; no cubren el saldo de otras personas.`
                : ''}
            </p>
            <nav className="pestanas-reportes no-imprimir" aria-label="Tipo de reporte">
              {Object.entries(VISTAS).map(([k, t]) => (
                <button key={k} aria-pressed={vista === k} onClick={() => parametro('vista', k)}>
                  {t}
                </button>
              ))}
            </nav>
            {vista === 'iglesias' && (
              <>
                <section className="hoja reporte-iglesias">
                  <div className="seccion-titulo">
                    <h2>Lo recaudado por iglesia</h2>
                    <p>Compara lo recibido en el período y consulta el saldo actual de cada iglesia.</p>
                  </div>
                  {!datos.iglesias.length ? (
                    <EstadoVacio
                      titulo="Todavía no hay personas en este grupo"
                      explicacion="Agrega personas o elige otra iglesia para ver sus cuentas."
                    />
                  ) : (
                    <div className="tabla-desplazable">
                      <table className="tabla-reporte tabla-iglesias">
                        <thead>
                          <tr>
                            <th>Iglesia</th>
                            <th>En el período</th>
                            <th>Acumulado</th>
                            <th>Falta por cobrar</th>
                            <th>Pagaron completo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datos.iglesias.map((g) => (
                            <tr key={g.id ?? 'sin'}>
                              <td>
                                <Link to={g.id ? `/personas?iglesia=${g.id}` : '/personas'}>
                                  <strong>{g.nombre}</strong>
                                </Link>
                                <small>
                                  {g.personas} {g.personas === 1 ? 'persona' : 'personas'}
                                  {g.pastor ? ` · ${g.pastor}` : ''}
                                </small>
                                <div className="barra-reporte" aria-hidden>
                                  <span
                                    style={{
                                      width: `${Math.min(100, ((g.meta - g.pendiente) / Math.max(g.meta, 1)) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <small>
                                  {g.meta ? Math.round(((g.meta - g.pendiente) / g.meta) * 100) : 100}% del
                                  importe cubierto
                                </small>
                              </td>
                              <td className="importe-destacado">{formatoRD(g.periodo)}</td>
                              <td>{formatoRD(g.recaudado)}</td>
                              <td>{formatoRD(g.pendiente)}</td>
                              <td>
                                {g.pagados} de {g.personas}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Total</th>
                            <td>{formatoRD(total.periodo)}</td>
                            <td>{formatoRD(total.recaudado)}</td>
                            <td>{formatoRD(total.pendiente)}</td>
                            <td>
                              {total.pagados} de {total.personas}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </section>
                <div className="reporte-graficos">
                  <section className="hoja">
                    <div className="seccion-titulo">
                      <h2>Cómo avanzan los pagos</h2>
                      <p>Personas según su saldo actual.</p>
                    </div>
                    <div className="estados-reporte">
                      <div
                        className="barra-estados"
                        aria-label={`${total.pagados} pagados, ${total.abonando} abonando y ${total.sinpagos} sin pagos`}
                      >
                        {(['pagados', 'abonando', 'sinpagos'] as const).map((k, i) => (
                          <span
                            key={k}
                            style={{
                              width: `${(total[k] / Math.max(total.personas, 1)) * 100}%`,
                              background: `var(--${i === 0 ? 'pagado' : k}-marca)`,
                            }}
                          />
                        ))}
                      </div>
                      {(['pagado', 'abonando', 'sinpagos'] as const).map((k, i) => (
                        <div className="estado-reporte" key={k}>
                          <ChipEstado estado={k} />
                          <strong>{[total.pagados, total.abonando, total.sinpagos][i]} personas</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="hoja">
                    <div className="seccion-titulo">
                      <h2>Formas de pago</h2>
                      <p>Dinero recibido dentro del período.</p>
                    </div>
                    <div className="metodos-reporte">
                      {datos.metodos.map((m) => (
                        <div key={m.metodo}>
                          <span>
                            {m.metodo === 'efectivo'
                              ? 'Efectivo'
                              : m.metodo === 'transferencia'
                                ? 'Transferencia'
                                : 'Otro'}
                            <small>{m.cantidad} pagos</small>
                          </span>
                          <strong>{formatoRD(m.monto)}</strong>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <section className="hoja">
                  <div className="seccion-titulo">
                    <h2>Recaudación por mes</h2>
                    <p>Suma de los pagos del período, sin pagos anulados.</p>
                  </div>
                  {meses.size ? (
                    <div className="barras-meses">
                      {[...meses].map(([mes, monto]) => (
                        <div className="mes-reporte" key={mes}>
                          <span>
                            {new Date(mes + '-15T12:00:00').toLocaleDateString('es-DO', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <div className="barra-reporte" aria-hidden>
                            <span style={{ width: `${(monto / maxMes) * 100}%` }} />
                          </div>
                          <strong>{formatoRD(monto)}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-6 text-tinta2">No hay pagos dentro de estas fechas.</p>
                  )}
                </section>
                <section className="hoja">
                  <div className="seccion-titulo">
                    <h2>Por tipo de cupo</h2>
                    <p>Importes acumulados, incluidos los extras de habitación asignados.</p>
                  </div>
                  <div className="tabla-desplazable">
                    <table className="tabla-reporte">
                      <thead>
                        <tr>
                          <th>Tipo de cupo</th>
                          <th>Personas</th>
                          <th>Total a cobrar</th>
                          <th>Acumulado</th>
                          <th>Pendiente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datos.categorias.map((c) => (
                          <tr key={c.id}>
                            <td>{c.nombre}</td>
                            <td>{c.personas}</td>
                            <td>{formatoRD(c.meta)}</td>
                            <td>{formatoRD(c.recaudado)}</td>
                            <td>{formatoRD(c.pendiente)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
            {vista === 'pagos' && (
              <section className="hoja">
                <div className="seccion-titulo">
                  <h2>Pagos recibidos</h2>
                  <p>{periodo}. Los pagos anulados no se cuentan.</p>
                </div>
                {!datos.pagos.length ? (
                  <EstadoVacio
                    titulo="No hay pagos en este período"
                    explicacion="Prueba otras fechas o consulta el evento completo."
                  />
                ) : (
                  <div className="tabla-desplazable">
                    <table className="tabla-reporte">
                      <thead>
                        <tr>
                          <th>Persona</th>
                          <th>Fecha</th>
                          <th>Forma de pago</th>
                          <th>Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datos.pagos.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <Link to={`/personas?persona=${p.persona_id}`}>
                                <strong>{p.persona}</strong>
                              </Link>
                              <small>{p.iglesia ?? 'Sin iglesia'}</small>
                            </td>
                            <td>{fechaLarga(p.fecha)}</td>
                            <td>
                              {p.metodo === 'efectivo'
                                ? 'Efectivo'
                                : p.metodo === 'transferencia'
                                  ? 'Transferencia'
                                  : 'Otro'}
                            </td>
                            <td>
                              <Link className="enlace-accion cifra" to={`/comprobante/${p.id}`}>
                                {formatoRD(p.monto)}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
            {vista === 'pendientes' && (
              <section className="hoja">
                <div className="seccion-titulo">
                  <h2>Personas con saldo pendiente</h2>
                  <p>Ordenadas por lo que falta, sin importar las fechas del filtro de pagos.</p>
                </div>
                {!datos.pendientes.length ? (
                  <EstadoVacio
                    titulo="No hay saldos pendientes"
                    explicacion="Las cuentas de este grupo están al día."
                  />
                ) : (
                  <div className="tabla-desplazable">
                    <table className="tabla-reporte">
                      <thead>
                        <tr>
                          <th>Persona</th>
                          <th>Habitación</th>
                          <th>Estado</th>
                          <th>Le falta</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {datos.pendientes.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <strong>
                                {p.nombre}
                                {p.archivada ? ' · Archivada' : ''}
                              </strong>
                              <small>{p.iglesia ?? 'Sin iglesia'}</small>
                            </td>
                            <td>{p.habitacion ?? 'Sin asignar'}</td>
                            <td>
                              <ChipEstado estado={p.estado} />
                            </td>
                            <td>{formatoRD(p.balance)}</td>
                            <td>
                              <Link className="enlace-accion" to={`/personas?persona=${p.id}&pagar=1`}>
                                {p.archivada ? 'Ver cuenta' : 'Cobrar'}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
            {vista === 'habitaciones' && (
              <section className="hoja">
                <div className="seccion-titulo">
                  <h2>Distribución de habitaciones</h2>
                  <p>
                    {datos.alojamiento.habitaciones.length} habitaciones ·{' '}
                    {datos.alojamiento.sin_asignar.length} personas sin asignar. La distribución es actual; no
                    depende de las fechas de pago.
                    {iglesia ? ' Solo se muestran integrantes de la iglesia elegida.' : ''}
                  </p>
                </div>
                <div className="habitaciones-reporte">
                  {datos.alojamiento.habitaciones.map((h) => (
                    <section key={h.id}>
                      <h3>
                        <Link to={`/habitaciones?editar=${h.id}`}>{h.nombre}</Link>
                      </h3>
                      <p>
                        {h.categoria_privada_id ? 'Privada' : 'Compartida'} · Capacidad: {h.capacidad}
                        {h.extra_total > 0 ? ` · Extra total: ${formatoRD(h.extra_total)}` : ''}
                      </p>
                      <ul>
                        {h.integrantes.map((p) => (
                          <li key={p.id}>
                            <span>
                              {p.nombre}
                              <small>{p.iglesia ?? 'Sin iglesia'}</small>
                            </span>
                            <span>
                              {p.extra_habitacion ? `${formatoRD(p.extra_habitacion)} extra` : 'Sin extra'}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {!h.integrantes.length && <p>Sin integrantes.</p>}
                    </section>
                  ))}
                  {datos.alojamiento.sin_asignar.length > 0 && (
                    <section>
                      <h3>Sin habitación asignada</h3>
                      <ul>
                        {datos.alojamiento.sin_asignar.map((p) => (
                          <li key={p.id}>
                            <span>
                              {p.nombre}
                              <small>{p.iglesia ?? 'Sin iglesia'}</small>
                            </span>
                            <Link className="enlace-accion no-imprimir" to={`/habitaciones?persona=${p.id}`}>
                              Asignar
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {!datos.alojamiento.habitaciones.length && !datos.alojamiento.sin_asignar.length && (
                    <p className="p-5">Todavía no hay habitaciones ni personas por asignar.</p>
                  )}
                </div>
              </section>
            )}
          </>
        )
      )}
    </div>
  )
}
