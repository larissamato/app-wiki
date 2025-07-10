import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Navbar from '@components/Layout/Navbar'
import useWindowResize from '@hooks/useWindowResize'
import Header from '@components/Layout/Header'
import { useTheme } from 'styled-components'
import MessageProvider from '@contexts/MessageContext'

const { Content } = Layout
const Default = () => {
  const { width } = useWindowResize()
  const [collapsed, setCollapsed] = useState(false)
  const theme = useTheme()
  const marginValue = collapsed ? 80 : 200

  useEffect(() => {
    if (width < 720) {
      setCollapsed(true)
    }
  }, [])

  return (
    <MessageProvider>
      <Layout
        style={{ backgroundColor: theme.background, minHeight: '100vh' }}
      >
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          style={{ padding: '16px', backgroundColor: theme.background }}
        >
          <Content
            style={{
              backgroundColor: theme.background,
              marginLeft: width > 720 ? marginValue : 0
            }}
          >
            <Header
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              width={width}
            />
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </MessageProvider>
  )
}

export default Default
