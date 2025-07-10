import { api } from '@helpers/api'
import { useLocation } from 'react-router-dom'
import { useIntervalFetch } from '@hooks/useFetch'
import { IRequestList } from '@types/ICollection'
import { useUser } from '@contexts/UserContext'

interface ParamsType {
  url: string
  page: number
  perPage: number
  search: string
  cancelSearch?: boolean
}

export const queryFetch = async <T>(
  params: ParamsType,
  signal?: AbortSignal
) => {
  const searchParam = decodeURIComponent(params.search).slice(1)

  let search = null
  if (!params.cancelSearch && searchParam) {
    search = searchParam.endsWith('&') ? searchParam : `${searchParam}&`
  }

  const query = `${params.url}${params.url.includes('?') ? '&' : '?'}${search ?? ''}page=${params.page}&perPage=${params.perPage}`

  return await api.get<T>(query, { signal: signal }).then(response => response)
}

export const queryListWithPagination = <T>(
  url: string,
  page: number,
  cancelSearch: boolean = false
) => {
  const { search } = useLocation()
  const { perPage } = useUser()

  const { data, isSuccess, loading, setLoading, setData, handleCall } =
    useIntervalFetch<IRequestList<T>, ParamsType>({
      func: queryFetch,
      deps: [page, perPage, search, url],
      params: { url, page, perPage, search, cancelSearch }
    })

  return { data, isSuccess, loading, setLoading, setData, handleCall }
}
