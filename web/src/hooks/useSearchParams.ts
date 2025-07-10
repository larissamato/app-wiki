import { addSearchParams } from '@helpers/addSearchParams'
import { deleteSearchParams } from '@helpers/deleteSearchParams'
import { SearchParams } from '/@types/SearchParams'
import {
  SetURLSearchParams,
  useSearchParams as useParams
} from 'react-router-dom'

const getItemOnSearchParams = (name: string, searchParams: URLSearchParams) => {
  let paramsObj: Record<string, string> = {}

  if (!searchParams.has(name)) {
    return undefined
  }
  searchParams.forEach((value, key) => {
    paramsObj[key] = value
  })
  return paramsObj.hasOwnProperty(name)
    ? paramsObj[name as keyof typeof paramsObj]
    : undefined
}

const removeItemsFromLocalStorage = (
  name: string,
  params: string,
  searchParams: URLSearchParams
) => {
  const path = location.pathname.substring(1) || 'dashboard'
  const searchParamsObj: URLSearchParams = new URLSearchParams(params)
  searchParams.forEach((value, key) => {
    searchParamsObj.append(key, value)
  })
  searchParamsObj.delete(name)
  const newString = searchParamsObj.toString()
  newString.length > 1
    ? localStorage.setItem(path, `?${newString}`)
    : localStorage.removeItem(path)
}

const setItemOnSearch = (
  name: string,
  value: string,
  setSearchParams: SetURLSearchParams
) => {
  if (name.length && value.length) {
    addSearchParams(name, setSearchParams, value)
  }
}

const removeItemOnSearch = (
  name: string,
  searchParams: URLSearchParams,
  path?: string,
  persist?: boolean
) => {
  if (path) {
    const params = localStorage.getItem(path)
    if (params?.length && persist)
      removeItemsFromLocalStorage(name, params, searchParams)
  }
}

const useSearchParams = (persist = false): SearchParams => {
  const [searchParams, setSearchParams] = useParams()
  const path = location.pathname.substring(1) || 'dashboard'

  const setItem = (name: string, value: string) => {
    return setItemOnSearch(name, value, setSearchParams)
  }

  const getItem = (name: string) => {
    return getItemOnSearchParams(name, searchParams)
  }

  const removeItem = (name: string) => {
    removeItemOnSearch(name, searchParams, path, persist)
    deleteSearchParams(name, setSearchParams)
  }

  const toogleItem = (name: string, value: string) => {
    const current = getItem(name)
    current === value ? removeItem(name) : setItem(name, value)
  }

  return { setItem, getItem, removeItem, toogleItem }
}

export default useSearchParams
