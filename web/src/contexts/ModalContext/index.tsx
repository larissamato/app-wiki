import { PropsWithChildren, ReactNode, createContext } from 'react'
import { ModalProps } from 'antd'
import Modal from '@common/Modal'
import useModal from '@hooks/useModal'
import type { ModalContextType } from '@/types/ModalContextType'

interface ModalContextProps extends PropsWithChildren, ModalProps {
  content: ReactNode
}

export const ModalContext = createContext<ModalContextType | undefined>({
  open: false,
  onOpen: () => null,
  onCancel: () => null,
  onClose: () => null
})

export const ModalProvider = ({
  children,
  content,
  ...props
}: ModalContextProps) => {
  const { open, onCancel, onOpen } = useModal()
  return (
    <ModalContext.Provider value={{ onOpen, onCancel, open }}>
      <> {children} </>
      <Modal open={open} onCancel={onCancel} {...props}>
        {content}
      </Modal>
    </ModalContext.Provider>
  )
}
