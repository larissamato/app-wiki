import ProtectedRoute from '@components/ProtectedRoute'
import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
interface PageWithParamsProps extends PropsWithChildren {
  name: string
}

interface ProtectedPageWithParamsProps extends PageWithParamsProps {
  level?: number
}

const PageWithParams = ({ name, children }: PageWithParamsProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location.search?.length > 1) {
      localStorage.setItem(name, location.search)
    } else {
      const storageParams = localStorage.getItem(name)
      storageParams && storageParams?.length > 1
        ? navigate({ search: storageParams })
        : null
    }
  }, [location])
  return children
}

export const ProtectedPageWithParams = ({
  name,
  level,
  children
}: ProtectedPageWithParamsProps) => {
  return (
    <ProtectedRoute {...{ level }}>
      <PageWithParams {...{ name }}>{children}</PageWithParams>
    </ProtectedRoute>
  )
}

export default PageWithParams
