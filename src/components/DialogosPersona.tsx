import { CambiosHabitacion } from './CambiosHabitacion'
import { formatoNombre } from '../lib/nombres'
import { CampoDinero } from './CampoDinero'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Evento, Ficha, Iglesia, PlanCupo } from '../api/tipos'
import { aCentavos, aTextoEditable, formatoRD } from '../lib/dinero'
import { Boton, Campo, colorIglesia } from './Piezas'
import { Dialogo } from './Dialogo'
import { Selector, type Opcion } from './Selector'

export function DialogoEditarPersona({
  abierto,
  alCerrar,
  ficha,
  iglesias,
  alGuardar,
  campoInicial = 'nombre',
}: {
  abierto: boolean
  alCerrar: () => void
  ficha: Ficha
  iglesias: Iglesia[]
  alGuardar: () => void
  campoInicial?: 'nombre' | 'iglesia' | 'telefono' | 'notas'
}) {
  const formulario = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!abierto) return
    const cuadro = requestAnimationFrame(() => {
      const selector =
        campoInicial === 'iglesia' ? '[data-propiedad="iglesia"] button' : `[name="${campoInicial}"]`
      formulario.current?.querySelector<HTMLElement>(selector)?.focus()
    })
    return () => cancelAnimationFrame(cuadro)
  }, [abierto, campoInicial])
  const [nombre, setNombre] = useState(ficha.persona.nombre)
  const [iglesiaId, setIglesiaId] = useState<number | undefined>(ficha.persona.iglesia_id ?? undefined)
  const [telefono, setTelefono] = useState(ficha.persona.telefono ?? '')
  const [notas, setNotas] = useState(ficha.persona.notas ?? '')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(ficha.persona.nombre)
    setIglesiaId(ficha.persona.iglesia_id ?? undefined)
    setTelefono(ficha.persona.telefono ?? '')
    setNotas(ficha.persona.notas ?? '')
    setProblema(null)
  }, [abierto, ficha])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('El nombre no puede quedar vacío.')
      return
    }
    setGuardando(true)
    try {
      await api.editarPersona(ficha.persona.id, {
        nombre: formatoNombre(nombre),
        iglesia_id: iglesiaId ?? null,
        telefono: telefono || null,
        notas: notas || null,
      })
      toast.success('Datos guardados')
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo ocupado={guardando} abierto={abierto} alCerrar={alCerrar} titulo="Editar persona" ancho={480}>
      <form ref={formulario} onSubmit={guardar} className="space-y-4">
        <Campo
          name="nombre"
          etiqueta="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setNombre(formatoNombre(nombre))}
          autoCapitalize="words"
          autoFocus={campoInicial === 'nombre'}
        />
        {iglesias.length > 0 && (
          <div data-propiedad="iglesia">
            <Selector
              etiqueta="Iglesia"
              opciones={iglesias.map((g) => ({
                id: g.id,
                etiqueta: g.nombre,
                detalle: g.pastor ? `Pastor ${g.pastor}` : undefined,
                color: colorIglesia(g.color),
              }))}
              valor={iglesiaId}
              alElegir={setIglesiaId}
              textoBuscar="Buscar iglesia…"
            />
          </div>
        )}
        <Campo
          name="telefono"
          etiqueta="Teléfono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <Campo name="notas" etiqueta="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            Guardar cambios
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}

// ── Cambiar tipo de cupo o precio ─────────────────────────────────────────

