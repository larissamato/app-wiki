import useWindowResize from '@hooks/useWindowResize'
import { TableWithQuery } from '../Table'
import { CardWithQuery } from '@common/Card'
import { TableCardProps } from '../../types/ITableCard'

const ResposiveTableCard = <T,>({
  url,
  columns,
  children,
  cancelSearch,
  ...props
}: TableCardProps<T>) => {
  const { width } = useWindowResize()
  return (
    <>
      {width > 980 ? (
        <TableWithQuery {...props} url={url} columns={columns} cancelSearch={cancelSearch}>
          {children}
        </TableWithQuery>
      ) : (
        <CardWithQuery url={url} columns={columns}>
          {children}
        </CardWithQuery>
      )}
    </>
  )
}

export default ResposiveTableCard
