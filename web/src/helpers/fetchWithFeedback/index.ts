import { MessageInstance } from 'antd/es/message/interface'
import { message } from 'antd'
import {
  enableExitConfirmation,
  disableExitConfirmation
} from '@helpers/exitConfirmation'
import { AxiosResponse } from 'axios'
import { TFunction } from 'i18next'

export const fetchWithFeedback = async (
  messageApi: MessageInstance,
  close: () => void,
  func: Promise<AxiosResponse<any, any>>,
  t: TFunction
) => {
  enableExitConfirmation()
  message.loading(t('LOADINGREQUEST'), 1)
  return await func
    .then(async response => {
      messageApi.success(t('SUCCESSREQUEST'), 1)
      close()
      return response
    })
    .catch(response => {
      messageApi.error(
        `${t('ERRORREQUEST')}: ${response.response.data.message}`,
        5
      )
      return null
    })
    .finally(() => disableExitConfirmation())
}
