import { api } from '@helpers/api'
import { IRequest } from '@/types/ICollection'
import { ICompany } from '@/types/ICompany'
import { DefaultOptionType } from 'antd/es/select'

export const mapItemswithNameandUUIDFilter = async (url: string) => {
  return await api.get(`/${url}`).then((items: IRequest<any>) => {
    const filtered = items.data.data.map((item: ICompany) => {
      return { value: item.uuid, label: item.name }
    })
    return filtered as DefaultOptionType[]
  })
}
