import { IArticleCategory } from '@/types/IArticle'
import { ColumnType } from 'antd/es/table'
import ArticleCategoryModal from '../ArticleCategoryModal'
import { Space, Tag } from 'antd'
import DeleteButton from '@/components/common/DeleteButton'
import Icon from '@/components/common/Icon'

const ArticleCategoryActions = ({ data }: { data: IArticleCategory }) => {
  return (
    <Space>
      <ArticleCategoryModal
        data={data}
        icon={<Icon name="fa-light fa-pencil" color="white" />}
        type="primary"
      />
      <DeleteButton
        {...{
          name: data.name,
          uuid: data.slug,
          url: `/kb/category/${data.slug}`
        }}
      />
    </Space>
  )
}

const items = ['name', 'slug']

const commonColumns = items.map(e => ({
  title: e.toUpperCase(),
  dataIndex: e,
  key: e
}))

const commonActions = {
  title: 'ACTIONS',
  dataIndex: 'slug',
  key: 'name'
}

export const columns: ColumnType<IArticleCategory> = [
  {
    ...commonActions,
    render: (_, data) => <ArticleCategoryActions data={data} />
  },
  ...commonColumns,
  {
    title: 'CATEGORYPARENT',
    dataIndex: 'parent',
    key: 'parent',
    render: (_, { parent }) =>
      parent ? <Tag color="blue">{parent.name}</Tag> : null
  }
]
