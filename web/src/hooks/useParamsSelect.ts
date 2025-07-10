import useSearchSelect from './useSearchSelect'
import useSearchParams from './useSearchParams'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface UseParamsSelect<T, D> {
  param: string
  func: (search?: string) => Promise<D>
  initialValue?: T
  paramsToSearch?: boolean
  shouldUpdate?: boolean
  persist?: boolean
}
const useParamsSelect = <T, D>({
  param,
  func,
  initialValue,
  paramsToSearch = false,
  //shouldUpdate = false,
  persist
}: UseParamsSelect<T, D>) => {
  const params = useSearchParams(persist)
  const [value, setValue] = useState(params.getItem(param)?.split(','))
  //const storagedItems = params.getItem(param)
  const location = useLocation()
  const { options, loading, onSearch, onFocus } = useSearchSelect({
    func,
    initialValue
  })

  useEffect(() => {
    onSearch(paramsToSearch ? String(value) : '')
    if (!location.search.includes(param)) setValue(undefined)
  }, [location.search])

  const onChange = (values: [string]) => {
    if (values?.length) {
      setValue(values)
      params.setItem(param, values.toString())
      return
    }
    params.removeItem(param)

    console.log(values)
    setValue(undefined)
  }

  const onClear = () => params.removeItem(param)
  // const defaultValue = storagedItems?.split(',')
  return {
    value,
    setValue,
    options,
    loading,
    onSearch,
    onFocus,
    onChange,
    onClear,
    defaultValue: value
  }
}

export default useParamsSelect
