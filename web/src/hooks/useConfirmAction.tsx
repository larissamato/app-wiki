import { HookAPI } from "antd/es/modal/useModal"
import { AxiosResponse } from "axios"
import { DescriptionsProps, message, Descriptions } from "antd"
import { useTranslation } from "react-i18next"
import { MessageContext } from '@contexts/MessageContext'
import { handleError } from '@helpers/handleError'
import { useGenericContext } from '@hooks/useGenericContext'

interface useConfirmActionProps {
  modal: HookAPI,
  func: () => Promise<AxiosResponse>,
  descriptions: DescriptionsProps['items']
  messages: {
    name?: string
    title?: string,
    onSucess: string,
    onError: string,
  }
}

const useConfirmAction = ({ modal, func, descriptions, messages }: useConfirmActionProps) => {
  const messageApi = useGenericContext(MessageContext)
  const { t } = useTranslation()

  const confirm = async () => modal.confirm({
    title: t(messages?.title || 'AREYOUSURE?'),
    cancelText: t('CANCEL'),
    content: (<Descriptions items={descriptions} />),

    async onOk() {
      return await func()
        .then(() => message.success(`${t(messages?.onSucess)}: ${messages?.name}`, 2))
        .catch(e => handleError(e, messageApi, `${t(messages?.onError)} ${messages?.name}`))
    },
    onCancel() { }
  })
  return { confirm }
}

export default useConfirmAction
