import { Dispatch, SetStateAction, createContext } from 'react'
import { IArticle } from '@/types/IArticle'

interface ArticleContextType {
  data: IArticle
  setData: Dispatch<SetStateAction<IArticle>>
}

export const ArticleContext = createContext<ArticleContextType | undefined>(
  undefined
)
