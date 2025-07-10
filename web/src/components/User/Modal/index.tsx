import { Button, ButtonProps } from 'antd'
import { ISUser } from '@/types/IUser'
import Modal from '@common/Modal'
import { useTranslation } from 'react-i18next'
import useModal from '@hooks/useModal'
import FormUser from '@components/User/Form'
import ModalFooter from '@components/common/ModalFooter'

interface ModalUserProps extends ButtonProps {
  action: 'create' | 'edit'
  data?: Partial<ISUser> | undefined
}

const ModalUser = ({ action, data, ...props }: ModalUserProps) => {
  const { open, onOpen, onCancel } = useModal()
  const { t } = useTranslation()
  const numForm = Math.floor(Math.random() * 10000).toString()

  return (
    <>
      <Modal
        title={action === 'create' ? t('CREATEUSER') : t('EDITUSER')}
        open={open}
        footer={
          <ModalFooter onClose={onCancel} action={action} form={numForm} />
        }
        onCancel={onCancel}
        centered
        width="55%"
      >
        <FormUser data={data} onClose={onCancel} action={action} id={numForm} />
      </Modal>
      <Button {...props} onClick={onOpen} />
    </>
  )
}

export default ModalUser
