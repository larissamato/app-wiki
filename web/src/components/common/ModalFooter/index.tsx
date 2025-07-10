import { MouseEventHandler, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

interface ModalFooterProps {
  form: string
  action: 'create' | 'edit'
  onClose: MouseEventHandler<HTMLElement>
  warning?: boolean
  closeWarning?: boolean
  warningMessage?: string
}

const ModalFooter = ({
  onClose,
  form,
  warning,
  closeWarning,
}: ModalFooterProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleConfirmClick = () => {
    setIsModalOpen(true)
  }
  const handleWarningClose = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button onClick={onClose} danger type="primary" form={form}>
        {t('CANCEL')}
      </Button>
      {warning ? (
        <Button type="primary" onClick={handleConfirmClick}>
          {t('CONFIRM')}
        </Button>
      ) : (
        <Button
          type="primary"
          form={form}
          key="submit"
          htmlType="submit"
          onClick={closeWarning ? onClose : undefined}
        >
          {t('CONFIRM')}
        </Button>
      )}
      <Modal
        title={t('WARN')}
        footer={
          <ModalFooter
            closeWarning
            onClose={handleWarningClose}
            action={'create'}
            form={form}
            warningMessage={t('WARNINGASSOCIAION')}
          />
        }
        open={isModalOpen}
        onCancel={handleWarningClose}
      >
      </Modal>
    </>
  )
}

export default ModalFooter
