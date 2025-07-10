import { Tooltip, Button } from 'antd'
import Icon from '@common/Icon'
import { IconButtonProps } from '@/types/IconButtonProps'
import { useTheme } from 'styled-components'

const IconButton = ({
  name,
  describe,
  size,
  color,
  ...props
}: IconButtonProps) => {
  const theme = useTheme()
  return (
    <Tooltip title={describe || null}>
      <Button
        {...props}
        icon={<Icon name={name} size={size} color={color || 'white'} />}
        type={props.type || 'primary'}
        style={{ backgroundColor: theme.geekblue, color: color || theme.white }}
      />
    </Tooltip>
  )
}

export default IconButton
