import Title from '@components/common/Title'
import { IArticle, IArticleSave } from '@/types/IArticle'
import { Button, Card, Col, List, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ArticlesFilter from '@components/Article/ArticlesFilter'
import useFetch from '@hooks/useFetch'
import { api } from '@helpers/api'
import { AxiosResponse } from 'axios'
import Icon from '@components/common/Icon'
import ArticleCardItem from '@components/Article/ArticleCardItem'
import ArticleGenericList from '@components/Article/ArticleGenericList'
import ArticleWorkspaceCard from '@components/Article/ArticleWorkspaceCard'
import { useUser } from '@contexts/UserContext'

const ArticlesHead = () => {
  const { t } = useTranslation()
  return (
    <Col span={24}>
      <Title name={t('DOCUMENTATION')} span={24} />
      <ArticlesFilter />
    </Col>
  )
}

const ArticleList = () => {
  return (
    <Col xs={{ span: 24 }} xl={{ span: 16 }}>
      <ArticleGenericList
        url={'/kb/article'}
        renderItem={(item: any) => <ArticleCardItem item={item} />}
      />
    </Col>
  )
}

const RatedCardItem = ({ item }: { item: IArticle }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <List.Item
      style={{ cursor: 'pointer' }}
      key={item?.slug}
      onClick={() => navigate(`/articles/${item?.slug}`)}
    >
      <Tag color="blue-inverse">
        {item?.votes_count} {t('VOTES')}
      </Tag>
      {item?.name}
    </List.Item>
  )
}

const RatedCard = () => {
  const { t } = useTranslation()
  const { loading, data } = useFetch<AxiosResponse<IArticle[]>, any>({
    func: async () => await api.get('/kb/article?sort=votes&perPage=10')
  })

  return (
    <Col span={24}>
      <Card title={t('MOSTRATED')} loading={loading}>
        <List
          renderItem={(item: IArticle) => <RatedCardItem item={item} />}
          dataSource={data.data}
        />
      </Card>
    </Col>
  )
}

const RecentSaveCardItem = ({
  item,
  refresh
}: {
  item: IArticleSave
  refresh: () => void
}) => {
  const navigate = useNavigate()
  const onDeleteSaved = (item: IArticleSave) => {
    api.delete(`/kb/${item.article.slug}/save`).then(() => refresh())
  }
  return (
    <List.Item
      actions={[
        <button
          onClick={() => onDeleteSaved(item)}
          data-cy="delete-save-button"
        >
          <Icon name="fa-solid fa-circle-xmark" color="black" />
        </button>
      ]}
      style={{ cursor: 'pointer' }}
      key={item?.article?.slug}
    >
      <Button
        type="text"
        onClick={() => navigate(`/articles/${item.article.slug}`)}
      >
        {item?.article?.name}
      </Button>
    </List.Item>
  )
}

const RecentSaveCard = () => {
  const { user } = useUser()
  const { t } = useTranslation()
  const { loading, data, refresh } = useFetch<AxiosResponse<IArticle[]>, any>({
    func: async () =>
      await api.get(user.level !== 1 ? '/kb/saves' : '/kb/votes')
  })

  return (
    <Col span={24}>
      <Card
        title={user.level !== 1 ? t('RECENTSAVED') : t('MYLIKES')}
        loading={loading}
      >
        <List
          renderItem={(item: IArticleSave) => (
            <RecentSaveCardItem item={item} refresh={refresh} />
          )}
          dataSource={data.data}
        />
      </Card>
    </Col>
  )
}

const ArticleAside = () => {
  const { user } = useUser()
  return (
    <Col xs={{ span: 24 }} xl={{ span: 8 }}>
      <Row style={{ width: '100%' }} gutter={[8, 8]}>
        {user.level !== 1 ? <ArticleWorkspaceCard /> : null}
        <RatedCard />
        <RecentSaveCard />
      </Row>
    </Col>
  )
}

const Articles = () => {
  return (
    <Row gutter={[8, 8]}>
      <ArticlesHead />
      <ArticleList />
      <ArticleAside />
    </Row>
  )
}

export default Articles
