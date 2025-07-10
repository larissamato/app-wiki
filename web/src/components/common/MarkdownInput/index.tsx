import { useState } from 'react'
import { Tabs, Input, Form } from 'antd'
import type { TabsProps } from 'antd'
import TextMarkdown from '../TextMarkdown'
import { useTheme } from 'styled-components'
import { TextAreaProps } from 'antd/lib/input'
import { translateColumns } from '@helpers/translateColumns'
import { useTranslation } from 'react-i18next'

const MarkdownInput = ({ rules, name }: { rules: any[]; name: string }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const items = translateColumns(
    generateItems(rules, name, theme.text),
    t,
    'label'
  )
  return <Tabs type="card" items={items} />
}

const generateItems = (rules: any[], name: string, color: string) => {
  const [text, setText] = useState<string>('')
  const form = Form.useFormInstance()

  const getFieldsValue = () => {
    setInterval(() => {
      setText(form.getFieldsValue()[name])
    }, 500)
  }
  getFieldsValue()

  const items: TabsProps['items'] = [
    {
      label: 'WRITE',
      key: '1',
      children: (
        <Form.Item name={name} rules={rules}>
          <TextArea />
        </Form.Item>
      )
    },
    {
      label: 'PREVIEW',
      key: '2',
      children: <TextMarkdown text={text ? text : ''} color={color} />
    }
  ]
  return items
}

const TextArea = ({ ...props }: TextAreaProps) => (
  <Input.TextArea
    {...props}
    rows={4}
    allowClear
    showCount
    autoSize={{ minRows: 6, maxRows: 40 }}
  />
)

export default MarkdownInput
