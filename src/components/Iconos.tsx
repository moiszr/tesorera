/**
 * Iconos dibujados a mano, todos con el mismo trazo (1.6) y la misma caja (24).
 * No se usan emojis ni glifos de texto en ningún lugar de la app.
 */
type Props = { className?: string; tam?: number }

const base = (tam: number) => ({
  width: tam,
  height: tam,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

export function IconoInicio({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M5 4.5h11.5a2.5 2.5 0 0 1 2.5 2.5v12.5H7.5A2.5 2.5 0 0 1 5 17Z" />
      <path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H19" />
      <path d="M9 8.5h6M9 11.5h4" />
    </svg>
  )
}

export function IconoPersonas({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.8 19.2c.6-3.1 2.9-4.9 5.7-4.9s5.1 1.8 5.7 4.9" />
      <path d="M16.2 6.2a3 3 0 0 1 0 5.6M18 18.8c-.2-1.5-.7-2.7-1.5-3.6" />
    </svg>
  )
}

export function IconoPago({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <rect x="2.8" y="6" width="18.4" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

export function IconoAjustes({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
    </svg>
  )
}

export function IconoBuscar({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <circle cx="10.5" cy="10.5" r="6.2" />
      <path d="m15.2 15.2 4 4" />
    </svg>
  )
}

export function IconoMas({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  )
}

export function IconoVolver({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  )
}

export function IconoAdelante({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </svg>
  )
}

export function IconoCheque({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

export function IconoCerrar({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </svg>
  )
}

export function IconoLapiz({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M4.5 19.5h4l9-9a2.1 2.1 0 0 0-3-3l-9 9Z" />
      <path d="M14.2 7.3 16.7 9.8" />
    </svg>
  )
}

export function IconoAnular({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <path d="m7.2 16.8 9.6-9.6" />
    </svg>
  )
}

export function IconoArchivar({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <rect x="3.5" y="5" width="17" height="4" rx="1.2" />
      <path d="M5.5 9v9.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V9" />
      <path d="M10 13h4" />
    </svg>
  )
}

export function IconoRespaldo({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M12 4.5v9M8.5 10 12 13.5 15.5 10" />
      <path d="M4.5 15v3a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
    </svg>
  )
}

export function IconoExportar({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M6.5 3.5h7l4.5 4.5v12a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M13 3.5V8h4.5" />
      <path d="M9 15.5h6M9 12.5h3" />
    </svg>
  )
}

export function IconoImprimir({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M7 9V4.5h10V9" />
      <rect x="4" y="9" width="16" height="7" rx="1.5" />
      <path d="M7 14h10v5.5H7z" />
    </svg>
  )
}

export function IconoIglesia({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M12 2.8v4M10.2 4.4h3.6" />
      <path d="M12 6.8 6 11v9h12v-9Z" />
      <path d="M10.4 20v-4.2h3.2V20" />
    </svg>
  )
}

export function IconoSubir({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M12 18.5v-13M6.5 11 12 5.5 17.5 11" />
    </svg>
  )
}

export function IconoBajar({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M12 5.5v13M6.5 13 12 18.5 17.5 13" />
    </svg>
  )
}

export function IconoAviso({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.8M12 15.6h.01" />
    </svg>
  )
}

export function IconoFiltro({ className, tam = 20 }: Props) {
  return (
    <svg {...base(tam)} className={className}>
      <path d="M4.5 6.5h15M7.5 12h9M10.5 17.5h3" />
    </svg>
  )
}
