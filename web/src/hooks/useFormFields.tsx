import { useTranslation } from 'react-i18next'
import { Input, DatePicker, Form, FormInstance } from 'antd'
import dayjs from 'dayjs'
import { GenericSelect } from '@components/GenericSelect'
import TimeRangeInput from '@components/OnBoard/TimeRangeImput'
import { Rule } from 'antd/lib/form'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { ICompany } from '@/types/ICompany'
import InputMask from 'react-input-mask'

const createSelect = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  t: (key: string) => string,
  rules: Rule[] = [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
) => ({
  name,
  label,
  component: <GenericSelect name={name} options={options} noStyle />,
  rules
})

const createInput = (
  name: string,
  label: string,
  t: (key: string) => string,
  type?: string
) => ({
  name,
  label,
  component: <Input type={type} />,
  rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
})

const createTextArea = (
  name: string,
  label: string,
  t: (key: string) => string,
  rows: number,
  rules: Rule[] = [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
) => ({
  name,
  label,
  component: <Input.TextArea rows={rows} />,
  rules
})

const disableDate = (date: dayjs.Dayjs) => dayjs() < date

const validateTimeDifference = (
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs
) => {
  const diffInHours = endTime.diff(startTime, 'hour', true)
  return diffInHours >= 3 && endTime.isAfter(startTime)
}

export const getSegmentOptions = () => {
  const { t } = useTranslation()
  return [
    { label: t('FORMONBOARD.TECHNOLOGY'), value: 'Tecnologia' },
    { label: t('FORMONBOARD.HEALTH'), value: 'Saúde' },
    { label: t('FORMONBOARD.EDUCATION'), value: 'Educação' },
    { label: t('FORMONBOARD.FINANCE'), value: 'Finanças' },
    { label: t('FORMONBOARD.RETAIL'), value: 'Varejo' },
    { label: t('FORMONBOARD.LOGISTICS'), value: 'Logística' },
    { label: t('FORMONBOARD.OTHER'), value: 'Outro' }
  ]
}

export const getEmployeeSizeOptions = () => {
  const { t } = useTranslation()
  return [
    { label: `1-10 ${t('FORMONBOARD.EMPLOYEES')}`, value: '1-10' },
    { label: `11-50 ${t('FORMONBOARD.EMPLOYEES')}`, value: '11-50' },
    { label: `51-200 ${t('FORMONBOARD.EMPLOYEES')}`, value: '51-200' },
    { label: `201-500 ${t('FORMONBOARD.EMPLOYEES')}`, value: '201-500' },
    { label: `501-1000 ${t('FORMONBOARD.EMPLOYEES')}`, value: '501-1000' },
    { label: t('FORMONBOARD.MORETHAN1000'), value: '+1000' }
  ]
}
export const getContactPreferences = () => {
  const { t } = useTranslation()
  return [
    { value: 'E-mail', label: t('FORMONBOARD.EMAIL') },
    { value: 'WhatsApp privado', label: t('FORMONBOARD.PRIVATEWHATSAPP') },
    { value: 'Grupo de WhatsApp', label: t('FORMONBOARD.WHATSAPPGROUP') },
    { value: 'Ligação', label: t('FORMONBOARD.PHONECALL') }
  ]
}

export const DocnumInput = () => {
  const { t } = useTranslation()
  return (
    <Form.Item
      label="Cpf/Cnpj:"
      name="docnum"
      rules={[
        { required: true, message: t('FORMONBOARD.MESSAGE') },
        {
          validator(_, value) {
            if (cpf.isValid(value) || cnpj.isValid(value)) {
              return Promise.resolve()
            } else {
              return Promise.reject(new Error(t('INVALID_DOCNUM')));
            }
          }
        }
      ]}
    >
      <Input />
    </Form.Item>
  )
}

export const PhoneInput = ({ form }: { form: FormInstance<any> }) => {
  const { t } = useTranslation()

  const normalizePhone = (value: string) => {
    return value.replace(/\D/g, '')
  }

  return (
    <Form.Item
      name="phones"
      label={t('FORMONBOARD.PHONE')}
      required
      rules={[
        {
          required: true,
          message: t('FORMONBOARD.MESSAGE')
        },
      ]}
      normalize={normalizePhone}
    >
      <InputMask
        mask="+99 (99) 99999-9999"
        maskChar={null}
        placeholder="+55 (11) 11111-1111"
        alwaysShowMask={false}
        data-cy="phone-input"
      >
        {(inputProps) => (
          <Input
            {...inputProps}
            style={{ width: '100%', marginRight: '10px' }}
          />
        )}
      </InputMask>
    </Form.Item>
  )
}

export const useFormFields = (company?: ICompany, form?: FormInstance<any>) => {
  const { t } = useTranslation()
  const marketOnlineFields = [
    createTextArea(
      'name',
      t('FORMONBOARD.NAME'),
      t,
      1
    ),
    {
      component: (
        <DocnumInput />
      ),
      rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
    },
    {
      component: (
        <PhoneInput form={form} />
      ),
    },
  ]

  const defaultFields = [
    {
      name: 'birthday',
      label: t('FORMONBOARD.BIRTHDAY'),
      component: (
        <DatePicker
          format="DD-MM-YYYY"
          style={{ width: '100%' }}
          disabledDate={disableDate}
        />
      ),
      rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
    },
    createSelect(
      'cs_contact_preference',
      t('FORMONBOARD.CONTACT_PREFERENCE'),
      getContactPreferences(),
      t
    ),
    createSelect(
      'cs_segment',
      t('FORMONBOARD.SEGMENT'),
      getSegmentOptions(),
      t
    ),
    createSelect(
      'cs_employees_size',
      t('FORMONBOARD.COMPANY_SIZE'),
      getEmployeeSizeOptions(),
      t
    ),
    TimeRangeInput({
      namePrefix: 'cs_working_time',
      label: t('FORMONBOARD.WORKING_TIME'),
      startPlaceholder: t('FORMONBOARD.START_TIME'),
      endPlaceholder: t('FORMONBOARD.END_TIME'),
      validateTimeDifference,
      rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
    }),
    TimeRangeInput({
      namePrefix: 'cs_backup_time',
      label: t('FORMONBOARD.BACKUP_TIME'),
      startPlaceholder: t('FORMONBOARD.BACKUP_START_TIME'),
      endPlaceholder: t('FORMONBOARD.BACKUP_END_TIME'),
      validateTimeDifference,
      rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
    }),
    TimeRangeInput({
      namePrefix: 'cs_maintenance_time',
      label: t('FORMONBOARD.MAINTENANCE_TIME'),
      startPlaceholder: t('FORMONBOARD.MAINTENANCE_START_TIME'),
      endPlaceholder: t('FORMONBOARD.MAINTENANCE_END_TIME'),
      validateTimeDifference,
      rules: [{ required: true, message: t('FORMONBOARD.MESSAGE') }]
    }),
    createInput(
      'cs_users_active_usage',
      t('FORMONBOARD.SIMULTANEOUS_USERS'),
      t,
      'number'
    ),
    createTextArea(
      'cs_partner_expectations',
      t('FORMONBOARD.PARTNER_EXPECTATIONS'),
      t,
      2
    ),
    createTextArea(
      'cs_environment_obs',
      t('FORMONBOARD.ENVIRONMENT_OBS'),
      t,
      5
    ),
    createTextArea(
      'cs_environment_usage',
      t('FORMONBOARD.ENVIRONMENT_USAGE'),
      t,
      3
    ),
    createTextArea(
      'cs_first_questions',
      t('FORMONBOARD.FIRST_QUESTIONS'),
      t,
      4
    )
  ]
  if (company?.tags?.includes("MARKETONLINE")) {
    return marketOnlineFields
  } else {
    return defaultFields
  }
}
