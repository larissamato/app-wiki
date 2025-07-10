import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Card, Input, Form, message } from 'antd'
import { useUser } from '@contexts/UserContext'
import styled from 'styled-components'
import axios from 'axios'
import { FormItemProps } from 'antd/lib'
import { MessageInstance } from 'antd/es/message/interface'
import { handleError } from '@helpers/handleError'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const ResetPasswordCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 24px;
`
interface HandlePasswordResetParams {
  password: string
  confirmPassword: string
  token: string
  context: {
    setUser: (user: any) => void
    setIsLogged: (isLogged: boolean) => void
    navigate: (path: string) => void
    setLoading: (loading: boolean) => void
  }
  messageApi: MessageInstance
  t: (key: string) => string
}

interface PasswordFormItemProps extends FormItemProps {
  placeholder: string
}

const PasswordFormItem = ({ placeholder, ...props }: PasswordFormItemProps) => {
  const { t } = useTranslation()
  return (
    <Form.Item
      rules={[
        {
          required: true,
          message: `${t("PLEASEENTER")} ${typeof props.label === 'string' ? props.label.toLowerCase() : ''}!`
        },
        { min: 8, message: t('PASSWORDINVALID') }
      ]}
      {...props}
    >
      <Input.Password placeholder={placeholder} />
    </Form.Item>
  )
}

const updatePassword = async (password: string, token: string) => {
  return axios.put(
    `${API_URL}/session/user`,
    { password },
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

const fetchUserData = async (token: string) => {
  const response = await axios.get(`${API_URL}/session/user`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

const setAuthCookie = (token: string) => {
  document.cookie = `---OPEN=${token}---; path=/; max-age=32000`
}

const handlePasswordReset = async ({
  password,
  confirmPassword,
  token,
  context: { setUser, setIsLogged, navigate, setLoading },
  messageApi,
  t
}: HandlePasswordResetParams) => {

  if (password !== confirmPassword) {
    messageApi.error(t('PASSWORDSNOTMATCH'))
    return
  }

  setLoading(true)

  try {
    await updatePassword(password, token)
    const userData = await fetchUserData(token)
    setAuthCookie(token)
    setUser(userData)
    message.success(t('PASSWORDUPDATESUCCESS'))
    navigate('/')
    setIsLogged(true)
  } catch (e) {
    handleError(e, messageApi, t('PASSWORDUPDATEFAILED'))
  } finally {
    setLoading(false)
  }
}

const ResetPasswordForm = ({
  onFinish,
  loading
}: {
  onFinish: (values: { password: string; confirmPassword: string }) => void
  loading: boolean
}) => {
  const { t } = useTranslation()
  return (
    <Form onFinish={onFinish} layout="vertical">
      <PasswordFormItem
        label={t("NEWPASSWORD")}
        name="password"
        placeholder={t("SETPASSWORD")}
      />
      <PasswordFormItem
        label={t("Confirm New Password")}
        name="confirmPassword"
        placeholder={t("PASSWORD_CONFIRMATION")}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {t("RESET_PASSWORD")}
        </Button>
      </Form.Item>
    </Form>
  )
}

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setIsLogged, setUser } = useUser()
  const { state: token } = useLocation()
  const [messageApi, contextHolder] = message.useMessage()
  const { t } = useTranslation()

  const onFinish = (values: { password: string; confirmPassword: string }) => {
    handlePasswordReset({
      password: values.password,
      confirmPassword: values.confirmPassword,
      token,
      context: { setUser, setIsLogged, navigate, setLoading },
      messageApi,
      t
    })
  }

  return (
    <Container>
      {contextHolder}
      <ResetPasswordCard title={t("RESET_PASSWORD")}>
        <ResetPasswordForm onFinish={onFinish} loading={loading} />
      </ResetPasswordCard>
    </Container>
  )
}

export default ResetPassword
