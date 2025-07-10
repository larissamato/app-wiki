export type SearchParams = {
  setItem: (name: string, value: string) => void
  getItem: (name: string) => string | undefined
  removeItem: (name: string) => void
  toogleItem: (name: string, value: string) => void
}
