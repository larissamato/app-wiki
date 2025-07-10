import { Table as AntTable } from 'antd'
import { useTranslation } from 'react-i18next'
import type { TableCardProps } from '@/types/ITableCard.d.ts'
import { translateColumns } from '@helpers/translateColumns'
import useTable from '@hooks/useTable'
import { UseTable } from '@/types/UseTable'
import { TableContext } from '@contexts/TableContext'
import { SetStateAction, useMemo, useState } from 'react'

export const TableWithQuery = ({
  url,
  columns,
  cancelSearch,
  ...props
}: TableCardProps) => {
  const queryProps = useTable(url,cancelSearch)
  return <Table {...queryProps} {...props} columns={columns} />
}

const configFullData = (data: [] | string) => {
  if (Array.isArray(data)) return data
  if (!data) return []
  return [data]
}

export const TableWithoutQuery = ({
  data,
  columns,
  ...props
}: TableCardProps) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const handleTableChange = (pagination: {
    current: SetStateAction<number>
  }) => {
    setCurrentPage(pagination.current)
  }
  const fullData = configFullData(data)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = fullData.slice(startIndex, startIndex + pageSize)

  const memoData = useMemo(
    () => ({ data: props.data, setData: props.setData }),
    [props.data, props.setData]
  )
  return (
    <TableContext.Provider value={memoData}>
      <AntTable
        columns={translateColumns(columns, t)}
        data={{
          data: fullData
        }}
        dataSource={fullData}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize,
          total: fullData.length,
          showTotal: () =>
            `${t('SHOWING')} ${paginatedData.length} ${t('OF')}  ${
              fullData.length
            } items`,
          pageSizeOptions: ['5', '10', '20', '50', '100', '200']
        }}
        {...props}
      />
    </TableContext.Provider>
  )
}

export const Table = <T, D>({
  columns,
  pagination,
  handleTableChange,
  loading,
  data,
  children,
  ...props
}: UseTable<T, D>) => {
  const { t } = useTranslation()

  const dataSource = data.data?.map(({ children, ...item }) => ({
    ...item,
    ...(children && children.length > 0 && { children })
  }))

  const memoData = useMemo(
    () => ({ data, setData: props.setData }),
    [data, props.setData]
  )
  return (
    <TableContext.Provider value={memoData}>
      {children}
      <AntTable
        rowKey="uuid"
        {...props}
        columns={translateColumns(columns, t)}
        dataSource={dataSource}
        pagination={{
          ...pagination,
          total: data.meta?.total | data?.total | 1,
          showTotal: () =>
            `${t('SHOWING')} ${data?.data?.length || 0} ${t('OF')}  ${
              data?.meta?.total || data?.total || 0
            } items`,
          pageSizeOptions: ['5', '10', '20', '50', '100', '200']
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </TableContext.Provider>
  )
}

export default Table
