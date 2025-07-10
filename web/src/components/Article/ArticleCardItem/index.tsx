import { IArticle, IArticleCategory } from '@/types/IArticle'
import SupportAvatar from '@components/common/SupportAvatar'
import { Text } from '@components/common/Text'
import { DATEFORMAT } from '@constants/dateformat'
import { useUser } from '@contexts/UserContext'
import { calculateReadingTime } from '@helpers/calculateReadingTime'
import { checkCategories } from '@helpers/checkCategories'
import useSearchParams from '@hooks/useSearchParams'
import { Tag, Typography, Row, Col, Card, RowProps } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'styled-components'

interface CreatorInfos extends RowProps {
  item: IArticle
}

const CreatorInfos = ({ item, ...props }: CreatorInfos) => {
  const { user } = useUser()
  return (
    <Row gutter={[0, 0]} {...props}>
      <SupportAvatar
        size="small"
        is_private={item.is_private}
        sprite={item?.created_by?.sprite}
        level={item?.created_by?.level}
      >
        {item?.created_by?.name?.charAt(0)}-{' '}
      </SupportAvatar>
      <Text style={{ marginLeft: '8px' }}>
        {item?.created_by?.name}{' '}
        {user.level !== 1
          ? `- ${dayjs(item?.updated_at ?? item?.created_at).format(DATEFORMAT)}`
          : null}{' '}
      </Text>
    </Row>
  )
}

const CategoryTags = ({
  categories
}: {
  categories: IArticle['categories']
}) => {
  const params = useSearchParams()
  return (
    <>
      {categories
        ? checkCategories(categories).map(e => (
          <Tag
            key={e?.slug}
            color="blue"
            onClick={() => params.setItem('categories', e?.slug)}
          >
            # {e?.name}
          </Tag>
        ))
        : null}
    </>
  )
}

const ArticleCardItem = ({ item }: { item: IArticle }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Card
      data-cy="article-card-item"
      key={item.slug}
      style={{
        marginBottom: '8px',
        cursor: 'pointer',
        backgroundColor: item.is_private ? theme.content : theme.background,
        border: item.is_private ? `1px solid ${theme.background}` : undefined
      }}
      variant="borderless"
      onClick={() => navigate(`/articles/${item.slug}`)}
    >
      <Card.Meta
        title={
          <Typography.Title italic className="bold-article-title">
            {item?.name}
          </Typography.Title>
        }
        description={
          <Row
            align="middle"
            justify="space-between"
            style={{ marginTop: '16px' }}
            gutter={8}
          >
            <Col span={24}>
              <CreatorInfos item={item} />
            </Col>
            <Col span={24}>
              <Row justify="space-between" style={{ marginTop: '8px' }}>
                <Col>
                  <Text type="secondary">
                    Tempo de leitura: {calculateReadingTime(item.content)}m
                  </Text>
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    flexDirection: 'row-reverse'
                  }}
                >
                  <CategoryTags categories={item.categories} />
                </Col>
                <Col>
                  <Text type="warning">
                    {item.is_private ? '🔒 Privado para uso interno' : null}
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      />
    </Card>
  )
}

export default ArticleCardItem
