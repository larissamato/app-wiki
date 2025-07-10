import InputWithForm from '@components/common/InputWithForm'
import MainBanner from '@components/common/MainBanner'
import {
  Col,
  Input,
  Form,
  Row,
  Button,
  Typography,
  FormInstance,
  message
} from 'antd'
import { useTranslation } from 'react-i18next'
import { translateRules } from '@helpers/translateRulesInput'
import { useUser } from '@contexts/UserContext'
import { GoogleOutlined } from '@ant-design/icons'
import { api } from '@helpers/api'
import { Link, useNavigate } from 'react-router-dom'
import { MessageInstance } from 'antd/es/message/interface'
import useWindowResize from '@hooks/useWindowResize'
import { handleLogin } from '@pages/Login'

const API = import.meta.env.VITE_OPEN_URL ? import.meta.env.VITE_OPEN_URL
  : 'dev-api.opendata.center'

const emailrules = [
  { required: true, message: 'emailEmpty' },
  { type: 'email', message: 'emailInvalid' }
]
const passwordrules = [
  { required: true, message: 'PASSWORDEMPTY' },
  { min: 5, message: 'PASSWORDINVALID' }
]

type registerForm = {
  name: string
  password: string
  password_confirmation: string
  email: string
}

const useRegisterForm = (messageApi: MessageInstance, form: FormInstance) => {
  const navigate = useNavigate()
  const { setUser, setIsLogged } = useUser()
  const { t } = useTranslation()
  const onFinish = (values: registerForm) => {
    api
      .post('/register', values)
      .then(res => {
        messageApi.success(t('USERREGISTRATIONSUCCESS'))
        if (res.data.token) {
          document.cookie = `---OPEN=${res.data.token}---; path=/; max-age=32000`
          handleLogin(setUser, setIsLogged)
          navigate('/')
        }
      })
      .catch(error => {
        handleError(error, form)
      })
  }
  return { onFinish }
}

const handleError = (error: any, form: FormInstance) => {
  const errors = error.response?.data?.errors
  if (errors) {
    Object.keys(errors).forEach(key => {
      const messages = errors[key]
      form.setFields(
        messages.map((message: string) => ({
          name: key,
          errors: [message]
        }))
      )
    })
  }
}

const RegisterFormItems = () => {
  const { t } = useTranslation()
  return (
    <Row gutter={[2, 8]}>
      <Col span={24}>
        <InputWithForm
          label={t('NAME')}
          name="name"
          placeholder={t('INSERTYOURNAME')}
          style={{ margin: 0 }}
          required
        />
      </Col>
      <Col span={24}>
        <Form.Item
          label={t('EMAIL')}
          name="email"
          rules={translateRules(emailrules, t)}
          style={{ margin: 0 }}
        >
          <Input type="email" placeholder={t('email')} />
        </Form.Item>
      </Col>
      <Col xl={12} xs={24}>
        <Form.Item
          label={t('PASSWORD')}
          name="password"
          rules={translateRules(passwordrules, t)}
          style={{ margin: 0 }}
        >
          <Input.Password placeholder={t('PASSWORD')} />
        </Form.Item>
      </Col>
      <Col xl={12} xs={24}>
        <Form.Item
          label={t('PASSWORD_CONFIRMATION')}
          name="password_confirmation"
          style={{ margin: 0 }}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('PASSWORDSNOTMATCH')))
              }
            }),
            { required: true }
          ]}
        >
          <Input.Password placeholder={t('PASSWORD_CONFIRMATION')} />
        </Form.Item>
      </Col>
    </Row>
  )
}

const RegisterCard = () => {
  const { width } = useWindowResize()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()
  const { onFinish } = useRegisterForm(messageApi, form)
  const { t } = useTranslation()
  return (
    <Col
      sm={{ span: 24 }}
      xs={{ span: 24 }}
      lg={{ span: 12 }}
      style={{ padding: width > 720 ? 100 : 10 }}>
      <Form layout="vertical" form={form} onFinish={onFinish} style={{ height: '100%' }} >
        <Row gutter={[8, 8]} align='middle' style={{ margin: 0, height: '100%', alignContent: "center" }}  >
          {contextHolder}
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={24}>
            <Typography.Title>{t('BEGINYOURJOURNEY')}</Typography.Title>
          </Col>
          <RegisterFormItems />
          <Col span={24}>
          </Col>
          <Col span={24}>
            <Button
              data-cy="register-button"
              htmlType="submit"
              type="primary"
              block
            >
              {t('CREATEACCOUNT')}
            </Button>
          </Col>
          <Col span={24}>
            <Link data-cy="go-to-login" to="/login">{t('DOYOUALREADYHAVEANACCOUNT')}</Link>
          </Col>
        </Row>
      </Form>
    </Col>
  )
}

const Register = () => {
  return (
    <Row
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <MainBanner />
      <RegisterCard />
    </Row>
  )
}

export default Register
