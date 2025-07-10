import { useState, Dispatch, SetStateAction, PropsWithChildren } from 'react'
import { Drawer, Row, Badge, List, Space } from 'antd'
import Icon from '@common/Icon'
import Button from '@common/Button'
import { useTranslation } from 'react-i18next'
import { api } from '@helpers/api'
import {
  INotification,
  IFilter
} from '@/types/INotification'
import { ClockCircleOutlined } from '@ant-design/icons'
import useModal from '@hooks/useModal'
import NotificationsProvider, {
  NotificationContext
} from '@contexts/NotificationContext'
import { useGenericContext } from '@hooks/useGenericContext'
import { ModalContext } from '@contexts/ModalContext'
import NotificationItem from '../NotificationItem'
import { ModalContextType } from '@/types/ModalContextType'

const queryNotification = async (page = 1) => {
  return await api
    .get(`/notification?page=${page}`)
    .then((response: any) => response.data)
}

const markAllReadNotification = async () => {
  return await api.post('/notification/markAllRead')
}

const deleteAllNotifications = async (
  setData: Dispatch<SetStateAction<INotification[] | undefined>>,
  setCount: Dispatch<SetStateAction<number>>
) => {
  await markAllReadNotification().then(() => {
    setData([]), setCount(0)
  })
}

const Counter = ({ children }: PropsWithChildren) => {
  const { count } = useGenericContext(NotificationContext)
  return <Badge count={count}>{children}</Badge>
}

const DrawerDeleteButton = () => {
  const [loading, setLoading] = useState(false)
  const { setData, setCount } = useGenericContext(NotificationContext)
  const onDelete = async () => {
    setLoading(true)
    await deleteAllNotifications(setData, setCount).finally(() =>
      setLoading(false)
    )
  }
  return (
    <Button
      loading={loading}
      disabled={loading}
      onClick={onDelete}
      type="link"
      icon={
        <Icon
          name={!loading ? 'fa-light fa-trash-list' : 'fas fa-spinner fa-spin'}
        />
      }
    />
  )
}

const useLoadMore = () => {
  const { data, setData, page, setPage } =
    useGenericContext(NotificationContext)
  const [loading, setLoading] = useState(false)

  const onLoadMore = async () => {
    setLoading(true)
    await queryNotification(page + 1)
      .then(e => {
        e.data.length && setPage(prevPage => prevPage + 1)
        setData(prevData => {
          if (prevData !== undefined) return [...prevData, ...e.data]
          return e.data
        })
      })
      .finally(() => setLoading(false))
  }
  return { data, loading, onLoadMore }
}

const LoadMore = () => {
  const { t } = useTranslation()
  const { data, loading, onLoadMore } = useLoadMore()
  return (
    <Row style={{ justifyContent: 'center', marginTop: 10 }}>
      {data && data?.length > 0 ? (
        <Button loading={loading} onClick={onLoadMore}>
          {t('LOADMORE')}
        </Button>
      ) : null}
    </Row>
  )
}

const filterItems = (
  filter: IFilter,
  data: Array<INotification> | undefined
) => {
  if (!filter || !data) return data
  return data.filter(
    (notification: INotification) =>
      notification.service_table === filter.service_table &&
      notification[filter.key] === filter.value
  )
}

const NotificationsList = () => {
  const { loading, data, filter } = useGenericContext(NotificationContext)
  return (
    <List
      itemLayout="vertical"
      loading={loading}
      loadMore={<LoadMore />}
      dataSource={filterItems(filter, data)}
      renderItem={item => <NotificationItem notification={item} />}
    />
  )
}

const NotificationDrawer = () => {
  const { t } = useTranslation()
  const { onClose, open } = useGenericContext<ModalContextType>(ModalContext)
  return (
    <Drawer
      destroyOnHidden
      title={t('YOURNOTIFICATIONS')}
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <DrawerDeleteButton />
        </Space>
      }
    >
      <NotificationsList />
    </Drawer>
  )
}

const useNotificationContent = () => {
  const { setData, setCount, setLoading, loading } =
    useGenericContext(NotificationContext)
  const { onOpen } = useGenericContext(ModalContext)

  const handleDrawer = async () => {
    setLoading(true)
    await queryNotification()
      .then(e => {
        setCount(e.meta.total)
        setData(e.data)
      })
      .finally(() => {
        setLoading(false)
        onOpen()
      })
  }
  return { handleDrawer, loading }
}

const NotificationsContent = () => {
  const { handleDrawer, loading } = useNotificationContent()
  return (
    <>
      <NotificationDrawer />
      <Button
        onClick={handleDrawer}
        type="link"
        icon={
          loading ? (
            <ClockCircleOutlined style={{ color: '#f5222d' }} />
          ) : (
            <Icon color="gray" name="fa-light fa-bell" size="30px" />
          )
        }
      />
    </>
  )
}

const Notifications = () => {
  const { open, onClose, onOpen } = useModal()
  return (
    <NotificationsProvider>
      <ModalContext.Provider value={{ open, onClose, onOpen }}>
        <Counter>
          <NotificationsContent />
        </Counter>
      </ModalContext.Provider>
    </NotificationsProvider>
  )
}

export default Notifications
