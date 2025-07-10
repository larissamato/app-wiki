import { List as AList, ListProps, Pagination, Row } from 'antd'
import { TableContext } from '@contexts/TableContext'
import { UseTable } from '@/types/UseTable'
interface CustomListProps<T, D> extends ListProps<T>, UseTable<D, T> { }
const List = <T, D>({
  onShowSizeChange,
  onChange,
  pagination,
  loading,
  ...props
}: CustomListProps<D, T>) => {
  const { renderItem, dataSource } = props
  return (
    <TableContext.Provider value={{ data: props.data, setData: props.setData }}>
      <AList
        style={{ width: '100%' }}
        dataSource={dataSource}
        renderItem={renderItem}
        loading={loading}
        grid={props.grid}
      />
      <Row justify="end">
        <Pagination
          onShowSizeChange={onShowSizeChange}
          onChange={onChange}
          current={pagination?.current}
          pageSizeOptions={['5', '10', '20', '50', '100']}
          pageSize={pagination?.pageSize || 5}
          total={props?.data?.meta?.total || 1}
        />
      </Row>
    </TableContext.Provider>
  )
}

export default List
