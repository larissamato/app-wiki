import { useTheme } from 'styled-components'
import { Avatar as AntAvatar, AvatarProps } from 'antd'
import { IUser } from '@/types/IUser'

interface CustomAvatarProps extends AvatarProps {
  sprite: IUser['sprite']
  is_private: boolean
  level: IUser['level']
}
const SupportAvatar = ({
  sprite,
  is_private,
  level,
  ...props
}: CustomAvatarProps) => {
  const src = sprite !== null ? localStorage.getItem('sprite') : null
  const theme = useTheme()

  return (
    <AntAvatar
      style={{
        backgroundColor:
          (is_private && theme.yellowDark) || (level !== 1 && theme.blueDark)
      }}
      src={
        sprite && (
          <img
            src={`data:image/png;base64,${src}`}
            style={{
              objectPosition: `-${sprite?.x / 4.267}px`
            }}
          />
        )
      }
      {...props}
    />
  )
}

export default SupportAvatar
