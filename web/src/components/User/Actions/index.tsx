import { useTheme } from 'styled-components'
import { TFunction } from 'i18next'
import { Space, message, ButtonProps, Modal, Descriptions } from 'antd'
import Button from '@components/common/Button'
import ModalUser from '@components/User/Modal'
import { api } from '@helpers/api'
import { useTranslation } from 'react-i18next'
import { HookAPI } from 'antd/es/modal/useModal'
import Icon from '@common/Icon'
import { ISUser } from '@/types/IUser'
import { MessageContext } from '@contexts/MessageContext'
import { handleError } from '@helpers/handleError'
import { useGenericContext } from '@hooks/useGenericContext'

interface DeleteUserButtonProps extends ButtonProps {
  data: ISUser
}

const deleteUserDescriptionsArr = ['name', 'email', 'level']

const useConfirmDeleteUser = ({
  modal,
  t,
  data
}: {
  modal: HookAPI
  t: TFunction
  data: ISUser
}) => {
  const messageApi = useGenericContext(MessageContext)
  const deleteUser = async () =>
    modal.confirm({
      title: t('AREYOUSUREDELETEUSER'),
      cancelText: t('CANCEL'),
      content: (
        <Descriptions>
          {deleteUserDescriptionsArr.map(item => (
            <Descriptions.Item
              key={item}
              span={3}
              label={t(item.toUpperCase())}
            >
              {data[item as data]}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ),
      async onOk() {
        return await api
          .delete(`user/${data.uuid}`)
          .then(e =>
            message.success(`${t('SUCESSDELETEUSER')} ${data.name}`, 2)
          )
          .catch(e => handleError(e, messageApi, `${t('ERRORDELETEUSER')} ${data.name}`))
      },
      onCancel() { }
    })
  return { deleteUser }
}

const DeleteUserButton = ({ data, ...props }: DeleteUserButtonProps) => {
  const [modal, contextHolder] = Modal.useModal()
  const { t } = useTranslation()
  const { deleteUser } = useConfirmDeleteUser({ modal, t, data })

  return (
    <>
      {contextHolder}
      <Button onClick={deleteUser} {...props} id="deleteUser" />
    </>
  )
}

const EditUser = ({ data }: { data: ISUser }) => {
  return (
    <ModalUser
      action="edit"
      icon={<Icon name="fa-light fa-edit" color="white" />}
      data={data}
      id="edituser"
      type="primary"
    />
  )
}

export const Actions = ({ data }: { data: ISUser }) => {
  return (
    <Space>
      <EditUser data={data} />
      <DeleteUserButton
        data={data}
        danger
        icon={<Icon name="fa-light fa-trash" color="white" />}
      />
    </Space>
  )
}

const useInactiveUserActions = (data: ISUser) => {
  const [modal, contextHolder] = Modal.useModal()
  const { t } = useTranslation()
  const onRestoreUser = () => {
    modal.confirm({
      title: t('RESTOREUSER'),
      content: t('AREYOUSURERESTOREUSER'),
      onOk: async () => await api.post(`/user/${data.uuid}/restore`)
    })
  }
  return { onRestoreUser, contextHolder }
}

export const InactiveUserActions = ({ data }: { data: ISUser }) => {
  const { onRestoreUser, contextHolder } = useInactiveUserActions(data)
  const theme = useTheme()
  return (
    <Space>
      {contextHolder}
      <EditUser data={data} />
      <Button
        onClick={onRestoreUser}
        icon={<Icon name="fa-light fa-recycle" color="white" />}
        style={{ backgroundColor: theme.green }}
      />
    </Space>
  )
}
