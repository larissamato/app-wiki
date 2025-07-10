import { Input, Form, InputProps, FormItemProps } from 'antd'

interface TextInputProps extends FormItemProps {
  name: string | [number, string]
  rules?: any[]
  label?: string
  tooltip?: any
  InputProps?: InputProps & { type?: string }
}

const TextInput = ({
  name,
  rules,
  label,
  tooltip,
  ...InputProps
}: TextInputProps) => {
  const { type, ...props } = InputProps.InputProps || {}
  return (
    <Form.Item name={name} rules={rules} label={label} tooltip={tooltip}>
      {type === 'password' ? (
        <Input.Password {...props} />
      ) : (
        <Input {...props} />
      )}
    </Form.Item>
  )
}

export default TextInput
