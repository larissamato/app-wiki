import { IUser } from './IUser'

export interface IArticleVote {
  updated_at: string
  created_at: string
  vote: boolean
  id: number
}

export interface IArticle {
  name: string
  slug: string
  content: string
  user_vote: Array<IArticleVote> | []
  is_private: boolean
  categories: Array<IArticleCategory>
  save: boolean
  votes?: number
  votes_count?: number
  created_by: IUser
  created_at: string
  updated_at: string | null
}

export interface IArticleCategory {
  name: string
  slug: string
  parent: IArticleCategory | null
}

export interface IArticleSave {
  created_at: string
  article: IArticle
}
