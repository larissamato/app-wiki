import { ReactNode } from 'react'
import ResponsiveTableCard from '@common/ResponsiveTableCard'
import type { ColumnsType } from 'antd/es/table'

interface PropsTab {
  key: any
  label: ReactNode
  url: string
}

export function generateTabItem(
  props: PropsTab,
  columns: ColumnsType<any>,
  funcMapCleanFormat?: any
) {
  const { key, label, url } = props

  return {
    key,
    label,
    children: (
      <ResponsiveTableCard
        url={url}
        columns={columns}
        func={funcMapCleanFormat}
        rowClassName={(device: { deleted_at: any }) => !device.deleted_at ? '' : 'red-row'}
      />
    )
  }
}
