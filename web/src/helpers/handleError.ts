import { MessageInstance } from 'antd/es/message/interface'
import { AxiosError, isAxiosError } from 'axios'

export const handleError = (
  data: AxiosError,
  messageApi: MessageInstance | undefined,
  headerMessage?: string | undefined,
  unexpectedErrorMessage?: string
) => {
  const errorChannel = (message: string) => sendError(message, messageApi)
  if (isAxiosError(data)) {
    if (data.response?.status === 422) {
      const message = `${headerMessage ? headerMessage + ': ' : ''} ${data.response?.data?.message
        }`
      errorChannel(message)
    } else {
      const message = `${headerMessage ?? 'Erro inesperado'}`

      errorChannel(message)
    }
    return
  }
  errorChannel(unexpectedErrorMessage ?? 'Erro inesperado')
}

const sendError = (
  message: string,
  messageApi: MessageInstance | undefined
) => {
  messageApi ? messageApi.error(message) : console.error(message)
}
