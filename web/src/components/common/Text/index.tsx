import { ReactNode } from 'react'
import { TextProps } from 'antd/es/typography/Text.js'
import { Typography, TypographyProps } from 'antd'
import { TypographyText } from './style.js'

const Span = (props: TextProps) => {
  const { Text } = Typography
  return (
    <Text {...props} />
  )
}

export const Text = Span
