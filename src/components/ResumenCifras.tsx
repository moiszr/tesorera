import type { CSSProperties } from 'react'

/** Escala compartida para los importes y conteos de iglesias y habitaciones. */
export function ResumenCifras({
  cifras,
}: {
  cifras: { etiqueta: string; valor: string; positivo?: boolean }[]
}) {
  return (
    <dl className="resumen-cifras" style={{ '--columnas-cifras': cifras.length } as CSSProperties}>
      {cifras.map((c) => (
        <div key={c.etiqueta}>
          <dt>{c.etiqueta}</dt>
          <dd className={`cifra ${c.positivo ? 'cifra-positiva' : ''}`}>{c.valor}</dd>
        </div>
      ))}
    </dl>
  )
}
