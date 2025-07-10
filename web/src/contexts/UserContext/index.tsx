import { createContext, useState, Dispatch, SetStateAction } from 'react'
import { ISUser } from '@/types/IUser'
import { useGenericContext } from '@hooks/useGenericContext'
import RouterContext from '@contexts/RouterContext'
import StyleContext from '@contexts/StyleContext'

export interface UserContextType {
  user: ISUser
  setUser: Dispatch<SetStateAction<ISUser | undefined>>
  islogged: boolean | undefined
  setIsLogged: Dispatch<SetStateAction<boolean | undefined>>
  isThemeDark: boolean
  setIsThemeDark: Dispatch<SetStateAction<boolean>>
  perPage: number
  setPerPage: Dispatch<SetStateAction<number>>
  cookie: boolean,
  setCookie: Dispatch<SetStateAction<boolean>>
}

const getTheme = () => {
  const theme = localStorage.getItem('theme')
  return theme === 'dark'
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
const useUserProvider = () => {
  const [user, setUser] = useState<ISUser>()
  const [islogged, setIsLogged] = useState<undefined | boolean>(undefined)
  const [isThemeDark, setIsThemeDark] = useState(getTheme())
  const [perPage, setPerPage] = useState<number>(() => {
    let localPagination = window.localStorage.getItem('perPage')
    if (localPagination) {
      return Number(localPagination)
    }
    return 5
  })

  return {
    user,
    setUser,
    islogged,
    setIsLogged,
    isThemeDark,
    setIsThemeDark,
    perPage,
    setPerPage,
  }
}

const UserProvider = () => {
  const data = useUserProvider()
  return (
    <UserContext.Provider value={data}>
      <StyleContext isThemeDark={data.isThemeDark}>
        <RouterContext />
      </StyleContext>
    </UserContext.Provider>
  )
}

export const useUser = () => useGenericContext<UserContextType>(UserContext)

export default UserProvider
