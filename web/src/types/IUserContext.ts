import { Dispatch, SetStateAction } from 'react'
import { IUser } from '@types/IUser'

export interface IUserContext {
  user: IUser | undefined
  setUser: Dispatch<SetStateAction<IUser | undefined>>
  islogged: boolean
  setIsLogged: Dispatch<SetStateAction<boolean>>
  isThemeDark: boolean
  setIsThemeDark: Dispatch<SetStateAction<boolean>>
}
