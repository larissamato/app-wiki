import { columns } from '@components/Article/ArticleCategoryTable'
import ResponsiveTableCard from '@common/ResponsiveTableCard'
import { Col, Row } from 'antd'
import Title from '@components/common/Title'
import { useTranslation } from 'react-i18next'
import ArticleCategoryModal from '@components/Article/ArticleCategoryModal'
import SearchByQueryInput from '@components/common/SearchByQueryInput'
import Icon from '@components/common/Icon'
const CreateCategory = () => {
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} xl={{ span: 4 }}>
      <ArticleCategoryModal
        type="primary"
        block
        icon={<Icon name="fa-plus" color="white" />}
      >
        {t('CREATECATEGORY')}
      </ArticleCategoryModal>
    </Col>
  )
}

const ArticleCategories = () => {
  const { t } = useTranslation()
  return (
    <Row style={{ width: '100%' }} justify="space-between">
      <Title name={t('CATEGORIES')} span={24} />
      <Col span={24}>
        <Row style={{ width: '100%', paddingBottom: '8px' }} justify="space-between" gutter={[8, 8]}>
          <SearchByQueryInput span={8} />
          <CreateCategory />
        </Row>
      </Col>
      <ResponsiveTableCard
        rowKey="slug"
        url={'/kb/category?withChildren=true'}
        columns={columns}
        style={{ width: '100%' }}
      />
    </Row>
  )
}

export default ArticleCategories
