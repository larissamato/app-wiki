import { IOption } from '@/types/IOption'
import { Col, Form, Radio, RadioChangeEvent, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParamsSelect } from '../ParamsSelect'
import { fetchConstants } from '@components/common/SelectInput'
import { useGenericContext } from '@hooks/useGenericContext'
import { MessageContext } from '@contexts/MessageContext'

interface ButtonRadioInputProps {
  span: number
  label?: string
  constant: string
  required?: boolean
  inputName: string | string[]
  placeholder?: string
  onChange?: (value: string) => void
  filter?: string
  buttonStyle?: 'outline' | 'solid'
  size?: 'large' | 'middle' | 'small'
  initialValue?: string
}
export const ButtonRadioInput = ({
  span,
  label,
  constant,
  required,
  inputName,
  placeholder,
  onChange,
  filter,
  buttonStyle = 'outline',
  size = 'middle',
  initialValue,
  ...props
}: ButtonRadioInputProps) => {
  const [data, setData] = useState<IOption[]>([])
  const { t } = useTranslation()
  const [value, setValue] = useState<string>(initialValue ?? '')
  const form = Form.useFormInstance()
  const messageApi = useGenericContext(MessageContext)

  useEffect(() => {
    const fetchData = async () => {
      const options = await fetchConstants(constant, t, messageApi)
      setData(options || [])
      if (options?.length > 0 && !initialValue) {
        const firstValue = options[0].value
        setValue(firstValue)
        form.setFieldValue(inputName, firstValue)
      }
    }
    fetchData()
  }, [constant])
  const { onChange: paramSelectOnChange, ...restParamsSelect } = useParamsSelect(filter)
  const handleChange = (e: RadioChangeEvent) => {
    const selectedValue = e.target.value
    setValue(selectedValue)
    if (onChange) {
      onChange(selectedValue)
    }
    if (paramSelectOnChange) {
      paramSelectOnChange(selectedValue)
    }
  }
  return (
    <Col xs={{ span: 24 }} xl={{ span: span }}>
      <Form.Item
        name={inputName}
        label={label ? t(label) : ''}
        rules={[{ required: required, message: t('requiredItem') }]}
        initialValue={initialValue ?? (data.length > 0 ? data[0].value : undefined)}
      >
        <Radio.Group
          onChange={handleChange}
          value={value}
          {...restParamsSelect}
          {...props}
        >
          <Space direction="horizontal" size={16} wrap>
            {data.map((option) => (
              <Radio.Button
                key={option.value}
                value={option.value}
                style={
                  buttonStyle === 'outline'
                    ? { background: 'transparent' }
                    : undefined
                }
                size={size}
              >
                {option.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Col>
  )
}
