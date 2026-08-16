import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { api } from './api/cliente'
import type { Evento } from './api/tipos'
import { Marco } from './components/Marco'
import Inicio from './pages/Inicio'
import Personas from './pages/Personas'
import FichaPersona from './pages/FichaPersona'
import RegistrarPago from './pages/RegistrarPago'
import Ajustes from './pages/Ajustes'
import Comprobante from './pages/Comprobante'
import Reporte from './pages/Reporte'

export default function App() {
  const [evento, setEvento] = useState<Evento | null>(null)

  useEffect(() => {
    // El nombre del evento vive en el lomo del libro; se refresca al navegar.
    const traer = () => api.eventoActivo().then(setEvento).catch(() => {})
    traer()
    const t = setInterval(traer, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Marco evento={evento}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/personas" element={<Personas />} />
          <Route path="/personas/:id" element={<FichaPersona />} />
          <Route path="/registrar-pago" element={<RegistrarPago />} />
          <Route path="/comprobante/:id" element={<Comprobante />} />
          <Route path="/reporte" element={<Reporte />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Marco>

      <Toaster
        position="bottom-right"
        offset={20}
        toastOptions={{
          style: {
            background: 'var(--hoja)',
            border: '1px solid var(--linea-fuerte)',
            color: 'var(--tinta)',
            fontFamily: '"Fira Sans", system-ui, sans-serif',
            fontSize: '0.9375rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(58,42,28,0.06), 0 14px 32px -14px rgba(58,42,28,0.28)',
          },
        }}
        className="no-imprimir"
      />
    </>
  )
}
