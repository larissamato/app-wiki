import { PropsWithChildren } from 'react'
import { useUser } from '@contexts/UserContext'
import Error from '@pages/Error'
interface ProtectedRouteProps extends PropsWithChildren {
  level?: number
}
const ProtectedRoute = ({ children, level = 2 }: ProtectedRouteProps) => {
  const { user } = useUser()
  return (
    <>
      {user.level >= level ? children : <Error manualError="Not have access" />}
    </>
  )
}

export default ProtectedRoute
