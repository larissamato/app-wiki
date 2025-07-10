export interface IMenu {
  icon: string
  link: string
  name: string
  children: [
    {
      name: string
      link: string
      icon: string
    }
  ]
}
