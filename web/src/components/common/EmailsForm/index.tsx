import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { IFormList } from '@/types/IFormList'
import FormList from '../FormList'

const EmailsForm = () => (
  <FormList name="emails" label="ADDEMAIL">
    {props => <Email {...props} />}
  </FormList>
)

const Email = ({ field, remove, index }: IFormList) => {
  const { t } = useTranslation()

  return (
    <Form.Item label={index === 0 ? t('EMAIL') : null} key={field.key}>
      <Form.Item
        {...field}
        rules={[
          {
            type: 'email',
            message: t('EMAIL')
          }
        ]}
        noStyle
      >
        <Input style={{ width: '70%', marginRight: '10px' }} />
      </Form.Item>
      <MinusCircleOutlined
        onClick={() => remove(field.name)}
        className="dynamic-delete-button"
      />
    </Form.Item>
  )
}

export default EmailsForm
