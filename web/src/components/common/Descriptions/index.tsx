import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { DescriptionsProps, Descriptions as ADescriptions } from 'antd'
interface DescriptionSubItemProps extends PropsWithChildren {
  label: string
}

export const DescriptionSubItem = ({
  label,
  children
}: DescriptionSubItemProps) => {
  const { t } = useTranslation()
  return (
    <tr className="ant-descriptions-row">
      <td className="ant-descriptions-item-label">{t(label)}</td>
      <td className="ant-descriptions-item-content">{children}</td>
    </tr>
  )
}
interface CustomDescriptions extends DescriptionsProps {
  dataSource: any
  columns: any
}
const Descriptions = ({
  dataSource,
  columns,
  ...props
}: CustomDescriptions) => {
  const { t } = useTranslation()
  return (
    <ADescriptions {...props}>
      {columns.map(e => {
        const Tag: any = e.render
          ? e.render
          : (props: any) => (
              <span {...props} style={{ width: '0.9rem', margin: 'auto' }} />
            )
        return (
          <ADescriptions.Item {...{ ...e, label: t(e.label) }}>
            <Tag
              {...{
                [e.render ? 'data' : 'children']: dataSource[e?.key],
                item: dataSource
              }}
            />
          </ADescriptions.Item>
        )
      })}
    </ADescriptions>
  )
}

export default Descriptions
