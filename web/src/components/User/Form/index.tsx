import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Switch, Select, SelectProps } from 'antd'
import type { ISUser, IUser } from '@/types/IUser'
import type { IOption } from '@/types/IOption'
import type { ICreateForm } from '@/types/ICreateForm'
import useForm from '@hooks/useForm'
import TextInput from '@common/TextInput'
import { mapItemswithNameandUUIDFilter } from '@helpers/mapItemswithNameandUUIDFilter'
import { level } from '@constants/level'
import { rulesUser } from '@helpers/rulesUser'
import dayjs from 'dayjs'
import { SearchSelectWithForm } from '@components/common/SearchSelectWithForm'
import useSearchSelect from '@hooks/useSearchSelect'
import { api } from '@helpers/api'

const inputFields = ['name', 'email', 'password', 'password_confirmation']

interface CreateUserProps extends ICreateForm {
  data: Partial<IUser> | undefined
}

interface PropsSelect extends SelectProps {
  searchUrl: string
  name: string
  initialValue: IOption[]
  onChange?: (value: string) => void
  require: boolean
}

interface FormConstantsProps {
  name: string
  option: IOption[]
  mode?: 'multiple' | 'tags' | undefined
}

const initialValues = (data: Partial<ISUser> | undefined) => {
  if (data) {
    return {
      ...data,
      phones: data?.phones || [],
      roles: data?.roles || [],
    }
  }
}

export function SearchSelect({
  searchUrl,
  name,
  initialValue = [],
  require,
  ...props
}: PropsSelect) {
  const [options, setOptions] = useState<IOption[] | []>(initialValue)
  const [searchValue, setSearchValue] = useState('')
  const { t } = useTranslation()
  const typeName = typeof name
  async function fetchData() {
    const filteredOptions = await mapItemswithNameandUUIDFilter(
      `${searchUrl}search=${searchValue}`
    )
    setOptions(filteredOptions)
  }
  useEffect(() => {
    fetchData()
  }, [searchValue, searchUrl])
  return (
    <Form.Item
      name={typeName === 'string' ? name.toLowerCase() : name}
      label={t(`${typeName === 'string' ? name : props.placeholder}`)}
      rules={[{ required: require, message: t('valueEmpty') }]}
    >
      <Select
        {...props}
        showSearch
        filterOption={false}
        onSearch={value => setSearchValue(value)}
        style={{ width: '100%' }}
        options={options ? options : []}
      ></Select>
    </Form.Item>
  )
}

const SectorSelect = () => {
  const { t } = useTranslation()
  const { ...props } = useSearchSelect({
    func: async (search = '') => await api.get(`sector?search=${search}`)
      .then(e => e.data.data.map(e => ({ label: e.name, value: e.slug })))
  })
  return (
    <SearchSelectWithForm mode="multiple" name='sectors' label={t("SECTORS")} span={6} required={false} {...props} />
  )
}

const TierSelect = () => {
  const { t } = useTranslation()
  const { ...props } = useSearchSelect({
    func: async (search = '') => await api.get(`user/tier?search=${search}`)
      .then(e => e.data.data.map(e => ({ label: e.name, value: e.slug })))
  })
  return (
    <SearchSelectWithForm mode="multiple" name='tiers' label={t("TIERS")} span={6} required={false} {...props} />
  )
}

const FormUser = ({ onClose, action, data, ...props }: CreateUserProps) => {
  const [form] = Form.useForm()
  const [showDocnum, setShowDocnum] = useState(data?.signer)
  const close = () => {
    form.resetFields()
    onClose()
  }
  const { onFinish, disabled, contextHolder } = useForm(
    action,
    close,
    '/user',
    data?.uuid
  )
  const handleFinish = values => {
    const formattedValues = {
      ...values,
      birthday: values.birthday
        ? dayjs(values.birthday).format('YYYY-MM-DD')
        : null,
      tags: Array.isArray(values.tags) ? values.tags : [],
    }

    onFinish(formattedValues)
  }
  const { t } = useTranslation()
  const renderSelectOptions = (options: IOption[]): IOption[] =>
    options.map(option => ({
      value: option.value,
      label: t(option.label)
    }))
  const fieldRules: any = rulesUser(t)

  const FormConstansts = ({ name, option, mode }: FormConstantsProps) => (
    <Col xs={{ span: 12 }} xl={{ span: 8 }}>
      <Form.Item name={name} label={t(name.toUpperCase())}>
        <Select
          style={{ width: '100%' }}
          options={renderSelectOptions(option)}
          mode={mode}
        />
      </Form.Item>
    </Col>
  )

  return (
    <Form
      {...props}
      form={form}
      disabled={disabled}
      layout="vertical"
      initialValues={initialValues(data)}
      onFinish={handleFinish}
    >
      {contextHolder}
      <Row gutter={12}>
        {inputFields.map(item => (
          <Col key={item} xs={{ span: 12 }} xl={{ span: 12 }}>
            <TextInput
              {...{ key: item, name: item }}
              label={t(item.toUpperCase())}
              rules={[
                {
                  required: action === 'create',
                  message: t('requiredItem')
                },
                fieldRules[item]
              ]}
            />
          </Col>
        ))}
        <FormConstansts name="level" option={level} />
        <Col xs={{ span: 6 }}>
          <Form.Item name="can_receive_emails" label={t('RECEIVEEMAIL')}>
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={{ span: 6 }}>
          <Form.Item name="signer" label={t('CONTRACTS_SIGNER')}>
            <Switch onChange={setShowDocnum} />
          </Form.Item>
        </Col>
      </Row>
    </Form >
  )
}

export default FormUser
