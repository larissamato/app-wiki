import { ButtonProps } from 'antd'

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  describe?: string
  name: string
  color?: string
  size?: string
}
