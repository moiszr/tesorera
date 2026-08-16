import type { Categoria, Conteos, Evento, Ficha, Iglesia, Pastor, PersonaEnLista, Resumen } from './tipos'

/**
 * Si el servidor responde con un error, ese error ya viene escrito en español
 * y listo para mostrar. Nunca inventamos un mensaje técnico encima.
 */
export class ErrorDeTesorera extends Error {}

async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`/api${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    })
  } catch {
    throw new ErrorDeTesorera('No pude conectar con la aplicación. Ciérrala y vuelve a abrirla.')
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => null)
    throw new ErrorDeTesorera(cuerpo?.error ?? 'Algo salió mal. Vuelve a intentarlo.')
  }

  if (respuesta.status === 204) return undefined as T
  return respuesta.json() as Promise<T>
}

const enviar = (ruta: string, metodo: string, cuerpo?: unknown) =>
  pedir<any>(ruta, { method: metodo, body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo) })

export const api = {
  resumen: () => pedir<Resumen>('/resumen'),
  eventoActivo: () => pedir<Evento | null>('/evento-activo'),
  eventos: () => pedir<Evento[]>('/eventos'),
  crearEvento: (datos: Record<string, unknown>) => enviar('/eventos', 'POST', datos),
  editarEvento: (id: number, datos: Record<string, unknown>) => enviar(`/eventos/${id}`, 'PATCH', datos),

  categorias: (eventoId: number) => pedir<Categoria[]>(`/eventos/${eventoId}/categorias`),
  crearCategoria: (eventoId: number, datos: Record<string, unknown>) =>
    enviar(`/eventos/${eventoId}/categorias`, 'POST', datos),
  editarCategoria: (id: number, datos: Record<string, unknown>) => enviar(`/categorias/${id}`, 'PATCH', datos),
  afectadas: (id: number) => pedir<{ cuantas: number; precio: number }>(`/categorias/${id}/afectadas`),
  aplicarPrecio: (id: number) => enviar(`/categorias/${id}/aplicar-precio`, 'POST'),

  iglesias: () => pedir<Iglesia[]>('/iglesias'),
  pastores: () => pedir<Pastor[]>('/pastores'),
  crearIglesia: (datos: Record<string, unknown>) => enviar('/iglesias', 'POST', datos),
  editarIglesia: (id: number, datos: Record<string, unknown>) => enviar(`/iglesias/${id}`, 'PATCH', datos),

  personas: (parametros: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams()
    for (const [clave, valor] of Object.entries(parametros)) {
      if (valor !== undefined && valor !== '') q.set(clave, String(valor))
    }
    const cola = q.toString()
    return pedir<{ personas: PersonaEnLista[]; conteos: Conteos }>(`/personas${cola ? `?${cola}` : ''}`)
  },
  persona: (id: number) => pedir<Ficha>(`/personas/${id}`),
  crearPersona: (datos: Record<string, unknown>) =>
    enviar('/personas', 'POST', datos) as Promise<{ id: number; aviso_repetida: string | null }>,
  editarPersona: (id: number, datos: Record<string, unknown>) => enviar(`/personas/${id}`, 'PATCH', datos),
  editarInscripcion: (id: number, datos: Record<string, unknown>) =>
    enviar(`/inscripciones/${id}`, 'PATCH', datos),
  inscribir: (personaId: number, categoriaId: number) =>
    enviar(`/personas/${personaId}/inscribir`, 'POST', { categoria_id: categoriaId }),

  registrarPago: (datos: Record<string, unknown>) =>
    enviar('/pagos', 'POST', datos) as Promise<{ id: number; ficha: Ficha }>,
  anularPago: (id: number, nota?: string) =>
    enviar(`/pagos/${id}/anular`, 'POST', { nota }) as Promise<{ ficha: Ficha }>,
  comprobante: (id: number) => pedir<any>(`/pagos/${id}/comprobante`),

  respaldar: () => enviar('/respaldo', 'POST') as Promise<{ nombre: string; carpeta: string }>,
  respaldos: () => pedir<{ carpeta: string; respaldos: { nombre: string; cuando: string }[] }>('/respaldos'),
  reporte: () => pedir<any>('/reporte'),
}
