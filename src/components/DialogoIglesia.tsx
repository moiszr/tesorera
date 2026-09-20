import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api, ErrorDeTesorera } from '../api/cliente'
import type { Iglesia } from '../api/tipos'
import { Boton, Campo, NOMBRES_COLOR, colorIglesia } from './Piezas'
import { Dialogo } from './Dialogo'

export function DialogoIglesia({
  abierto,
  alCerrar,
  iglesia,
  pastores,
  alGuardar,
}: {
  abierto: boolean
  alCerrar: () => void
  iglesia: Iglesia | null
  pastores: string[]
  alGuardar: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [pastor, setPastor] = useState('')
  const [color, setColor] = useState('')
  const [problema, setProblema] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!abierto) return
    setNombre(iglesia?.nombre ?? '')
    setPastor(iglesia?.pastor ?? '')
    setColor(iglesia?.color ?? '')
    setProblema(null)
  }, [abierto, iglesia])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setProblema('Escribe el nombre de la iglesia.')
      return
    }
    setGuardando(true)
    try {
      const datos = { nombre: nombre.trim(), pastor: pastor.trim() || null, color }
      if (iglesia) await api.editarIglesia(iglesia.id, datos)
      else await api.crearIglesia(datos)
      toast.success(iglesia ? 'Iglesia actualizada' : 'Iglesia agregada')
      alGuardar()
    } catch (err) {
      setProblema(err instanceof ErrorDeTesorera ? err.message : 'No pude guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialogo
      ocupado={guardando}
      abierto={abierto}
      alCerrar={alCerrar}
      titulo={iglesia ? 'Editar iglesia' : 'Agregar iglesia'}
    >
      <form onSubmit={guardar} className="space-y-4">
        <Campo
          etiqueta="Nombre de la iglesia"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Iglesia Central de Villa Duarte"
          autoFocus
        />
        {/* El pastor se escribe libre, pero se ofrecen los que ya existen: así
            "Juan Pérez" no termina siendo dos pastores distintos por una tilde. */}
        <Campo
          etiqueta="Pastor (opcional)"
          value={pastor}
          onChange={(e) => setPastor(e.target.value)}
          placeholder="Nombre del pastor"
          list="pastores-existentes"
          autoComplete="off"
          ayuda={
            pastores.length > 0
              ? 'Si es el mismo pastor de otra iglesia, escríbelo igual para poder agruparlas.'
              : undefined
          }
        />
        <datalist id="pastores-existentes">
          {pastores.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <div>
          <span className="mb-1.5 block text-menuda font-medium text-tinta2">Color de la etiqueta</span>
          <div className="flex flex-wrap gap-1.5">
            {/* Automático es lo predeterminado: el sistema reparte el color
                menos usado para que no se repitan. Elegir uno lo anula. */}
            <button
              type="button"
              onClick={() => setColor('')}
              aria-pressed={color === ''}
              className={[
                'inline-flex min-h-[44px] items-center gap-2 rounded-pieza px-3 text-menuda',
                'border transition-colors duration-150 active:scale-[0.98]',
                color === ''
                  ? 'border-accion bg-accionSuave font-medium text-accionTexto'
                  : 'border-lineaFuerte text-tinta2 hover:border-tinta3',
              ].join(' ')}
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{
                  background: 'conic-gradient(#7c3aed, #db2777, #0891b2, #475569, #a21caf, #57534e, #7c3aed)',
                }}
                aria-hidden
              />
              Automático
            </button>

            {NOMBRES_COLOR.map((c) => (
              <button
                key={c.valor}
                type="button"
                onClick={() => setColor(c.valor)}
                aria-pressed={color === c.valor}
                aria-label={c.nombre}
                title={c.nombre}
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-pieza',
                  'border transition-colors duration-150 active:scale-[0.98]',
                  color === c.valor ? 'border-accion bg-accionSuave' : 'border-linea hover:border-tinta3',
                ].join(' ')}
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ background: colorIglesia(c.valor) }}
                  aria-hidden
                />
              </button>
            ))}
          </div>
          {color === '' && (
            <p className="mt-1.5 text-menuda text-tinta3">Se le pondrá el color que menos se esté usando.</p>
          )}
        </div>
        {problema && <p className="text-menuda text-accionTexto">{problema}</p>}
        <div className="flex justify-end gap-2 border-t border-linea pt-4">
          <Boton type="button" variante="texto" onClick={alCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="principal" cargando={guardando}>
            {iglesia ? 'Guardar cambios' : 'Agregar'}
          </Boton>
        </div>
      </form>
    </Dialogo>
  )
}
