import { useEffect, useState } from 'react'
import { api, getSprite } from '@helpers/api'
import { RouterProvider } from 'react-router-dom'
import { useUser } from '@contexts/UserContext'
import Welcome from '@components/Welcome'
import PublicRoute from '@routes/PublicRoute'
import PrivateRoute from '@routes/PrivateRoute'

const useRouterContext = () => {
  const { user, setUser, setIsLogged, islogged } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!document.cookie.includes('---OPEN')) {
        setUser(undefined)
        setIsLogged(false)
        setLoading(false)
        return
      }

      try {
        const userResponse = await api.get('/session/user')
        setUser(userResponse.data)

        setIsLogged(true)

      } catch (error) {
        setUser(undefined)
        setIsLogged(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [document.cookie, islogged])

  return { loading, islogged, user }
}

const RouterContext = () => {
  const { loading, islogged, user } = useRouterContext()

  if (!loading && islogged !== undefined) {
    return (
      <RouterProvider
        key={islogged ? 'private' : 'public'}
        router={!islogged || !user?.uuid ? PublicRoute : PrivateRoute}
      />
    )
  }

  return <Welcome />
}

export default RouterContext