export function DialogoCupo({
  abierto,
  alCerrar,
  ficha,
  evento,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  ficha: Ficha
  evento: Evento | null
  alGuardar: () => void
}) {
  const inscripcion = ficha.inscripcion
  const [categoriaId, setCategoriaId] = useState<number | undefined>(inscripcion?.categoria_id)
  const [precio, setPrecio] = useState(aTextoEditable(inscripcion?.precio ?? 0))
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [plan, setPlan] = useState<PlanCupo | null>(null)
  const enCurso = useRef(false)

  const categorias = (evento?.categorias ?? []).filter(
    (c) => !c.archivada || c.id === inscripcion?.categoria_id,
  )
  const opcionesCupo: Opcion[] = categorias.map((c) => ({
    id: c.id,
    etiqueta: c.nombre,
    detalle: formatoRD(c.precio),
    detalleNumerico: true,
  }))
  const elegida = categorias.find((c) => c.id === categoriaId)
  const precioActual = aCentavos(precio)
  const difiere = elegida && precioActual !== null && precioActual !== elegida.precio

  useEffect(() => {
    if (!abierto) return
    setCategoriaId(inscripcion?.categoria_id)
    setPrecio(aTextoEditable(inscripcion?.precio ?? 0))
    setProblema(null)
    setPlan(null)
  }, [abierto, inscripcion])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (enCurso.current) return
    if (!categoriaId) {
      setProblema('Elige el tipo de cupo.')
      return
    }
    const valor = aCentavos(precio)
    if (valor === null || valor < 0) {
      setProblema('Escribe un precio válido.')
      return
    }

    enCurso.current = true
    setGuardando(true)
    try {
      if (!inscripcion) {
        await api.inscribir(ficha.persona.id, categoriaId, valor)
        toast.success(`${ficha.persona.nombre} quedó inscrita`)
      } else {
        const datos = {
          categoria_id: categoriaId,
          precio: valor,
          precio_a_mano:
            categoriaId === inscripcion.categoria_id && valor === inscripcion.precio
              ? inscripcion.precio_a_mano
              : Number(!!difiere),
        }
        if (!plan) {
          setPlan(await api.revisarCupo(inscripcion.id, datos))
          return
        }
        await api.editarInscripcion(inscripcion.id, { ...datos, firma: plan.firma })
        toast.success('Cupo actualizado')
      }
      alGuardar()
    } catch (err) {
      setPlan(null)
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      enCurso.current = false
      setGuardando(false)
    }
  }

  return (
    <Dialogo
      abierto={abierto}
      ocupado={guardando}
      alCerrar={alCerrar}
      titulo={inscripcion ? 'Cambiar tipo de cupo o precio' : 'Inscribir en el evento'}
      ancho={520}
    >
      <form onSubmit={guardar} className="space-y-4">
        {!plan ? (
          <>
            <fieldset disabled={guardando} className="space-y-4">
              <Selector
                etiqueta="Tipo de cupo"
                opciones={opcionesCupo}
                valor={categoriaId}
                alElegir={(id) => {
                  setCategoriaId(id)
                  const c = categorias.find((x) => x.id === id)
                  if (c) setPrecio(aTextoEditable(c.precio))
                  setProblema(null)
                }}
                textoBuscar="Buscar tipo de cupo…"
              />

              <CampoDinero
                etiqueta="Precio para esta persona"
                value={precio}
                alCambiar={setPrecio}
                adorno={<span className="text-menuda font-medium">RD$</span>}
                className="cifra"
                inputMode="decimal"
                ayuda={
                  difiere
                    ? `Distinto del precio del tipo de cupo (${formatoRD(elegida!.precio)}). Se guardará como precio puesto a mano y no cambiará cuando actualices ese tipo de cupo.`
                    : 'Puedes cambiarlo si esta persona tiene una beca o un descuento.'
                }
              />
            </fieldset>
            {!!inscripcion?.extra_habitacion && !!elegida?.incluye_alojamiento && (
              <p className="text-menuda text-tinta2">
                Además del cupo, tiene {formatoRD(inscripcion.extra_habitacion)} de extra de habitación. Ese
                reparto se cambia desde Habitaciones.
              </p>
            )}
            {inscripcion?.habitacion_id && elegida && !elegida.incluye_alojamiento ? (
              <p className="text-menuda text-tinta2">
                Este cupo no incluye alojamiento. Al continuar podrás revisar la salida de su habitación y el
                nuevo reparto del extra.
              </p>
            ) : null}
          </>
        ) : (
          <div className="revision-cuenta">
            <p>
              <strong>{plan.categoria}</strong> será el cupo de {ficha.persona.nombre}. Sus pagos se
              conservan.
            </p>
            <dl className="revision-importes">
              <div>
                <dt>Precio del cupo</dt>
                <dd className="cifra">{formatoRD(plan.precio)}</dd>
              </div>
              {plan.extra > 0 && (
                <div>
                  <dt>Extra privado</dt>
                  <dd className="cifra">{formatoRD(plan.extra)}</dd>
                </div>
              )}
              <div>
                <dt>Ya pagó</dt>
                <dd className="cifra">{formatoRD(plan.pagado)}</dd>
              </div>
              <div>
                <dt>{plan.excedente ? 'Quedará a favor' : 'Quedará pendiente'}</dt>
                <dd className="cifra">{formatoRD(plan.excedente || plan.pendiente)}</dd>
              </div>
            </dl>
            <CambiosHabitacion habitaciones={plan.habitaciones} />
          </div>
        )}
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}

        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton
            type="button"
            variante="texto"
            onClick={plan ? () => setPlan(null) : alCerrar}
            disabled={guardando}
          >
            {plan ? 'Volver' : 'Cancelar'}
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            {plan ? 'Confirmar cambio' : inscripcion ? 'Revisar cambio' : 'Asignar cupo'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}
