import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import {
  CloseOutlined,
  TeamOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useWindowResize from '@hooks/useWindowResize'
import type { MenuProps } from 'antd'
import { IMenu } from '@/types/IMenu'
import { Menu, Button } from 'antd'
import { translateMenu } from '@helpers/translateMenu'
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

interface AsideMenuProps {
  data: IMenu[]
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

const Icons = {
  Artigos: <FolderOpenOutlined style={{ color: '#fff', fontSize: 20 }} />,
  Usuários: <TeamOutlined style={{ color: '#fff', fontSize: 20 }} />,
}

const handleMenuResponse = (data: IMenu[]) => {
  return data.map(item => {
    const subMenuItems = handleSubMenuResponse(item)
    const listItem = getItem(
      item.name,
      subMenuItems.length > 0 ? item.name : item.link,
      Icons[item.name as keyof typeof Icons],
      subMenuItems.length > 0 ? [...subMenuItems] : undefined
    )
    return listItem
  })
}

const handleSubMenuResponse = (item: IMenu) => {
  const subMenuItems = item.children.map(child =>
    getItem(child.name, child.link, Icons[child.name as keyof typeof Icons])
  )
  if (subMenuItems.length > 0) {
    subMenuItems.unshift(
      getItem('Listar', item.link, Icons['Listar' as keyof typeof Icons])
    )
  }
  return subMenuItems
}

const AsideHead = ({ setCollapsed }: Pick<AsideMenuProps, 'setCollapsed'>) => {
  const { width } = useWindowResize()
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img alt='logo-open' src="/assets/images/logo.png" style={{ width: 70 }} />
      {width < 720 ? (
        <Button
          data-cy="aside-button-mobile-close"
          style={{ position: 'absolute', right: 10, top: 10 }}
          type="text"
          icon={<CloseOutlined style={{ color: 'white' }} size={20} />}
          onClick={() => setCollapsed(true)}
        />
      ) : null}
    </div>
  )
}

const AsideMenu = ({
  data,
  collapsed,
  setCollapsed,
}: AsideMenuProps) => {
  const { width } = useWindowResize()
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const items = translateMenu(handleMenuResponse(data), t)

  const [openKeys, setOpenKeys] = useState<string[]>([])

  const levelKeys = useMemo(() => {
    const key: Record<string, number> = {}

    const getLevelKeys = (items: MenuItem[], level = 1) => {
      items.forEach(item => {
        if (item?.key && typeof item.key === 'string') {
          key[item.key] = level
        }
        if (item?.children) {
          getLevelKeys(item.children as MenuItem[], level + 1)
        }
      })
    }

    getLevelKeys(items as MenuItem[])
    return key
  }, [items])

  const onOpenChange: MenuProps['onOpenChange'] = openKeysNew => {
    const latestOpenKey = openKeysNew.find(key => openKeys.indexOf(key) === -1)

    if (latestOpenKey) {
      const sameLevelKey = openKeysNew
        .filter(key => key !== latestOpenKey)
        .find(key => levelKeys[key] === levelKeys[latestOpenKey])

      setOpenKeys(
        openKeysNew
          .filter(key => key !== sameLevelKey)
          .filter(key => levelKeys[key] <= levelKeys[latestOpenKey])
      )
    } else {
      setOpenKeys(openKeysNew)
    }
  }

  const navigateItems = (e: { key: string }) => {
    navigate(e.key)
    if (width < 720) setCollapsed(true)
  }

  return (
    <>
      <AsideHead setCollapsed={setCollapsed} />
      <Menu
        theme="dark"
        mode="inline"
        style={{
          backgroundColor: theme.menu,
          color: theme.white
        }}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        onClick={navigateItems}
        data-cy="aside-menu-list"
      />
    </>
  )
}


export default AsideMenu
