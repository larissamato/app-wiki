import { useState, Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { message } from 'antd'
import { api } from '@helpers/api'
import { fetchWithFeedback } from '@helpers/fetchWithFeedback'

type SetState<T> = Dispatch<SetStateAction<T>>

const handleRequest = async (
  request: Promise<any>,
  setDisabled: SetState<boolean>,
  setResponseData: SetState<any>
) => {
  try {
    const response = await request
    if (response?.status === 200) {
      setResponseData(response.data || { success: true })
    }
  } finally {
    setDisabled(false)
  }
}

const useForm = (
  action: 'edit' | 'create' | 'show' | 'change',
  close: () => void,
  url: string,
  uuid?: string
) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [disabled, setDisabled] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)
  const { t } = useTranslation()

  const onFinish = async (newObject: any) => {
    setDisabled(true)

    const requestUrl = action === 'edit' && uuid ? `${url}/${uuid}` : url
    const apiCall =
      action === 'edit'
        ? api.put(requestUrl, newObject)
        : api.post(requestUrl, newObject)

    await handleRequest(
      fetchWithFeedback(messageApi, close, apiCall, t),
      setDisabled,
      setResponseData
    )
  }

  return { onFinish, disabled, contextHolder, responseData }
}

export default useForm
