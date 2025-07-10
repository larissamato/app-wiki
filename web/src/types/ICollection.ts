export interface ILinks {
  url: string | null
  label: string
  active: boolean
}

export interface IRequest<T> {
  status: number
  data: IRequestList<T>
}

export type IRequestList<T> = {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: ILinks[]
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface IRequestItem<T> {
  status: number
  data: T
}
