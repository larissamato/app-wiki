import Welcome from '@components/Welcome'
import { UserContext } from '@contexts/UserContext'
import { clearCache } from '@helpers/clearCache'
import { clearCookies } from '@helpers/clearCookies'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const context = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    clearCookies()
    if (context) {
      context.setIsThemeDark(false)
      context.setIsLogged(false)
      context.setUser(undefined)
    }
    localStorage.clear()
    clearCache()
    navigate('/')
  }, [])
  return <Welcome />
}

export default Logout
