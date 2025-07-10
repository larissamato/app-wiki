import { TableContext } from '@contexts/TableContext'
import { IRequestList } from '@/types/ICollection'
import { ITableContext } from '@/types/ITableCard'
import { useContext } from 'react'
import { api } from '@helpers/api'

type Item<T> = T & { uuid: string; slug: string }
const copyObj = (obj: {}) => JSON.parse(JSON.stringify(obj))

const findItemIndex = <T>(data: Item<T>[], uuid: string): number =>
  data.findIndex(item => item.uuid === uuid)

const useTableContext = <T>(): ITableContext => {
  const context = useContext(TableContext)

  const refreshTable = async (url: string) => {
    const response = await api.get(url)
    response.data?.data &&
      context?.setData(() => ({ data: response.data.data }))
  }

  const update = (uuid: string, newItem: T) =>
    context?.setData((prev: IRequestList<Item<T>>) => ({
      ...copyObj(prev),
      data: prev.data.map((item: Item<T>) =>
        item.uuid === uuid ? newItem : item
      )
    }))

  const remove = (uuid: string) =>
    context?.setData((prev: IRequestList<Item<T>>) => {
      const index = findItemIndex(prev.data, uuid)
      return {
        ...copyObj(prev),
        data: [...prev.data.splice(0, index), ...prev.data.splice(index + 1)]
      }
    })

  return { update, remove, refreshTable }
}

export default useTableContext
