import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItemProps } from 'antd'
import { Form, Col, Select, SelectProps } from 'antd'

export interface TicketSelectProps<T>
  extends SelectProps,
  PropsWithChildren,
  Omit<FormItemProps, 'children' | 'status'> {
  required?: boolean
  span?: number
  data?: T
}

const selectDefaultProps = {
  optionLabelProp: 'label',
  showSearch: true,
  filterOption: false
}

export const SearchSelectWithForm = <T,>({
  span,
  name,
  children,
  required = true,
  ...props
}: TicketSelectProps<T>) => {
  const { t } = useTranslation()
  const combinedProps = { ...selectDefaultProps, ...props }
  return (
    <Col xs={{ span: 24 }} xl={{ span }}>
      <Form.Item
        name={name}
        label={props.label ? t(String(props.label)) : t(name)}
        rules={[{ required: required, message: t('requiredItem') }]}
      >
        <Select
          placeholder={t('CHOOSEANITEM')}
          {...combinedProps}
          data-cy={`select-${name}`}
        >
          {children}
        </Select>
      </Form.Item>
    </Col>
  )
}