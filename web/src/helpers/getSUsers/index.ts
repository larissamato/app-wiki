import { api } from '@helpers/api'
import { ISUser } from '@/types/IUser'

export const getSUsers = async (search?: string, uuid?: string) => {
  return await api.get(`ticket/assignee?search=${search}`).then(susers => {
    const filteredItems = susers.data.data.map((suser: ISUser) => {
      return suser.uuid === uuid ? { ...suser, name: '(Eu mesmo)' } : suser
    })
    return filteredItems
  })
}
