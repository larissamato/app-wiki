import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@helpers/api'
import useFetch from '@hooks/useFetch'

const FirstLogin = () => {
  const navigate = useNavigate()
  const { uuid: token } = useParams()

  const { data, isSuccess, error, loading } = useFetch({
    func: params => api.post('/session/fl', { token: params }),
    params: token,
    deps: [token],
    initialValue: {}
  })

  useEffect(() => {
    if (isSuccess && data.token) {
      navigate('/reset-password', { state: data.token })
    }
    if (!loading && !isSuccess) {
      navigate('/')
    }
  }, [data, isSuccess, error, navigate])
}

export default FirstLogin
