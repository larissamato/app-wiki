import { Modal as AModal, ModalProps } from 'antd'
import useWindowResize from '@hooks/useWindowResize'

const useWidthModal = ({ modalWidth }: any) => {
  const { width } = useWindowResize()
  const useWidth = width > 720 ? modalWidth : '100%'
  return { useWidth }
}

const Modal = ({ width, ...props }: ModalProps) => {
  const { useWidth } = useWidthModal({
    modalWidth: width
  })

  return (
    <AModal
      width={useWidth}
      {...props}
    />
  )
}

export default Modal
