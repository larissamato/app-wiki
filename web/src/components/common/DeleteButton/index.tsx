import IconButton from '@components/common/IconButton'
import { MessageContext } from '@contexts/MessageContext'
import { api } from '@helpers/api'
import { handleError } from '@helpers/handleError'
import { useGenericContext } from '@hooks/useGenericContext'
import useTableContext from '@hooks/useTableContext'
import { Popconfirm } from 'antd'
import { useTranslation } from 'react-i18next'

interface ButtonProps {
  url: string
  uuid: string
  name: string
}
const DeleteButton = ({ url, uuid, name }: ButtonProps) => {
  const messageApi = useGenericContext(MessageContext)
  const { remove } = useTableContext()
  const { t } = useTranslation()
  const onConfirm = () => {
    api
      .delete(url)
      .then(() => remove(uuid))
      .catch(err => handleError(err, messageApi, t('DELETERERROR')))
  }
  return (
    <Popconfirm title={`${t('DELETE')} ${name}?`} onConfirm={onConfirm}>
      <IconButton
        danger
        name="fa-light fa-trash"
        color="white"
        data-cy="delete-item"
      />
    </Popconfirm>
  )
}

export default DeleteButton
