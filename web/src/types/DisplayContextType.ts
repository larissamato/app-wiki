import { Dispatch, SetStateAction } from 'react'
type ListType = 'list' | 'table'
export type DisplayContextType = {
  list: ListType
  setList: Dispatch<SetStateAction<ListType>>
}
