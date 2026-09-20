import { CampoDinero } from './CampoDinero'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Categoria, Evento } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { Aviso, Boton, Campo, EstadoVacio } from './Piezas'
import { Confirmacion, Dialogo } from './Dialogo'
import { IconoArchivar, IconoBajar, IconoLapiz, IconoSubir } from './Iconos'

export function GestionCupos({
  evento,
  alCambiar,
  creando,
  alCerrarCrear,
}: {
  evento: Evento
  alCambiar: () => void
  creando: boolean
  alCerrarCrear: () => void
}) {
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [aArchivar, setAArchivar] = useState<Categoria | null>(null)
  const [trabajando, setTrabajando] = useState(false)

  const activas = evento.categorias.filter((c) => !c.archivada)
  const archivadas = evento.categorias.filter((c) => c.archivada)

  async function mover(c: Categoria, direccion: -1 | 1) {
    const lista = activas
    const i = lista.findIndex((x) => x.id === c.id)
    const j = i + direccion
    if (j < 0 || j >= lista.length) return
    try {
      await Promise.all([
        api.editarCategoria(c.id, { orden: lista[j].orden }),
        api.editarCategoria(lista[j].id, { orden: c.orden }),
      ])
      alCambiar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude reordenar.')
    }
  }

  async function archivar() {
    if (!aArchivar) return
    setTrabajando(true)
    try {
      await api.editarCategoria(aArchivar.id, { archivada: aArchivar.archivada ? 0 : 1 })
      toast.success(aArchivar.archivada ? 'Tipo de cupo devuelto' : 'Tipo de cupo archivado', {
        description: aArchivar.archivada
          ? 'Vuelve a aparecer al agregar personas.'
          : 'Ya no aparece al agregar personas. Quienes lo tienen no cambian.',
      })
      setAArchivar(null)
      alCambiar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude archivar.')
    } finally {
      setTrabajando(false)
    }
  }

  return (
    <section className="hoja lista-cupos">
      {activas.length === 0 ? (
        <EstadoVacio
          titulo="Este evento todavía no tiene tipos de cupo"
          explicacion="Pulsa Agregar tipo de cupo para crear el primero con su precio."
        />
      ) : (
        <>
          <div className="fila-cupo encabezado-lista" aria-hidden>
            <span>Tipo de cupo</span>
            <span>Personas</span>
            <span>Precio por persona</span>
            <span>Acciones</span>
          </div>
          <ul>
            {activas.map((c, i) => (
              <li key={c.id} className="fila-cupo">
                <div className="cupo-identidad">
                  <strong>{c.nombre}</strong>
                  <span>
                    {c.incluye_alojamiento ? 'Incluye alojamiento' : 'Sin alojamiento'}
                    {c.extra_privado !== null
                      ? ` · Privada: ${formatoRD(c.extra_privado)} extra por habitación`
                      : ''}
                  </span>
                </div>
                <Link
                  className="cupo-personas"
                  to={`/personas?categoria_id=${c.id}`}
                  aria-label={`Ver ${c.inscritos} personas de ${c.nombre}`}
                >
                  {c.inscritos}
                  <span> personas</span>
                </Link>
                <span className="cupo-importe cifra">{formatoRD(c.precio)}</span>
                <div className="acciones-cupo">
                  <div className="orden-cupo">
                    <BotonIcono
                      etiqueta={`Subir ${c.nombre}`}
                      onClick={() => mover(c, -1)}
                      deshabilitado={i === 0}
                    >
                      <IconoSubir tam={17} />
                    </BotonIcono>
                    <BotonIcono
                      etiqueta={`Bajar ${c.nombre}`}
                      onClick={() => mover(c, 1)}
                      deshabilitado={i === activas.length - 1}
                    >
                      <IconoBajar tam={17} />
                    </BotonIcono>
                  </div>
                  <Boton
                    className="accion-tarjeta accion-editar"
                    icono={<IconoLapiz tam={18} />}
                    aria-label={`Editar ${c.nombre}`}
                    onClick={() => setEditando(c)}
                  >
                    Editar
                  </Boton>
                  <Boton
                    variante="texto"
                    className="accion-tarjeta accion-archivar"
                    icono={<IconoArchivar tam={18} />}
                    aria-label={`Archivar ${c.nombre}`}
                    onClick={() => setAArchivar(c)}
                  >
                    Archivar
                  </Boton>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {archivadas.length > 0 && (
        <div className="border-t border-linea bg-hoja2 px-5 py-3">
          <p className="rotulo mb-2">Archivados</p>
          <ul className="space-y-1.5">
            {archivadas.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 text-menuda text-tinta2">
                <span className="min-w-0 flex-1 truncate">{c.nombre}</span>
                <span className="cifra">{formatoRD(c.precio)}</span>
                <span className="text-tinta3">
                  {c.inscritos} {c.inscritos === 1 ? 'persona' : 'personas'}
                </span>
                <Boton variante="texto" className="!min-h-[44px] !px-3" onClick={() => setAArchivar(c)}>
                  Devolver
                </Boton>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogoCategoria
        abierto={creando || editando !== null}
        alCerrar={() => {
          alCerrarCrear()
          setEditando(null)
        }}
        eventoId={evento.id}
        categoria={editando}
        alGuardar={() => {
          alCerrarCrear()
          setEditando(null)
          alCambiar()
        }}
      />

      <Confirmacion
        abierto={aArchivar !== null}
        alCerrar={() => setAArchivar(null)}
        alConfirmar={archivar}
        cargando={trabajando}
        titulo={
          aArchivar?.archivada ? `¿Devolver "${aArchivar?.nombre}"?` : `¿Archivar "${aArchivar?.nombre}"?`
        }
        textoConfirmar={aArchivar?.archivada ? 'Sí, devolverlo' : 'Sí, archivarlo'}
      >
        {aArchivar?.archivada ? (
          <p>Volverá a aparecer cuando agregues personas.</p>
        ) : (
          <p>
            No aparecerá al agregar personas. Las{' '}
            <span className="font-medium text-tinta">
              {aArchivar?.inscritos}{' '}
              {aArchivar?.inscritos === 1 ? 'persona que ya lo tiene' : 'personas que ya lo tienen'}
            </span>{' '}
            no cambian: conservan su precio y su historial.
          </p>
        )}
      </Confirmacion>
    </section>
  )
}

function BotonIcono({
  etiqueta,
  onClick,
  deshabilitado,
  children,
}: {
  etiqueta: string
  onClick: () => void
  deshabilitado?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      aria-label={etiqueta}
      title={etiqueta}
      className="flex h-11 w-11 items-center justify-center rounded-pieza text-tinta2 transition-colors duration-150 hover:bg-[rgba(24,24,27,0.06)] hover:text-tinta disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function DialogoCategoria({
  abierto,
  alCerrar,
  eventoId,
  categoria,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  eventoId: number
  categoria: Categoria | null
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [alojamiento, setAlojamiento] = useState(true)
  const [privado, setPrivado] = useState(false)
  const [extra, setExtra] = useState('1000')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [afectadas, setAfectadas] = useState<{ cuantas: number; precio: number } | null>(null)
  const [aplicando, setAplicando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(categoria?.nombre ?? '')
    setPrecio(categoria ? aTextoEditable(categoria.precio) : '')
    setAlojamiento(categoria?.incluye_alojamiento !== 0)
    setPrivado(categoria?.extra_privado != null)
    setExtra(aTextoEditable(categoria?.extra_privado ?? 100000))
    setProblema(null)
    setAfectadas(null)
  }, [abierto, categoria])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Ponle nombre, por ejemplo "Adulto — habitación familiar".')
      return
    }
    const valor = aCentavos(precio)
    if (valor === null || valor < 0) {
      setProblema('Escribe cuánto cuesta, por ejemplo 3,500.')
      return
    }

    const suplemento = privado ? aCentavos(extra) : null
    if (privado && (suplemento === null || suplemento < 0)) {
      setProblema('Escribe el extra total por habitación.')
      return
    }
    setGuardando(true)
    try {
      if (categoria) {
        await api.editarCategoria(categoria.id, {
          nombre: nombre.trim(),
          precio: valor,
          extra_privado: alojamiento ? suplemento : null,
          incluye_alojamiento: alojamiento,
        })
        const cambioPrecio = valor !== categoria.precio
        if (cambioPrecio) {
          // Nada se aplica solo: primero le decimos a cuántas personas afecta.
          const cuantas = await api.afectadas(categoria.id)
          if (cuantas.cuantas > 0) {
            setAfectadas(cuantas)
            setGuardando(false)
            return
          }
        }
        toast.success('Tipo de cupo actualizado')
      } else {
        await api.crearCategoria(eventoId, {
          nombre: nombre.trim(),
          precio: valor,
          extra_privado: alojamiento ? suplemento : null,
          incluye_alojamiento: alojamiento,
        })
        toast.success('Tipo de cupo creado')
      }
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  async function aplicar() {
    if (!categoria) return
    setAplicando(true)
    try {
      const r = await api.aplicarPrecio(categoria.id)
      toast.success(`Precio aplicado a ${r.cambiadas} ${r.cambiadas === 1 ? 'persona' : 'personas'}`)
      setAfectadas(null)
      alGuardar()
    } catch (err) {
      toast.error(err instanceof ErrorDeTesorera ? err.message : 'No pude aplicar el precio.')
    } finally {
      setAplicando(false)
    }
  }

  // Segundo paso: el precio ya cambió, ahora se decide a quién se le aplica.
  if (afectadas) {
    return (
      <Dialogo
        ocupado={aplicando}
        abierto={abierto}
        alCerrar={alGuardar}
        titulo="¿Se lo aplico a quienes ya están inscritos?"
      >
        <div className="space-y-4">
          <p className="text-tinta2">
            El precio nuevo es{' '}
            <span className="cifra font-medium text-tinta">{formatoRD(afectadas.precio)}</span>. Le cambiará
            el precio a{' '}
            <span className="font-medium text-tinta">
              {afectadas.cuantas} {afectadas.cuantas === 1 ? 'persona' : 'personas'}
            </span>{' '}
            que todavía no han pagado completo.
          </p>
          <Aviso>
            Nadie que ya pagó completo cambia, y tampoco cambia quien tenga un precio puesto a mano (becas o
            descuentos).
          </Aviso>
          <div className="flex flex-wrap justify-end gap-2 border-t border-linea pt-4">
            <Boton
              variante="texto"
              onClick={() => {
                setAfectadas(null)
                alGuardar()
              }}
            >
              No, dejarlos como están
            </Boton>
            <Boton variante="principal" onClick={aplicar} cargando={aplicando}>
              Sí, aplicar a {afectadas.cuantas}
            </Boton>
          </div>
        </div>
      </Dialogo>
    )
  }

  return (
    <Dialogo
      abierto={abierto}
      ocupado={guardando}
      alCerrar={alCerrar}
      titulo={categoria ? 'Editar tipo de cupo' : 'Agregar tipo de cupo'}
      ancho={820}
      pie={
        <>
          <Boton type="button" variante="texto" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" form="editar-tipo-cupo" variante="principal" cargando={guardando}>
            {categoria ? 'Guardar cambios' : 'Agregar'}
          </Boton>
        </>
      }
    >
      <form id="editar-tipo-cupo" onSubmit={guardar} className="editor-cupo">
        <div className="cupo-precio space-y-4">
          <Campo
            etiqueta="¿Cómo se llama?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Adulto — habitación familiar"
            ayuda="Por ejemplo, el tipo de alojamiento o la edad."
            autoFocus
          />
          <CampoDinero
            etiqueta="¿Cuánto cuesta?"
            value={precio}
            alCambiar={setPrecio}
            placeholder="3,500"
            inputMode="decimal"
            adorno={<span className="text-menuda font-medium">RD$</span>}
            className="cifra"
          />
        </div>
        <div className="opcion-privada">
          <label className="check-archivadas">
            <input
              type="checkbox"
              checked={alojamiento}
              onChange={(e) => {
                setAlojamiento(e.target.checked)
                if (!e.target.checked) setPrivado(false)
              }}
            />{' '}
            Incluye alojamiento
          </label>
          {!alojamiento && (
            <p className="text-menuda text-tinta2">
              Estas personas no aparecerán pendientes de asignar habitación.
            </p>
          )}
          {alojamiento && (
            <>
              <label className="check-archivadas">
                <input type="checkbox" checked={privado} onChange={(e) => setPrivado(e.target.checked)} />{' '}
                Ofrecer habitación privada
              </label>
              <p className="text-menuda text-tinta2">
                El precio del cupo es por persona. Este extra se cobra una sola vez por habitación y se
                reparte entre sus integrantes.
              </p>
              {privado && (
                <CampoDinero
                  etiqueta="Extra total por habitación"
                  value={extra}
                  alCambiar={setExtra}
                  inputMode="decimal"
                  adorno={<span>RD$</span>}
                  ayuda="Se aplicará al organizar una habitación privada. No se cobra al elegir el cupo."
                />
              )}
            </>
          )}
          {categoria?.extra_privado != null && (
            <p className="text-menuda text-tinta2">
              Las habitaciones ya creadas conservan su extra. Puedes actualizarlo al editar cada habitación.
            </p>
          )}
        </div>
        {categoria && categoria.inscritos > 0 && (
          <Aviso>
            {categoria.inscritos} {categoria.inscritos === 1 ? 'persona usa' : 'personas usan'} este tipo de
            cupo. Si cambias el precio, te preguntaré si se lo aplico a quienes no han pagado completo.
          </Aviso>
        )}
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
      </form>
    </Dialogo>
  )
}
