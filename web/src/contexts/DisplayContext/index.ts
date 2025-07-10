import { createContext } from 'react'
import { DisplayContextType } from '@types/DisplayContextType'

export const DisplayContext = createContext<DisplayContextType | undefined>(
  undefined
)
