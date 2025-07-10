import { api } from '@helpers/api'
import { IRequestList } from '@/types/ICollection'

export const getGenericList = async <T>(
  url: string,
  search = ''
): Promise<Array<T>> => {
  return await api
    .get<IRequestList<T>>(`${url}?search=${search}`)
    .then(e => e.data.data)
}
