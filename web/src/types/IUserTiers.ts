import { ISUser } from './IUser'

export type ITargetTier = {
  slug: string
  name: string
  labels: Array<string>
}
export interface IUserTiers {
  slug: string
  uuid: string
  name: string
  labels: Array<string>
  targets: Array<ITargetTier>
  users: Array<ISUser>
}
