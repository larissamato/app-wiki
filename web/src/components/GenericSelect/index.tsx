import { Select, Form, SelectProps } from 'antd'
import { Rule } from 'antd/lib/form'

const { Option } = Select

interface GenericSelectProps extends SelectProps {
  name: string
  label?: string | React.ReactNode
  options: Array<{ value: string; label: string }>
  rules?: Rule[]
  span?: number
  noStyle?: boolean
  children?: React.ReactNode
}

export const GenericSelect = ({
  name,
  label,
  children,
  options,
  rules = [{ required: true, message: '' }],
  span,
  noStyle = false,
  ...selectProps
}: GenericSelectProps) => {
  const selectComponent = (
    <Select allowClear {...selectProps} filterOption={false}>
      {options.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  )

  return (
    <Form.Item name={name} label={label} rules={rules} {...selectProps}>
      {children}
      {selectComponent}
    </Form.Item>
  )
}
