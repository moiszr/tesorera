import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { NOMBRE_ESTADO, proporcionPagada, type Estado } from '../lib/estados'
import { formatoRD, soloNumero } from '../lib/dinero'
import { IconoAviso } from './Iconos'

// ── Botones ───────────────────────────────────────────────────────────────
// Un solo vocabulario de botón en toda la app. Altura mínima 44px.

type TipoBoton = 'principal' | 'contorno' | 'suave' | 'texto'

type PropsBoton = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: TipoBoton
  grande?: boolean
  cargando?: boolean
  icono?: ReactNode
}

const VARIANTES: Record<TipoBoton, string> = {
  principal: 'bg-accion text-white hover:bg-accionAlto shadow-[0_1px_2px_rgba(58,42,28,0.12)]',
  contorno: 'bg-hoja text-tinta border border-lineaFuerte hover:border-tinta3 hover:bg-hoja2',
  suave: 'bg-[rgba(0,112,243,0.08)] text-accionTexto hover:bg-[rgba(0,112,243,0.14)]',
  texto: 'text-tinta2 hover:text-tinta hover:bg-[rgba(24,24,27,0.05)]',
}

export const Boton = forwardRef<HTMLButtonElement, PropsBoton>(function Boton(
  { variante = 'contorno', grande = false, cargando = false, icono, className = '', children, ...resto },
  ref,
) {
  return (
    <button
      ref={ref}
      {...resto}
      disabled={resto.disabled || cargando}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-pieza font-medium',
        'transition-[background-color,border-color,color,transform] duration-150 ease-salida',
        'active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none',
        grande ? 'min-h-[52px] px-6 text-guia' : 'min-h-[44px] px-4',
        VARIANTES[variante],
        className,
      ].join(' ')}
    >
      {cargando ? <Girador /> : icono}
      {children}
    </button>
  )
})

function Girador() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" opacity="0.25" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ── Campos ────────────────────────────────────────────────────────────────

type PropsCampo = InputHTMLAttributes<HTMLInputElement> & {
  etiqueta?: string
  ayuda?: string
  problema?: string | null
  adorno?: ReactNode
}

export const Campo = forwardRef<HTMLInputElement, PropsCampo>(function Campo(
  { etiqueta, ayuda, problema, adorno, className = '', id, ...resto },
  ref,
) {
  const idCampo = id ?? `campo-${resto.name ?? etiqueta?.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div className="w-full">
      {etiqueta && (
        <label htmlFor={idCampo} className="mb-1.5 block text-menuda font-medium text-tinta2">
          {etiqueta}
        </label>
      )}
      <div className="relative">
        {adorno && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta3">{adorno}</span>
        )}
        <input
          ref={ref}
          id={idCampo}
          {...resto}
          aria-invalid={problema ? true : undefined}
          className={[
            'w-full min-h-[46px] rounded-pieza bg-hoja px-3 py-2 text-tinta',
            'border transition-colors duration-150',
            problema ? 'border-accion' : 'border-lineaFuerte hover:border-tinta3',
            'focus:border-accion focus:outline-none focus:ring-2 focus:ring-[rgba(0,112,243,0.18)]',
            'placeholder:text-tinta3',
            adorno ? 'pl-10' : '',
            className,
          ].join(' ')}
        />
      </div>
      {problema ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-menuda text-accionTexto">
          <IconoAviso tam={15} className="mt-0.5 shrink-0" />
          {problema}
        </p>
      ) : ayuda ? (
        <p className="mt-1.5 text-menuda text-tinta2">{ayuda}</p>
      ) : null}
    </div>
  )
})

// ── Estado de pago ────────────────────────────────────────────────────────
// El color nunca va solo: el chip siempre lleva su texto.

const COLOR_ESTADO: Record<Estado, { fondo: string; tinta: string; marca: string }> = {
  pagado: { fondo: 'var(--pagado-fondo)', tinta: 'var(--pagado-tinta)', marca: 'var(--pagado-marca)' },
  abonando: { fondo: 'var(--abonando-fondo)', tinta: 'var(--abonando-tinta)', marca: 'var(--abonando-marca)' },
  sinpagos: { fondo: 'var(--sinpagos-fondo)', tinta: 'var(--sinpagos-tinta)', marca: 'var(--sinpagos-marca)' },
}

export function ChipEstado({ estado, className = '' }: { estado: Estado; className?: string }) {
  const c = COLOR_ESTADO[estado]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-menuda font-medium ${className}`}
      style={{ background: c.fondo, color: c.tinta }}
    >
      <span className="h-[7px] w-[7px] rounded-full" style={{ background: c.marca }} aria-hidden />
      {NOMBRE_ESTADO[estado]}
    </span>
  )
}

// ── Barra de progreso ─────────────────────────────────────────────────────
/**
 * El momento estrella de la app: al guardar un pago, esta barra crece hasta
 * la nueva proporción. Solo transform (no width), para que corra en la GPU.
 */
export function BarraProgreso({
  pagado,
  precio,
  estado,
  alto = 8,
  etiqueta,
}: {
  pagado: number
  precio: number
  estado: Estado
  alto?: number
  etiqueta?: string
}) {
  const proporcion = proporcionPagada(pagado, precio)
  const c = COLOR_ESTADO[estado]
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={precio}
      aria-valuenow={Math.min(pagado, precio)}
      aria-valuetext={etiqueta ?? `${formatoRD(pagado)} de ${formatoRD(precio)}`}
      className="w-full overflow-hidden rounded-full"
      style={{ height: alto, background: 'var(--linea)' }}
    >
      <div
        className="h-full origin-left rounded-full transition-transform duration-[420ms] ease-salida"
        style={{ background: c.marca, transform: `scaleX(${proporcion})` }}
      />
    </div>
  )
}

