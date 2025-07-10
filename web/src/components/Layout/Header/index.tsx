import { Dispatch, SetStateAction } from 'react'
import { Container, ActionsGroup, ActionButton as SActionButton } from './style'
import { Button, Avatar } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Icon from '@common/Icon'
import { useTranslation } from 'react-i18next'
import useWindowResize from '@hooks/useWindowResize'
import { useUser } from '@contexts/UserContext'
import useModal from '@hooks/useModal'
import { IUser } from '@/types/IUser'
import Settings from '@components/Layout/Settings'
import { api } from '@helpers/api'
import { ModalContext } from '@contexts/ModalContext'

interface ActionButtonProps {
  action: () => void
  icon: string
  name?: string
  util: string
}

interface HeaderProps {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
  width: number
}

const ActionButton = ({ action, icon, util }: ActionButtonProps) => (
  <SActionButton onClick={action} data-cy={`actions-${util}`}>
    <Icon color="gray" name={`fa-light ${icon}`} size="30px" />
  </SActionButton>
)

const CollapseButton = ({ collapsed, setCollapsed, width }: HeaderProps) => (
  <Button
    data-cy="header-collapse-button"
    type="text"
    style={
      width < 720 ? { position: 'absolute', left: 20, top: 25 } : undefined
    }
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={() => setCollapsed(!collapsed)}
  />
)

const putTheme = (theme: string) => {
  api.put('/session/user/theme', { theme })
  localStorage.setItem('theme', theme)
}

const SettingsButton = ({ user }: { user: IUser }) => {
  const { width } = useWindowResize()
  const { open, onCancel, onOpen, onClose } = useModal()
  return (
    <ModalContext.Provider value={{ onOpen, onCancel, open, onClose }}>
      <SActionButton data-cy="actions-config" onClick={onOpen}>
        {width > 720 ? user.name : ''}
        {user.avatar ? (
          <Avatar
            style={{
              backgroundColor: '#2277ae',
              width: '30px',
              height: '30px'
            }}
            src={<img src={`data:image/png;base64,${user.avatar}`} />}
          />
        ) : (
          <Icon color="gray" name="fa-light fa-gear" size="30px" />
        )}
      </SActionButton>
      <Settings open={open} onCancel={onCancel} />
    </ModalContext.Provider>
  )
}
const LogoutButton = () => {
  const { width } = useWindowResize()
  const { t } = useTranslation()

  return (
    <a href="/logout">
      <SActionButton>
        <Icon
          color="gray"
          name="fa-light fa-arrow-right-from-bracket"
          data-cy="actions-logout"
          size="30px"
        />
        {width > 720 ? t('LOGOUT') : ''}
      </SActionButton>
    </a>
  )
}

const useHeader = () => {
  const { isThemeDark, setIsThemeDark, user, setIsLogged } = useUser()
  const changeTheme = () => {
    setIsThemeDark(!isThemeDark)
    if (!isThemeDark) {
      putTheme('dark')
      return
    }
    putTheme('default')
  }

  const arr = [
    {
      action: changeTheme,
      icon: ` fa-lightbulb${!isThemeDark ? '-on' : ''} `,
      util: 'switch'
    }
  ]
  return { arr, user, setIsLogged }
}
const Header = ({ setCollapsed, collapsed, width }: HeaderProps) => {
  const { arr, user } = useHeader()
  return (
    <Container>
      <CollapseButton
        setCollapsed={setCollapsed}
        collapsed={collapsed}
        width={width}
      />
      <ActionsGroup>
        {arr.map((e, index) => (
          <ActionButton
            key={`${e.util}_${index}`}
            util={e.util}
            action={e.action}
            icon={e.icon}
          />
        ))}
        <SettingsButton user={user} />
        <LogoutButton />
      </ActionsGroup>
    </Container>
  )
}

export default Header
