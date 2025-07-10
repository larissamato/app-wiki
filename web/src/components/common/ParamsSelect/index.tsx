import useSearchParams from "@hooks/useSearchParams"
import { Select, Col } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"

type ParamsSelectProps = { options: Array<string>; param: string }

const { Option } = Select
export const useParamsSelect = (param: string) => {
  const params = useSearchParams()
  const [value, setValue] = useState(params.getItem(param))
  const location = useLocation()
  useEffect(() => {
    !location.search.includes(param)
      ? setValue(undefined)
      : setValue(() => params.getItem(param))
  }, [location.search])
  const onChange = (value: string) => {
    params.setItem(param, value)
    setValue(value)
  }

  const onClear = () => {
    params.removeItem(param)
    setValue(undefined)
  }
  return { value, onChange, onClear, defaultValue: value }
}

const ParamsSelect = ({ options, param }: ParamsSelectProps) => {
  const { t } = useTranslation()
  const paramsSelect = useParamsSelect(param)
  return (
    <Col xs={{ span: 24 }} xl={{ span: 4 }}>
      <Select
        data-cy={`params-select-${param}`}
        {...paramsSelect}
        placeholder={`${t('FILTERBY')} ${t(param.toUpperCase())}`}
        allowClear
        style={{ width: '100%' }}
      >
        {options.map(item => (
          <Option key={item} value={item}>
            {t(item)}
          </Option>
        ))}
      </Select>
    </Col>
  )
}
export default ParamsSelect
