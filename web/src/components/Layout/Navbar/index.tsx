import { Dispatch, SetStateAction, ReactNode } from 'react'
import { api } from '@helpers/api'
import useWindowResize from '@hooks/useWindowResize'
import { useTheme } from 'styled-components'
import { Layout } from 'antd'
import useFetch from '@hooks/useFetch'
import AsideMenu from '@components/Layout/AsideMenu'
import { IMenu } from '@/types/IMenu'
import { useNavigate } from 'react-router-dom'
const { Sider } = Layout

interface MenuPropsResponse {
  status: number
  data: {
    data: IMenu[]
  }
}

interface NavbarProps {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

interface AsideProps {
  collapsed: boolean
  children: ReactNode
}

const queryMenu = async () => {
  return await api.get('/session/menu').then((response: MenuPropsResponse) => {
    localStorage.setItem('tabs', JSON.stringify(response.data?.data))
    return response
  })
}

const Aside = ({ collapsed, children }: AsideProps) => {
  const theme = useTheme()
  const { width } = useWindowResize()
  return (
    <Sider
      data-cy={`aside-menu-collapsed-${collapsed}`}
      width={width < 720 ? '100vw' : '200px'}
      theme="dark"
      style={{
        position: 'fixed',
        height: '100%',
        zIndex: 100,
        backgroundColor: theme.menu
      }}
      collapsedWidth={width < 720 ? 0 : 80}
      collapsed={collapsed}
    >
      {children}
    </Sider>
  )
}

const Navbar = ({ collapsed, setCollapsed }: NavbarProps) => {
  const navigate = useNavigate()
  const { data, isSuccess } = useFetch<any, null>({
    func: queryMenu
  })

  const logout = () => {
    navigate('/logout')
  }

  if (isSuccess) {
    return (
      <Aside collapsed={collapsed}>
        <AsideMenu
          data={data.data}
          logout={logout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </Aside>
    )
  }
}

export default Navbar
