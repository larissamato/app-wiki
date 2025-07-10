import { PropsWithChildren } from "react"
export interface ModalContextType extends PropsWithChildren  {
  open: boolean,
  onOpen: () => void
  onCancel?: () => void 
  onClose?: () => void
}
