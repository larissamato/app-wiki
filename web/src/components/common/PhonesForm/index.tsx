import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import InputMask from 'react-input-mask'
import { IFormList } from '@/types/IFormList'
import FormList from '../FormList'

const formatPhoneNumber = value => {
  return value.replace(/\D/g, '')
}

const PhonesForm = ({ name }: { name?: string }) => {
  return (
    <FormList label="ADDPHONE" name={name ?? 'phones'}>
      {props => <PhoneNumber {...props} />}
    </FormList>
  )
}

const PhoneNumber = ({ field, remove, index }: IFormList) => {
  const { t } = useTranslation()

  return (
    <Form.Item label={index === 0 ? t('PHONE') : null} key={field.key}>
      <Form.Item
        {...field}
        getValueFromEvent={e => `${formatPhoneNumber(e.target.value)}`}
        noStyle
      >
        <InputMask
          mask="+99 (99) 99999-9999"
          placeholder="+55 (11) 11111-1111"
          alwaysShowMask={false}
          data-cy="phone-input"
        >
          {inputProps => (
            <Input
              {...inputProps}
              style={{ width: '70%', marginRight: '10px' }}
            />
          )}
        </InputMask>
      </Form.Item>
      <MinusCircleOutlined
        onClick={() => remove(field.name)}
        className="dynamic-delete-button"
      />
    </Form.Item>
  )
}

export default PhonesForm
