import { IArticleCategory } from '@/types/IArticle'

export const checkCategories = (
  categories: Array<IArticleCategory>,
  items: Array<IArticleCategory> = []
): Array<IArticleCategory> => {
  if (categories.length) {
    categories.map((e: IArticleCategory) => {
      items.push(e)
      if (e.parent) {
        checkCategories([e.parent], items)
      }
    })
  }
  return items
}
