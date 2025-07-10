import { IUser } from '@/types/IUser'
export interface IRating {
  uuid: string
  rate: number | null
  comment: string | null
  user: IUser
}
