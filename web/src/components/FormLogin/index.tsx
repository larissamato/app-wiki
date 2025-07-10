import { Form, FormProps, ButtonProps, Space, Divider, Flex, Button as AButton } from 'antd'
import Button from '@common/Button'
import { useTranslation } from 'react-i18next'
import TextInput from '@common/TextInput'
import { translateRules } from '@helpers/translateRulesInput'
import { Link, useNavigate } from 'react-router-dom'
import OauthLoginButton from '@components/Login/OathLoginButton'
import Icon from '@components/common/Icon'

interface FormLoginProps extends FormProps {
  loading: boolean
}

const emailrules = [
  { required: true, message: 'emailEmpty' },
  { type: 'email', message: 'emailInvalid' }
]
const passwordrules = [
  { required: true, message: 'PASSWORDEMPTY' },
  { min: 5, message: 'PASSWORDINVALID' }
]

const emailInputProps = {
  type: 'email',
  maxLength: 300
}

const RegisterButton = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <AButton
      onClick={() => navigate('/register')}
      type="primary"
      icon={<Icon name="fa-solid fa-user-plus" color='white' />}
      block
    >
      {t('CREATEACCOUNT')}
    </AButton >
  )
}
const Submit = (props: ButtonProps) => {
  const { t } = useTranslation()
  return (
    <Button
      {...props}
      block
      type="primary"
      htmlType='submit'
    >
      {t('login')}
    </Button>
  )
}

const FormLogin = ({ loading, ...props }: FormLoginProps) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  return (
    <Form {...props} id="Login" form={form}>
      <TextInput
        name="email"
        rules={translateRules(emailrules, t)}
        InputProps={{
          ...emailInputProps,
          placeholder: t('email')
        }}
      />
      <TextInput
        name="password"
        rules={translateRules(passwordrules, t)}
        InputProps={{
          type: 'password',
          placeholder: t('SETPASSWORD'),
          maxLength: 300
        }}
      />
      <Flex justify='end'>
        <Link to={'/forgot-password'}>{t('FORGOTPASSWORD')}</Link>
      </Flex>
      <Space direction="vertical" style={{ width: '100%', marginTop: '10px' }}>
        <Submit loading={loading} onClick={form.submit} block />
        <RegisterButton />
      </Space>
    </Form>
  )
}

export default FormLogin
