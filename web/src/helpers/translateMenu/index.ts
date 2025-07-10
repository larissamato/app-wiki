import { TFunction } from 'i18next'

interface IMenu {
  key: string
  label: string
  children?: IMenu[]
}

export const translateMenu = (menu: IMenu[], t: TFunction) => {
  const translateLabels = (items: IMenu[]) => {
    return items.map(item => {
      const newItem = { ...item, label: t(item.label) }
      if (item.children) {
        newItem.children = translateLabels(item.children)
      }
      return newItem
    })
  }

  return translateLabels(menu)
}
