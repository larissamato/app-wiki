import Welcome from "@components/Welcome"
import useSearchParams from "@hooks/useSearchParams"
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

const Floauth = () => {
  const params = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.getItem('token')
    if (token) {
      document.cookie = `---OPEN=${token}---; path=/; max-age=32000; SameSite=Strict`
    }

    navigate('/', { replace: true })
  })

  return (
    <Welcome />
  )
}

export default Floauth
