import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Evento, Iglesia, PersonaEnLista } from '../api/tipos'
import { formatoRD } from '../lib/dinero'
import { normalizar } from '../lib/fechas'
import { recordarEleccion, ultimasElecciones } from '../lib/preferencias'
import { Aviso, Boton, Campo, colorIglesia } from './Piezas'
import { Dialogo } from './Dialogo'
import { Selector, type Opcion } from './Selector'

/**
 * Agregar persona. Vive aquí y no dentro de una pantalla porque se abre desde
 * dos sitios: desde la lista de Personas y desde el buscador de Registrar pago
 * cuando alguien llega a pagar y todavía no está inscrito.
 *
 * `nombreInicial` es el nombre que ya se escribió en el buscador: nadie debe
 * escribir el mismo nombre dos veces seguidas.
 */
export function DialogoPersona({
  abierto,
  alCerrar,
  iglesias,
  evento,
  personas,
  nombreInicial = '',
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  iglesias: Iglesia[]
  evento: Evento | null
  /** Para avisar de un posible duplicado mientras escribe, no después de guardar. */
  personas: PersonaEnLista[]
  nombreInicial?: string
  alGuardar: (personaCreada: { id: number; nombre: string }) => void
}) {
  const [nombre, setNombre] = useState('')
  const [iglesiaId, setIglesiaId] = useState<number | undefined>()
  const [categoriaId, setCategoriaId] = useState<number | undefined>()
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  const categorias = (evento?.categorias ?? []).filter((c) => !c.archivada)
  const sinCategorias = Boolean(evento) && categorias.length === 0

  useEffect(() => {
    if (!abierto) return
    const ultimas = ultimasElecciones()
    setNombre(nombreInicial)
    // Se propone lo último que usó: inscribiendo a media iglesia de un tirón,
    // esto ahorra dos toques por persona. Sigue siendo cambiable.
    setIglesiaId(
      iglesias.length === 1
        ? iglesias[0].id
        : iglesias.some((g) => g.id === ultimas.iglesiaId)
          ? ultimas.iglesiaId
          : undefined,
    )
    setCategoriaId(categorias.some((c) => c.id === ultimas.categoriaId) ? ultimas.categoriaId : undefined)
    setTelefono('')
    setNotas('')
    setProblema(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, nombreInicial, iglesias, evento])

  // Aviso de repetida MIENTRAS escribe. Avisar después de guardar llega tarde:
  // el duplicado ya está creado y hay que ir a archivarlo.
  const parecida = useMemo(() => {
    const t = normalizar(nombre)
    if (t.length < 3) return null
    return personas.find((p) => normalizar(p.nombre) === t) ?? null
  }, [nombre, personas])

  // El pastor va como detalle: ayuda a distinguir dos iglesias de nombre
  // parecido, que es justo cuando uno se equivoca al elegir.
  const opcionesIglesia: Opcion[] = iglesias.map((g) => ({
    id: g.id,
    etiqueta: g.nombre,
    detalle: g.pastor ? `Pastor ${g.pastor}` : undefined,
    color: colorIglesia(g.color),
  }))

  const opcionesCupo: Opcion[] = categorias.map((c) => ({
    id: c.id,
    etiqueta: c.nombre,
    detalle: formatoRD(c.precio),
    detalleNumerico: true,
  }))

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Escribe el nombre completo de la persona.')
      return
    }
    if (evento && categorias.length > 0 && !categoriaId) {
      setProblema('Elige el tipo de cupo.')
      return
    }

    setGuardando(true)
    try {
      const r = await api.crearPersona({
        nombre: nombre.trim(),
        iglesia_id: iglesiaId,
        categoria_id: categoriaId,
        telefono: telefono || undefined,
        notas: notas || undefined,
      })
      recordarEleccion({ iglesiaId, categoriaId })
      toast.success(`${nombre.trim()} quedó agregada`)
      alGuardar({ id: r.id, nombre: nombre.trim() })
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar la persona.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo="Agregar persona" ancho={520}>
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="Nombre completo"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value)
            setProblema(null)
          }}
          placeholder="María Altagracia Pérez"
          autoFocus
          autoComplete="off"
        />

        {parecida && (
          <Aviso tono="ojo">
            Ya hay alguien inscrito que se llama <span className="font-medium">{parecida.nombre}</span>.
            Revisa que no sea la misma persona antes de guardar.
          </Aviso>
        )}

        {opcionesIglesia.length > 0 && (
          <Selector
            etiqueta="¿De qué iglesia es?"
            opciones={opcionesIglesia}
            valor={iglesiaId}
            alElegir={setIglesiaId}
            textoBuscar="Buscar iglesia…"
          />
        )}

        {sinCategorias ? (
          <Aviso tono="ojo">
            Este evento todavía no tiene tipos de cupo. Créalos en Ajustes y después vuelve aquí.
          </Aviso>
        ) : (
          opcionesCupo.length > 0 && (
            <Selector
              etiqueta="¿Qué tipo de cupo?"
              opciones={opcionesCupo}
              valor={categoriaId}
              alElegir={(id) => {
                setCategoriaId(id)
                setProblema(null)
              }}
              columnas={2}
              umbral={4}
              textoBuscar="Buscar tipo de cupo…"
            />
          )
        )}

        <details className="group">
          <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center text-menuda font-medium text-tinta2 transition-colors hover:text-tinta">
            Teléfono y notas (opcional)
          </summary>
          <div className="mt-2 space-y-3">
            <Campo
              etiqueta="Teléfono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="809-000-0000"
            />
            <Campo
              etiqueta="Notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Lo que quieras recordar de esta persona"
            />
          </div>
        </details>

        {problema && <p className="text-menuda text-accion">{problema}</p>}

        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            Guardar persona
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}
