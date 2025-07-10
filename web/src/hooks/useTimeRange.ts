import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'
import useSearchParams from './useSearchParams'

const formatDate = (date: any) => dayjs(date).format('DD-MM-YYYY HH:mm')

const clearParams = (params: any, keys: string[]) => {
  localStorage.clear()
  keys.forEach(key => params.removeItem(key))
}

const updateURL = (
  paramStart: string,
  paramEnd: string,
  values: Dayjs[],
  params: any,
  location: any,
  navigate: any
) => {
  const [startDate, endDate] = values.map(formatDate)

  params.setItem(paramStart, startDate)
  params.setItem(paramEnd, endDate)

  const newParams = new URLSearchParams(location.search)
  newParams.set(paramStart, startDate)
  newParams.set(paramEnd, endDate)

  const newUrl = `${location.pathname}?${newParams.toString()}`
  navigate(newUrl, { replace: true })
}
const useTimeRange = (
  paramStart: string,
  paramEnd: string,
  persist = false
) => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useSearchParams(persist)

  const [value, setValue] = useState<Dayjs[] | undefined>(() => {
    const startDate = params.getItem(paramStart)
    const endDate = params.getItem(paramEnd)
    return startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : undefined
  })

  const handleClear = () => {
    clearParams(params, [paramStart, paramEnd])
    navigate(location.pathname, { replace: true })
    setValue(undefined)
  }

  const handleChange = (values: Dayjs[] | null) => {
    if (values && values.length === 2) {
      updateURL(paramStart, paramEnd, values, params, location, navigate)
      setValue(values)
    } else {
      handleClear()
    }
  }

  return { value, onChange: handleChange, onClear: handleClear }
}

export default useTimeRange
