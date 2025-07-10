import { ChangeEvent, useEffect, useState } from 'react'
import { Form, Input, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import useSearchParams from '@hooks/useSearchParams'
import { useLocation } from 'react-router-dom'
import useDebounce from '@hooks/useDebounce'

const useSearchQueryInput = () => {
  const location = useLocation()
  const { setItem, removeItem, getItem } = useSearchParams()
  const [value, setValue] = useState(getItem('search'))
  const [search, setSearch] = useState(getItem('search'))
  const { debouncedValue } = useDebounce(search)

  useEffect(() => {
    if (!location.search.includes('search')) setValue(undefined)
  }, [location.search])

  useEffect(() => {
    if (debouncedValue?.length) {
      setItem('search', debouncedValue)
    }
  }, [debouncedValue])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value.length) {
      setSearch(e.target.value) //setItem('search', e.target.value)
      return
    }
    removeItem('search')
    setSearch('')
  }

  return { onChange, value, defaultValue: value }
}

const SearchByQueryInput = ({ span }: { span?: number }) => {
  const inputProps = useSearchQueryInput()
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} xl={{ span: span || 8 }}>
      <Form.Item name="search">
        <Input
          {...inputProps}
          allowClear
          placeholder={t('SEARCH')}
          data-cy="search-input"
        />
      </Form.Item>
    </Col>
  )
}

export default SearchByQueryInput
