import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Marco } from './components/Marco'
import Inicio from './pages/Inicio'
import Personas from './pages/Personas'
import FichaPersona from './pages/FichaPersona'
import RegistrarPago from './pages/RegistrarPago'
import Ajustes from './pages/Ajustes'
import Comprobante from './pages/Comprobante'
import Reporte from './pages/Reporte'

export default function App() {
  return (
    <>
      <Marco>
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
            border: '1px solid var(--linea)',
            color: 'var(--tinta)',
            fontFamily: '"Fira Sans", system-ui, sans-serif',
            fontSize: '0.9375rem',
            borderRadius: '8px',
            boxShadow:
              '0 1px 2px rgba(24, 24, 27, 0.06), 0 12px 28px -8px rgba(24, 24, 27, 0.18)',
          },
        }}
        className="no-imprimir"
      />
    </>
  )
}
