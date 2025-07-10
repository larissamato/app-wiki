import { FormItemProps, InputProps } from 'antd'
import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
interface InputWithFormProps
  extends FormItemProps,
  Omit<InputProps, 'status' | 'onReset' | 'name' | 'children'> {
  required?: boolean
  layout?: string
}

const InputWithForm = ({ required, placeholder, ...props }: InputWithFormProps) => {
  const { t } = useTranslation()
  const reqRule = [{ required: true, message: t('requiredItem') }]

  return (
    <Form.Item {...props} rules={required ? reqRule : props.rules}>
      <Input placeholder={placeholder} />
    </Form.Item>
  )
}

export default InputWithForm
