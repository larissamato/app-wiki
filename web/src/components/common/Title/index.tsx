import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Typography, Col, ColProps } from 'antd'

interface TitleProps extends ColProps {
  name?: string
  span?: number
  children?: ReactNode
}

const Title = ({ name, children, ...props }: TitleProps) => {
  return (
    <>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      {!children ? (
        <Col {...props}>
          <Typography.Title data-cy="title">{name}</Typography.Title>
        </Col>
      ) : (
        children
      )}
    </>
  )
}

export default Title
