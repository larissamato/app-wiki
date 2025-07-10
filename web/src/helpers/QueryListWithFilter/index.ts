import { api } from '@helpers/api'
import useFetch from '@hooks/useFetch'

interface IFilter {
  slug: string
  name: string
  uuid: string
}

interface PropsResponse {
  data: IFilter
}

export const queryOptions = async (params: { url: string }) => {
  return await api.get(`${params.url}`)
    .then((response: PropsResponse) => response)
}

export const queryListWithFilter = (url: string, dep?: any) => {
  const { data, loading,  isSuccess } = useFetch<IFilter>({
    func: queryOptions,
    params: {
      url
    },
    deps: [dep, url]
  })
  return { data, isSuccess, loading }
}
