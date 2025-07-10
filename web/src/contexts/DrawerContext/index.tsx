import { useGenericContext } from '@hooks/useGenericContext'
import useModal from '@hooks/useModal'
import useWindowResize from '@hooks/useWindowResize'
import { Drawer } from 'antd'
import {
  ComponentType,
  PropsWithChildren,
  createContext,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'styled-components'

export const DrawerContext = createContext<DrawerProviderType | undefined>(
  undefined
)

export const useDrawerContext = (url: string, data: any) => {
  const { openDrawer } = useGenericContext(DrawerContext)
  const { width } = useWindowResize()
  const navigate = useNavigate()
  const open = () => {
    width > 720 ? openDrawer(data) : navigate(url, { state: data })
  }

  return { open }
}

export interface DrawerProviderType {
  open: boolean
  onClose: () => void
  openDrawer: (data: any) => void
}

interface DrawerProviderProps extends PropsWithChildren {
  component: ComponentType<{ data: any }>
  head: ComponentType<{ data: any }>
}

const DrawerProvider = ({
  children,
  component,
  head,
  ...props
}: DrawerProviderProps) => {
  const Tag = component
  const Item = head
  const theme = useTheme()
  const { open, onClose, onOpen } = useModal()
  const [data, setData] = useState<any | undefined>(undefined)
  const openDrawer = (ticket: any) => {
    setData(ticket)
    onOpen()
  }
  return (
    <DrawerContext.Provider value={{ open, onClose, openDrawer }}>
      <Drawer
        title={<Item data={data} />}
        styles={{
          content: { backgroundColor: theme.background },
          header: {
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: theme.background
          }
        }}
        destroyOnHidden
        width={'90vw'}
        {...props}
        {...{ ...{ open, onClose, onOpen } }}
      >
        <Tag data={data} />
      </Drawer>
      {children}
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
