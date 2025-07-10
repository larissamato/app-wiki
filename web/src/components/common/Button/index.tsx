import { Button as AntButton, ButtonProps } from 'antd'
import { useTheme } from 'styled-components'

const Button = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <AntButton
      style={{ backgroundColor: theme.geekblue, color: theme.white }} 
      icon={props.icon}
      type={props.type || 'primary'}
      {...props}
    />
  )
}

export default Button
