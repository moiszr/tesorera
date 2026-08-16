import type { Config } from 'tailwindcss'

// El sistema visual vive en variables CSS (src/estilos.css). Aquí solo las
// exponemos a Tailwind para no tener dos fuentes de verdad para un mismo color.
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        papel: 'var(--papel)',
        hoja: 'var(--hoja)',
        hoja2: 'var(--hoja-2)',
        tinta: 'var(--tinta)',
        tinta2: 'var(--tinta-2)',
        tinta3: 'var(--tinta-3)',
        linea: 'var(--linea)',
        lineaFuerte: 'var(--linea-fuerte)',
        lomo: 'var(--lomo)',
        lomoAlto: 'var(--lomo-alto)',
        lomoTexto: 'var(--lomo-texto)',
        accion: 'var(--accion)',
        accionAlto: 'var(--accion-alto)',
        rubrica: 'var(--rubrica)',
        pagadoFondo: 'var(--pagado-fondo)',
        pagadoTinta: 'var(--pagado-tinta)',
        pagadoMarca: 'var(--pagado-marca)',
        abonandoFondo: 'var(--abonando-fondo)',
        abonandoTinta: 'var(--abonando-tinta)',
        abonandoMarca: 'var(--abonando-marca)',
        sinpagosFondo: 'var(--sinpagos-fondo)',
        sinpagosTinta: 'var(--sinpagos-tinta)',
        sinpagosMarca: 'var(--sinpagos-marca)',
        avisoFondo: 'var(--aviso-fondo)',
        avisoTinta: 'var(--aviso-tinta)',
      },
      fontFamily: {
        sans: ['"Fira Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala fija (no fluida): esto es una herramienta de trabajo que se
        // mira siempre en la misma laptop. Base 17px por accesibilidad.
        //
        // Los dos escalones chicos son deliberadamente más grandes de lo que
        // pide la convención tipográfica: quien usa esto lee con lentes, y un
        // rótulo de 11px bonito que ella no distingue es un rótulo inservible.
        // micro = 13.8px, menuda = 15.9px.
        micro: ['0.8125rem', { lineHeight: '1.15rem', letterSpacing: '0.06em' }],
        menuda: ['0.9375rem', { lineHeight: '1.35rem' }],
        base: ['1.0625rem', { lineHeight: '1.55' }],
        guia: ['1.1875rem', { lineHeight: '1.45' }],
        titulo: ['1.4375rem', { lineHeight: '1.25', letterSpacing: '-0.011em' }],
        cifra: ['1.75rem', { lineHeight: '1.1', letterSpacing: '-0.018em' }],
        cifraGrande: ['2.5rem', { lineHeight: '1', letterSpacing: '-0.024em' }],
        cifraEnorme: ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        hoja: '10px',
        pieza: '8px',
      },
      boxShadow: {
        // Sombras con desplazamiento real y difusión suave; nunca un halo plano.
        pliego: '0 1px 2px rgba(58, 42, 28, 0.05), 0 8px 24px -12px rgba(58, 42, 28, 0.16)',
        levanta: '0 2px 4px rgba(58, 42, 28, 0.06), 0 14px 32px -14px rgba(58, 42, 28, 0.22)',
        dialogo: '0 12px 24px -8px rgba(40, 28, 18, 0.18), 0 32px 64px -24px rgba(40, 28, 18, 0.32)',
      },
      transitionTimingFunction: {
        salida: 'cubic-bezier(0.23, 1, 0.32, 1)',
        entrasale: 'cubic-bezier(0.77, 0, 0.175, 1)',
        gaveta: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}

export default config
