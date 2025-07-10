import { ISUser } from './IUser'

export interface INotification {
  uuid: string
  title: string
  summary: string
  service_table: string
  item_id: string
  actions: {
    open?: string
  }
  mode: string
  reference: string
  read_at: null | string
  created_at: string
  updated_at: string
  created_by: ISUser
  updated_by: ISUser
}
