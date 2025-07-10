import { Dispatch, SetStateAction, createContext } from 'react'

interface TableContextType<T> {
  data: T
  setData: Dispatch<SetStateAction<T>>
}

export const TableContext = createContext<TableContextType<any> | undefined>(
  undefined
)
