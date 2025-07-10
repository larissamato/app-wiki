import { Col, Typography } from 'antd'
import { TextProps } from 'antd/es/typography/Text'
import { ReactNode } from 'react'

interface SubTitleProps extends TextProps {
  span?: number
  level?: 1 | 2 | 3 | 4 | 5 | undefined
  children: ReactNode
}

const SubTitle = ({
  span = 24,
  level = 2,
  children,
  ...props
}: SubTitleProps) => {
  return (
    <Col span={span}>
      <Typography.Title level={level} {...props}>
        {children}
      </Typography.Title>
    </Col>
  )
}

export default SubTitle
