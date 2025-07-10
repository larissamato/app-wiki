import useTable from '@hooks/useTable'
import { List, ListProps } from 'antd'

interface ArticleGenericListProps extends ListProps<any> {
  url: string
}
const ArticleGenericList = ({ url, ...props }: ArticleGenericListProps) => {
  const { data, loading, setPagination, onShowSizeChange } =
    useTable(url)
  return (
    <List
      {...props}
      itemLayout="vertical"
      style={{ width: '100%' }}
      dataSource={data.data}
      loading={loading}
      pagination={{
        align: 'end',
        onChange: (page, pageSize) => {
          setPagination({ current: page, pageSize })
          onShowSizeChange(0, pageSize)
        },
        total: data.meta?.total || 5,
        pageSizeOptions: ['5', '10', '20', '50', '100'],
        pageSize: data.meta?.per_page || 5
      }}
    />
  )
}
export default ArticleGenericList
