
import { api } from '@helpers/api'
import { mapCleanFormatFilter } from '@helpers/MapCleanFormatFilter'
import { DefaultOptionType } from 'antd/es/select'

export const getGenericListsandFilter = async(url: string, value = 'slug', label = 'name') => {
  return await api.get(`/${url}`)
    .then((items) => {
      const filteredItems = mapCleanFormatFilter(items.data, value, label)
      return filteredItems as DefaultOptionType[]
    })
}
