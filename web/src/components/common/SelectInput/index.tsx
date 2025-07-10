import { api } from '@helpers/api'
import { IOption } from '@/types/IOption'
import { Col, Form, Select, SelectProps } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageInstance } from 'antd/es/message/interface'
import { handleError } from '@helpers/handleError'
import { useParamsSelect } from '../ParamsSelect'
import { useGenericContext } from '@hooks/useGenericContext'
import { MessageContext } from '@contexts/MessageContext'

interface SelectInputProps extends SelectProps {
  span: number
  label?: string
  constant: string
  required?: boolean
  inputName: string
  placeholder?: string
  onChange?: (value: string[]) => void
  multiple?: boolean
  search?: boolean
  filter?: string
  filterOptions?: string
  selectFirstOption?: boolean
}

export const fetchConstants = async (constant: string, t: (key: string) => string, messageApi: MessageInstance) => {
  try {
    const response = await api.get('/constants')
    const options: IOption[] = Object.entries(response.data[constant]).map(
      ([key, value]) => ({
        value: String(value),
        label: t(String(value))
      })
    )
    return options
  } catch (error) {
    handleError(error, messageApi, t('GETFORMDATAERROR'))
  }
}

export const SelectInput = ({
  span,
  label,
  constant,
  required,
  inputName,
  placeholder,
  onChange,
  multiple,
  search,
  filter,
  filterOptions,
  selectFirstOption,
  ...props
}: SelectInputProps) => {
  const [data, setData] = useState<IOption[]>()
  const { t } = useTranslation()
  const messageApi = useGenericContext(MessageContext)
  const form = Form.useFormInstance()

  useEffect(() => {
    const fetchData = async () => {
      const options = await fetchConstants(constant, t, messageApi)
      setData(options)

      if (
        options &&
        selectFirstOption &&
        form.getFieldValue(inputName) === undefined
      ) {
        const defaultValue = multiple ? [options[0].value] : options[0].value
        form.setFieldsValue({ [inputName]: defaultValue })
        handleChange(defaultValue) 
      }
    }
    fetchData()
  }, [constant])

  const { onChange: paramSelectOnChange, ...restParamsSelect } = useParamsSelect(filter)

  const handleChange = (value: any) => {
    const normalizedValue = multiple && (value === undefined || value === null) ? [] : value

    if (onChange) {
      onChange(normalizedValue)
    }
    if (search && paramSelectOnChange) {
      paramSelectOnChange(normalizedValue)
    }
  }

  return (
    <Col xs={{ span: 24 }} lg={{ span: span }} xl={{ span: span }}>
      <Form.Item
        name={inputName}
        label={label ? t(label) : ''}
        rules={[{ required: required, message: t('requiredItem') }]}
      >
        <Select
          data-cy="select-input"
          showSearch={search}
          mode={multiple ? 'multiple' : undefined}
          onChange={handleChange}
          placeholder={placeholder ? t(placeholder) : t('CHOOSEANITEM')}
          allowClear
          filterOption={(input, data) =>
            data?.label?.toLowerCase().includes(input.toLowerCase())
          }
          options={
            data
              ? data
                .filter(option => option !== undefined)
                .filter(option =>
                  filterOptions
                    ? option.value.toLowerCase().includes(filterOptions.toLowerCase())
                    : true
                )
              : []
          }
          {...restParamsSelect}
          {...props}
        />
      </Form.Item>
    </Col>
  )
}
