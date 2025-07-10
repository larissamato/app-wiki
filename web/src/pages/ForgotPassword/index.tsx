import {
  Card,
  Typography,
  Row,
  Flex,
  Space,
  Col,
  Form,
  Button,
  message
} from 'antd'
import TextInput from '@components/common/TextInput'
import { useTranslation } from 'react-i18next'
import { api } from '@helpers/api'
import { MessageInstance } from 'antd/es/message/interface'
import { handleError } from '@helpers/handleError'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: '100vh', backgroundColor: '#232020' }}
    >
      {contextHolder}
      <Col lg={{ span: 8 }} xs={{ span: 22 }}>
        <Card style={{ textAlign: 'center' }}>
          <Space direction="vertical">
            <Typography.Title>{t('RESET_PASSWORD')}</Typography.Title>
            <Typography.Text>{t('MESSAGEFORGOTPASSWORD')} </Typography.Text>
            <ResetPasswordForm messageApi={messageApi} />
          </Space>
        </Card>
      </Col>
    </Row>
  )
}


interface ResetPasswordFormProps {
  messageApi: MessageInstance
}

const ResetPasswordForm = ({ messageApi }: ResetPasswordFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const onFinish = async (values: { email: string }) => {
    try {
      await api.post('/forgot-password', values)
      messageApi.success(t('SENDTOEMAILSUCCESS'), 5)
      form.resetFields()
    } catch (error) {
      handleError(error, messageApi, t('SENDTOEMAILERROR'), 5)
    }
  }

  return (
    <Form
      name="forgot-password"
      id="forgot-password"
      onFinish={onFinish}
      layout="vertical"
      form={form}
    >
      <TextInput
        name="email"
        rules={[
          { type: 'email', message: t('emailInvalid') },
          { required: true, message: t('emailEmpty') }
        ]}
        InputProps={{ placeholder: t('email') }}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('SENDTOEMAIL')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ForgotPassword
