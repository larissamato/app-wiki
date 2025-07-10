import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Tag, Typography, Tooltip, Space } from 'antd'
import dayjs from 'dayjs'
import Button from '@common/Button'
import { ISUser } from '@/types/IUser'
import { DATEFORMAT } from '@constants/dateformat'
import AvatarSprite from '@common/AvatarSprite'
import { Actions, InactiveUserActions } from '../Actions'

interface TagsProps {
  array: Array<{ name: string; uuid: string }>
  color: string
}

const { Text } = Typography

const RenderArrayTags = ({
  array,
  color
}: {
  array: Array<{ name: string; uuid: string }>
  color: string
}) => {
  return (
    <>
      {array && array.length > 0 ? (
        <EllipsisTag array={array} color={color} />
      ) : null}
    </>
  )
}

const EllipsisTag = ({ array, color }: TagsProps) => {
  const [ellipsis, setEllipsis] = useState(false)
  const showMore = () => setEllipsis(true)
  const TooltipTag = ({ name, uuid }: { name: string; uuid: string }) => (
    <Tooltip title={name} key={uuid}>
      <Tag color={color} style={{ marginBottom: '5px' }}>
        <Text
          style={{ width: '100px', color: 'white' }}
          ellipsis={{ symbol: 'more' }}
        >
          {name}
        </Text>
      </Tag>
    </Tooltip>
  )
  return (
    <>
      {array && array.length > 1 && ellipsis ? (
        array.map(e => <TooltipTag name={e.name} uuid={e.uuid} />)
      ) : (
        <TooltipTag name={array[0].name} uuid={array[0].uuid} />
      )}
      {array.length > 1 && !ellipsis ? (
        <Button
          size="small"
          onClick={showMore}
          style={{ color: 'white', backgroundColor: color }}
          data-cy="ellipsis-table-user"
        >
          ...
        </Button>
      ) : null}
    </>
  )
}

const commonColumns: ColumnsType<ISUser> = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: (_, user) => {
      return <AvatarSprite user={user} />
    }
  },
  {
    title: 'EMAIL',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'LEVEL',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: 'CREATEDAT',
    dataIndex: 'created_at',
    key: 'created_at',
    render: text => dayjs(text).format(DATEFORMAT)
  },
  {
    title: 'UPDATEAT',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: text => dayjs(text).format(DATEFORMAT)
  },
]

export const usersColumns: Array<ColumnsType<ISUser>> = [
  [
    {
      title: 'ACTIONS',
      render: (_, data) => <Actions data={data} />
    },
    ...commonColumns
  ],
  [
    {
      title: 'ACTIONS',
      render: (_, actions) => <InactiveUserActions data={actions} />
    },
    ...commonColumns
  ]
]
