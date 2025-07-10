import { Avatar } from 'antd'
import { IUser } from '@/types/IUser'
import Sprite from '../Sprite'

interface PropsUser {
  user: IUser
}
const AvatarSprite = ({ user }: PropsUser) => {
  return (
    <>
      <span style={{ margin: '10px' }}>{user.name}</span>
      {user.level !== 1 && user.sprite ? (
        <Avatar src={<Sprite x={user.sprite.x} />} />
      ) : null}
    </>
  )
}

export default AvatarSprite
