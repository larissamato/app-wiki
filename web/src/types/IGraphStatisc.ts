export interface IGraph {
  key: number
  label: string
  color: string
  icon: React.ReactNode
}

export interface IGraphStatiscUrl extends IGraph {
  url: string
}

export interface IGraphStatiscCount {
  key: number
  count: number
}
