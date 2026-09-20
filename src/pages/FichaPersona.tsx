import { Navigate, useParams } from 'react-router-dom'

export default function FichaPersona() {
  const { id } = useParams()
  return <Navigate to={`/personas?persona=${encodeURIComponent(id ?? '')}`} replace />
}
