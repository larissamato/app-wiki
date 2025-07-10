import { ListProps, TableProps } from 'antd'
import {Dispatch, SetStateAction} from 'react'

export interface UseTable<D,T>
  extends Pick<ListProps<T>, 'dataSource' | 'pagination'>,
    Pick<TableProps<T>, 'locale' | 'loading' | > {
  handleTableChange: any
  data: D,
  setData: Dispatch<SetStateAction<D>> 
  onChange: any
}
