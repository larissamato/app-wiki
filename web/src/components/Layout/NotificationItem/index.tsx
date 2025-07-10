import Icon from '@components/common/Icon'
import { api } from '@helpers/api'
import { useGenericContext } from '@hooks/useGenericContext'
import { INotification } from '@/types/INotification'
import { ISUser } from '@/types/IUser'
import { Space, Button, Typography, Avatar, List } from 'antd'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { NotificationContext } from '@contexts/NotificationContext'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Sprite from '@components/common/Sprite'
import useWindowResize from '@hooks/useWindowResize'
import { ModalContext } from '@contexts/ModalContext'
dayjs.extend(relativeTime)

const Text = Typography.Text
const markReadNotification = async (uuid: string) => {
  return await api.post(`/notification/${uuid}/markRead`)
}
interface NotificationItemProps {
  notification: INotification
}
const deleteNotification = async (
  uuid: string,
  data: INotification[],
  setData: Dispatch<SetStateAction<INotification[]>>,
  setCount: Dispatch<SetStateAction<number>>
) => {
  const newArr = data.filter((e: INotification) => e.uuid !== uuid)
  return await markReadNotification(uuid).then(() => {
    setData(newArr)
    setCount(count => count - 1)
  })
}

const useNotificationsActions = (notification: INotification) => {
  const { data, setData, setCount } = useGenericContext(NotificationContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { width } = useWindowResize()
  const { onClose } = useContext(ModalContext)

  const onDelete = async () => {
    setLoading(true)
    await deleteNotification(
      notification.uuid,
      data,
      setData,
      setCount
    ).finally(() => setLoading(false))
  }
  const onOpen = () => {
    navigate(`${notification.actions?.open}`)
    width < 720 && onClose()
  }
  return { onDelete, loading, onOpen }
}
const NotificationActions = ({ notification }: NotificationItemProps) => {
  const { t } = useTranslation()
  const { onDelete, onOpen, loading } = useNotificationsActions(notification)
  return (
    <Space>
      <Button
        type="default"
        icon={<Icon name="fa-light fa-ticket" />}
        onClick={onOpen}
      >
        <Text>{t('ACCESS')}</Text>
      </Button>
      <Button
        disabled={loading}
        danger
        loading={loading}
        onClick={onDelete}
        type="default"
        icon={<Icon name="fa-light fa-trash" color="danger" />}
      >
        <Text type="danger">{t('DELETENOTIFICATION')}</Text>
      </Button>
    </Space>
  )
}

const NotificationItemAvatar = ({ createdby }: { createdby: ISUser }) => {
  return (
    <Avatar
      src={createdby.sprite ? <Sprite x={createdby.sprite.x} /> : undefined}
      style={{ background: '#2277ae' }}
    >
      {!createdby?.sprite ? <span>{createdby?.name.charAt(0)}</span> : null}
    </Avatar>
  )
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <List.Item actions={[<NotificationActions notification={notification} />]}>
      <List.Item.Meta
        avatar={
          notification.created_by || notification.updated_by ? (
            <NotificationItemAvatar
              {...{
                createdby: notification.created_by || notification.updated_by
              }}
            />
          ) : null
        }
        title={<Link to={notification.actions.open}>{notification.title}</Link>}
        description={
          <Text style={{ position: 'relative', top: '-12px' }}>
            {dayjs(notification['updated_at' ?? 'created_at']).fromNow()}
            {notification.created_by
              ? ` • ${notification.created_by?.name}`
              : null}
          </Text>
        }
      />
      <Text>{notification.summary}</Text>
    </List.Item>
  )
}

export default NotificationItem
