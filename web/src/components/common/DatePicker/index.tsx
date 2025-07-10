import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { DatePicker as Date, Typography, Col, Form } from 'antd'

const { Text } = Typography
export const DatePicker = ({ name }: { name: string }) => {
  const [date, setDate] = useState<Dayjs | null>(null)
  const { t } = useTranslation()
  const disableDate = (date: Dayjs) => dayjs() > date
  const calculateDaysDifference = () => dayjs(date).diff(dayjs(), 'day')
  const rules = [{ required: true, message: t('requiredItem') }]

  return (
    <Form.Item rules={rules} name={name} label={t(`${name.toUpperCase()}`)}>
      <Date
        style={{ width: '100%' }}
        showTime
        format="DD-MM-YYYY HH:mm"
        disabledDate={disableDate}
        onSelect={date => setDate(date)}
        renderExtraFooter={() => (
          <>
            {date && <Text>{`${calculateDaysDifference()} ${t('DAY')}`}</Text>}
          </>
        )}
      />
    </Form.Item>
  )
}

export default DatePicker
