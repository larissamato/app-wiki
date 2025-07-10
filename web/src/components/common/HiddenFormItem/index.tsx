import { Form, FormItemProps, Input } from 'antd'

const HiddenFormItem = (props: FormItemProps) => {
  return (
    <Form.Item noStyle style={{ display: 'none' }} {...props}>
      <Input type="hidden" />
    </Form.Item>
  )
}

export default HiddenFormItem