// ── Dinero ────────────────────────────────────────────────────────────────

export function Monto({
  centavos,
  tam = 'base',
  tenue = false,
  className = '',
}: {
  centavos: number
  tam?: 'menuda' | 'base' | 'guia' | 'cifra' | 'cifraGrande' | 'cifraEnorme'
  tenue?: boolean
  className?: string
}) {
  const clases: Record<string, string> = {
    menuda: 'text-menuda',
    base: 'text-base',
    guia: 'text-guia font-medium',
    cifra: 'text-cifra font-semibold',
    cifraGrande: 'text-cifraGrande font-semibold',
    cifraEnorme: 'text-cifraEnorme font-semibold',
  }

  // El "RD$" se encoge conforme crece la cifra: a tamaño grande, mantener la
  // misma proporción lo convierte en un segundo número que compite con el
  // primero. Estos valores viven SOLO aquí; ninguna pantalla los rehace a mano.
  const SIMBOLO: Record<string, string> = {
    cifra: 'mr-1.5 align-baseline text-[0.5em] font-medium text-tinta2',
    cifraGrande: 'mr-2 align-baseline text-[0.46em] font-medium text-tinta2',
    cifraEnorme: 'mr-2 align-baseline text-[0.42em] font-medium text-tinta2',
  }

  return (
    <span className={`cifra whitespace-nowrap ${clases[tam]} ${tenue ? 'text-tinta2' : ''} ${className}`}>
      <span className={SIMBOLO[tam] ?? 'mr-1 font-normal text-tinta2'}>RD$</span>
      {soloNumero(centavos)}
    </span>
  )
}

// ── Etiqueta de iglesia ───────────────────────────────────────────────────

/**
 * Colores de etiqueta de iglesia.
 *
 * Ninguno es verde ni ámbar A PROPÓSITO: esos dos ya significan "Pagado" y
 * "Abonando" en toda la app. Tampoco azul: ese es el acento de las acciones.
 * Un color que significa dos cosas deja de significar cualquiera.
 */
const COLORES_IGLESIA: Record<string, string> = {
  purpura: '#7c3aed',
  rosa: '#db2777',
  cyan: '#0891b2',
  pizarra: '#475569',
  ciruela: '#a21caf',
  grafito: '#57534e',
}

export const NOMBRES_COLOR: { valor: string; nombre: string }[] = [
  { valor: 'purpura', nombre: 'Morado' },
  { valor: 'rosa', nombre: 'Rosa' },
  { valor: 'cyan', nombre: 'Turquesa' },
  { valor: 'pizarra', nombre: 'Pizarra' },
  { valor: 'ciruela', nombre: 'Ciruela' },
  { valor: 'grafito', nombre: 'Grafito' },
]

export function colorIglesia(color: string | null | undefined): string {
  return COLORES_IGLESIA[color ?? 'pizarra'] ?? COLORES_IGLESIA.pizarra
}

export function EtiquetaIglesia({
  nombre,
  color,
  className = '',
}: {
  nombre: string | null
  color: string | null
  className?: string
}) {
  if (!nombre) return <span className="text-menuda text-tinta3">Sin iglesia</span>
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1.5 text-menuda text-tinta2 ${className}`}>
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: colorIglesia(color) }}
        aria-hidden
      />
      <span className="truncate">{nombre}</span>
    </span>
  )
}

// ── Estado vacío ──────────────────────────────────────────────────────────
// Nunca dice "no hay nada": siempre dice qué hacer ahora.

export function EstadoVacio({
  titulo,
  explicacion,
  accion,
}: {
  titulo: string
  explicacion: string
  accion?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <RayasDecorativas />
      <h3 className="mt-5 text-guia font-semibold text-tinta">{titulo}</h3>
      <p className="mt-1.5 max-w-[38ch] text-tinta2">{explicacion}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  )
}

/** Una lista vacía dibujada: dice "aquí todavía no hay nada escrito". */
function RayasDecorativas() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" aria-hidden className="text-linea">
      <rect x="0.75" y="0.75" width="62.5" height="46.5" rx="5" fill="var(--hoja-2)" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 16h36M14 25h26M14 34h18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Aviso tranquilo ───────────────────────────────────────────────────────

export function Aviso({ children, tono = 'neutro' }: { children: ReactNode; tono?: 'neutro' | 'ojo' }) {
  const estilo =
    tono === 'ojo'
      ? { background: 'var(--abonando-fondo)', color: 'var(--abonando-tinta)' }
      : { background: 'var(--aviso-fondo)', color: 'var(--aviso-tinta)' }
  return (
    <p className="flex items-start gap-2 rounded-pieza px-3 py-2.5 text-menuda" style={estilo}>
      <IconoAviso tam={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

// ── Encabezado de pantalla ────────────────────────────────────────────────

export function Encabezado({
  titulo,
  bajada,
  acciones,
}: {
  titulo: string
  bajada?: ReactNode
  acciones?: ReactNode
}) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-titulo font-semibold text-tinta">{titulo}</h1>
        {bajada && <div className="mt-0.5 text-tinta2">{bajada}</div>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </header>
  )
}
