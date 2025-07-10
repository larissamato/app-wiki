import { TFunction } from 'i18next'
import { TableProps } from 'antd'

export interface ITableCard<T> {
  data: T
}

export interface TableCardProps<T> extends TableProps<T> {
  url: string
  columns: any
  func?: (data: any, t?: TFunction) => T[]
}

export interface ITableContext {
  update: (uuid: string, item: any) => void
  remove: (uuid: string) => void
  refreshTable: (url: string) => void
}
