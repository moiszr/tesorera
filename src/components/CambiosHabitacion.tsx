import type { PlanCupo } from '../api/tipos'
import { formatoRD } from '../lib/dinero'

export function CambiosHabitacion({ habitaciones }: { habitaciones: PlanCupo['habitaciones'] }) {
  if (!habitaciones.length) return null
  return (
    <div className="revision-habitaciones">
      {habitaciones.map((h) => (
        <div key={h.id}>
          <strong>{h.nombre}</strong>
          <p>
            Se libera su espacio.
            {h.extra_total > 0
              ? ` El extra de ${formatoRD(h.extra_total)} se reparte entre quienes quedan.`
              : ''}
          </p>
          {h.integrantes
            .filter((p) => !p.sale && p.extra !== p.extra_anterior)
            .map((p) => (
              <div className="revision-reparto" key={p.inscripcion_id}>
                <span>{p.nombre}</span>
                <span className="cifra">
                  {formatoRD(p.extra_anterior)} → <strong>{formatoRD(p.extra)}</strong>
                </span>
              </div>
            ))}
          {h.integrantes.every((p) => p.sale) && (
            <p>La habitación quedará vacía, sin extra asignado a ninguna persona.</p>
          )}
        </div>
      ))}
    </div>
  )
}
