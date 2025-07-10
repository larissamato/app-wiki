import { useEffect } from 'react'
import { ISocket } from '@/types/ISocket'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { UserContext } from '@contexts/UserContext'
import { useGenericContext } from './useGenericContext'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'

const API_WS = import.meta.env.VITE_API_WS
  ? import.meta.env.VITE_API_WS
  : 'dev-api-ws.opendata.center'
const API_WS_PORT = import.meta.env.VITE_API_WS_PORT
  ? import.meta.env.VITE_API_WS_PORT
  : '443'
const API_ID = import.meta.env.VITE_API_ID
  ? import.meta.env.VITE_API_ID
  : 'test-id'
const API_KEY = import.meta.env.VITE_API_KEY
  ? import.meta.env.VITE_API_KEY
  : 'test-key'
const API_SECRET = import.meta.env.VITE_API_SECRET
  ? import.meta.env.VITE_API_SECRET
  : 'test-secret'

const API_WS_KEYS = {
  cluster: 'mt1',
  app: API_ID,
  secret: API_SECRET,
  wsHost: API_WS,
  wsPort: 6001,
  wssPort: API_WS_PORT,
  forceTLS: !(API_WS !== 'localhost' || API_WS !== 'core-soketi'),
  encrypted: true,
  disablestats: true,
  enabledtransports: ['ws', 'wss']
}

const pusher = new Pusher(API_KEY, API_WS_KEYS)
const echo = new Echo({ broadcaster: 'pusher', client: pusher })

const useSocket = (
  func: (params?: any) => void,
  nameEvent = 'NotificationCreated',
  nameChannel?: string
) => {
  const { user } = useGenericContext(UserContext)
  const { t } = useTranslation()
  useEffect(() => {
    const channel = user
      ? echo.channel(`${nameChannel || `notifications.${user?.uuid}`}`)
      : null
    channel?.on(`${nameEvent}`, (response: ISocket) => {
      func(response)
      //  handleCall(soc, func, response) @Deprecating this function
    })

    return () => {
      if (channel?.subscription.subscribed && user) {
        channel?.subscription.unsubscribe()
        // channel.subscription.pusher.connection.unbind(nameEvent, handleCall) DONT WORKS
      }
    }
  }, [])
}

export default useSocket
