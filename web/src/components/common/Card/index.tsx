import { Card as AntCard, List, Pagination } from 'antd'
import { TableCardProps } from '../../types/ITableCard.d.ts'
import { useTranslation } from 'react-i18next'
import useTable from '@hooks/useTable'
import { TableContext } from '@contexts/TableContext'
import { PaginationType } from 'antd/es/transfer/interface'
import { ColumnType } from 'antd/es/table'
import { UseTable } from '@/types/UseTable'
import { IRequestList } from '@/types/ICollection'

const translateColumns = (columns: any, t: any) => {
  return columns.map((column: any) => {
    return { ...column, title: t(column.title) }
  })
}

const checkItensColumn = (column: any, data: any) => {
  if (column.render) {
    return (
      <p key={column.key}>
        {column.key !== 'actions' ? column.title : null}{' '}
        {column.render(data[column.dataIndex], data)}
      </p>
    )
  } else if (column.key !== 'title') {
    return (
      <p key={column.key}>
        {column.title}: {data[column.dataIndex]}
      </p>
    )
  }
}

const renderContent = (columns: any, data: any) => {
  return columns.map((column: { key: string; title: string }) => {
    return checkItensColumn(column, data)
  })
}

export const CardWithQuery = ({ url, columns, children }: TableCardProps) => {
  const queryProps = useTable(url)
  return (
    <>
      {children}
      <Card {...queryProps} columns={columns} />
    </>
  )
}

interface CardProps<T> {
  loading: boolean
  data: any
  pagination: PaginationType
  columns: ColumnType<any>
  onChange: (page: number) => void
}

const Card = <D, T>({
  loading,
  pagination,
  columns,
  onChange,
  setData,
  data
}: UseTable<IRequestList<T>, IRequestList<T>>) => {
  const { t } = useTranslation()
  return (
    <TableContext.Provider value={{ data: data, setData: setData }}>
      <List
        loading={loading}
        dataSource={data.data}
        renderItem={item => (
          <AntCard
            key={item.uuid}
            type="inner"
            style={{ width: '99%' }}
            title={item?.title}
          >
            {renderContent(translateColumns(columns, t), item)}
          </AntCard>
        )}
      />
      <Pagination
        onChange={onChange}
        current={pagination.current || 1}
        pageSize={pagination.pageSize}
        defaultCurrent={1}
        defaultPageSize={10}
        total={data.meta?.total | data?.total | 1}
      />
    </TableContext.Provider>
  )
}

export default Card
