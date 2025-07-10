import { ISector } from '@types/ISector'
import { ICompany } from './ICompany'

export interface IUser {
  uuid: string
  name: string
  sprite: { x: number; y: number } | null
  level: number
  avatar: string
  email: string
  companies: Array<ICompany>
  devices: []
  created_at: string
  created_by: { uuid: string }
  updated_at: string
  updated_by: string
  roles: string[]
  phones: string[]
  tags: string[]
  entity:
    | {
        uuid: string
        name: string
        alias: string
      }
    | string
  can_receive_emails?: boolean
  birthday: string
  user_in_charge: boolean | null
  signer: boolean
  docnum: string | null
}

export interface ISUser extends IUser {
  tickets_open_count: number
  sectors: [
    sector: {
      sector: ISector
    }
  ]
  hasDevices: boolean | null
}

export interface IUserCreateOrUpdate {
  entity: string
  name: string
  email: string
  password: string
  password_confirmation: string
  can_receive_emails?: boolean
  roles?: string[] | null
}

export interface User {
  uuid: string
  name: string
  email: string
  level: number
  roles: string[]
  preferences: {
    theme: string
  }
  phones: string[]
  sprite: { x: number; y: number } | null
  demo: boolean
  birthday: string | null
  authcode_at: string | null
  cs_contact_preference: string | null
  sectors: ISector[]
}

