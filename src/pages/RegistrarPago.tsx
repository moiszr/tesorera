import { Navigate, useSearchParams } from 'react-router-dom'

/** Los enlaces antiguos llevan al mismo espacio de personas y pagos. */
export default function RegistrarPago() {
  const [params] = useSearchParams()
  const persona = params.get('persona')
  return (
    <Navigate
      to={persona ? `/personas?persona=${encodeURIComponent(persona)}&pagar=1` : '/personas'}
      replace
    />
  )
}
