import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { postLogin, api } from '@helpers/api'
import { useUser } from '@contexts/UserContext'
import { Image } from './style.js'
import FormLogin from '../../components/FormLogin'
import { Alert, Row, Col, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import MainBanner from '@components/common/MainBanner/index.js'

interface LoginLayoutProps {
  errorMessage: string | null
  loading: boolean;
  status: number | null;
  onFinish: (values: { email: string; password: string }) => Promise<void>
}

export const setToken = (token: string) => {
  document.cookie = token
}

export const handleLogin = async (
  setUser: Function,
  setIsLogged: Function,
) => {
  try {
    const userRes = await api.get('/session/user')
    setUser(userRes.data)

    setIsLogged(true)
  } catch {
    setIsLogged(false)
    setUser(null)
  }
}

export const redirectRoute = (navigate: any) => {
  if (window.location.pathname === '/login') {
    navigate('/')
  }
}

const LayoutLogin = ({ errorMessage, loading, status, onFinish }: LoginLayoutProps) => {
  const { t } = useTranslation()
  return (
    <Row style={{ height: '100vh' }}>
      <MainBanner />
      <Col
        sm={{ span: 24 }}
        xs={{ span: 24 }}
        lg={{ span: 12 }}
        style={{
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Space direction="vertical" style={{ width: '80%', maxWidth: '400px' }}>
          <FormLogin loading={loading} onFinish={onFinish} size="large" />
          {errorMessage && <Alert message={status === 422 ? errorMessage : t('UNEXPECTEDERROR')} type="error" showIcon />}
        </Space>
      </Col>
    </Row>
  )
}

const Login = () => {
  const { setIsLogged, setUser } = useUser()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    setErrorMessage(null)
    const { email, password } = values

    try {
      const response = await postLogin(email, password)
      const messageApi = response?.data?.message ?? response?.message ?? t('errorCredential')
      setStatus(response?.status)

      if (response && response.status === 200 && response.data?.token) {
        setToken(
          `---OPEN=${response.data.token}---; path=/; max-age=32000; SameSite=Strict`
        )
        await handleLogin(setUser, setIsLogged)
        redirectRoute(navigate)
      } else {
        setErrorMessage(messageApi)
      }
    } catch (error: any) {
      const messageApi = error?.response?.data?.message ?? error?.message ?? t('errorDefaultLogin')
      setErrorMessage(messageApi);
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutLogin
      status={status}
      errorMessage={errorMessage}
      loading={loading}
      onFinish={onFinish}
    />
  )
}

export default Login
