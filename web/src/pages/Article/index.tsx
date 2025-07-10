import Icon from '@components/common/Icon'
import IconButton from '@components/common/IconButton'
import MarkdownPreview from '@components/common/MarkdownPreview'
import RenderPage from '@components/common/RenderPage'
import { Text } from '@components/common/Text'
import Title from '@components/common/Title'
import { DATEFORMAT } from '@constants/dateformat'
import { ArticleContext } from '@contexts/ArticleContext'
import { MessageContext } from '@contexts/MessageContext'
import { useUser } from '@contexts/UserContext'
import { api } from '@helpers/api'
import { calculateReadingTime } from '@helpers/calculateReadingTime'
import { handleError } from '@helpers/handleError'
import { useIntervalFetch } from '@hooks/useFetch'
import { useGenericContext } from '@hooks/useGenericContext'
import { IArticle } from '@/types/IArticle'
import {
  Button,
  ButtonProps,
  Col,
  Divider,
  Flex,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ArticleAvatar from '@components/Article/ArticleAvatar'
import { checkCategories } from '@helpers/checkCategories'

const useArticleActions = () => {
  const { setData, data } = useGenericContext(ArticleContext)
  const { t } = useTranslation()
  const { slug } = useParams()
  const messageApi = useGenericContext(MessageContext)
  const navigate = useNavigate()
  function onEdit() {
    navigate(`/articles/${slug}/edit`)
  }

  async function onSave() {
    await api[data.save ? 'delete' : 'post'](`/kb/${slug}/save`).then(() => {
      setData(prev => ({ ...prev, save: !prev.save }))
    })
  }

  async function onDelete() {
    await api
      .delete(`/kb/article/${slug}`)
      .then(() => {
        messageApi.success(`${t('ARTICLE')} ${t('DELETED')}`)
        navigate('/articles')
      })
      .catch(e => handleError(e, messageApi))
  }

  return { onEdit, onSave, onDelete }
}

const ArticleCategories = ({ data }: { data: IArticle['categories'] }) => {
  const navigate = useNavigate()
  return (
    <Space>
      {data
        ? checkCategories(data).map(category => (
          <Tag
            color="blue"
            onClick={() => navigate(`/articles?categories=${category.slug}`)}
          >
            #{category.name}
          </Tag>
        ))
        : null}
    </Space>
  )
}

const useArticleVote = (article: IArticle) => {
  const [vote, setVote] = useState<IArticle['user_vote']>(article.user_vote)
  const onVote = async (vote: boolean) => {
    api
      .post(`/kb/${article.slug}/vote`, {
        vote
      })
      .then(e => setVote([e.data]))
  }

  const onDelete = async () => {
    await api.delete(`/kb/${article.slug}/vote/`).then(() => setVote([]))
  }

  const up = async () => await onVote(true)
  const down = async () => await onVote(false)
  return { up, down, vote, onDelete }
}

const ArticleVoteActions = ({ up, down }: any) => {
  const { t } = useTranslation()
  return (
    <Space>
      <Text>{t('WASTHISARTICLEUSEFULTOYOU?')}</Text>
      <IconButton
        name="fa-regular fa-thumbs-up"
        onClick={up}
        data-cy="article-vote-true"
      />
      <IconButton
        name="fa-regular fa-thumbs-down"
        onClick={down}
        data-cy="article-vote-false"
      />
    </Space>
  )
}

const ArticleVote = () => {
  const { data } = useGenericContext(ArticleContext)
  const { up, down, vote, onDelete } = useArticleVote(data)
  const { t } = useTranslation()
  return (
    <Col span={24} style={{ marginTop: '18px' }}>
      <Row justify="center">
        {!vote.length ? (
          <ArticleVoteActions {...{ up, down }} />
        ) : (
          <Row align="middle" gutter={[0, 0]}>
            <Text>{t('THANKFORYOUROPNION')}</Text>
            <Button type="link" onClick={onDelete} data-cy="delete-vote">
              <Icon name="fa-solid fa-circle-xmark" size={20} />
            </Button>
          </Row>
        )}
      </Row>
    </Col>
  )
}

const ArticleInfos = () => {
  const { data } = useGenericContext(ArticleContext)
  return (
    <Flex justify="center" align="center">
      <ArticleAvatar />
      <Text>
        {data?.created_by?.name} -{' '}
        {dayjs(data?.updated_at ?? data?.created_at).format(DATEFORMAT)}
      </Text>
      <Text type="secondary">
        - Leitura de: {calculateReadingTime(data.content)}m
      </Text>
    </Flex>
  )
}

const ArticleSubInfos = () => {
  const { data } = useGenericContext(ArticleContext)
  return (
    <Text>
      <Space>
        {data.is_private ? '🔒 Privado para uso interno' : null}
        {data.categories?.length ? (
          <ArticleCategories data={data.categories} />
        ) : null}
      </Space>
    </Text>
  )
}

const ArticleActions = () => {
  const { data } = useGenericContext(ArticleContext)
  const { t } = useTranslation()
  const { onEdit, onSave, onDelete } = useArticleActions()
  const commonStyle: ButtonProps = { type: 'link', style: { fontSize: '12px' } }
  return (
    <Row justify="center" style={{ fontSize: '2px' }}>
      <Space style={{ marginTop: '16px' }}>
        <Button {...commonStyle} onClick={onEdit} data-cy="edit-article">
          {t('EDIT')}
        </Button>
        <Button {...commonStyle} onClick={onSave} data-cy="save-article">
          {!data.save ? t('SAVE') : t('SAVED')}
        </Button>
        <Popconfirm onConfirm={onDelete} title={t('AREYOUSUREDELETEARTICLE')}>
          <Button {...commonStyle} data-cy="delete-article">
            {t('DELETE')}
          </Button>
        </Popconfirm>
      </Space>
    </Row>
  )
}

const ArticleContent = () => {
  const { data } = useGenericContext(ArticleContext)
  return (
    <Row style={{ width: '100%' }} justify="center">
      <Col span={18}>
        <MarkdownPreview source={data.content} />
      </Col>
    </Row>
  )
}

const useArticle = () => {
  const { user } = useUser()
  const { slug } = useParams()
  const { data, setData, loading, error } = useIntervalFetch({
    func: () =>
      api.get<IArticle>(`kb/article/${slug}`).then(e => {
        return e
      }),
    update: false
  })
  return { data, loading, error, setData, user }
}

const ArticleTitle = () => {
  const { user } = useUser()
  const { data } = useGenericContext(ArticleContext)
  return (
    <Col span={24}>
      <Row style={{ width: '100%' }} justify="center" align="middle">
        <Divider>
          <Title span={24} name={data?.name}>
            <Typography.Title>{data?.name}</Typography.Title>
          </Title>
          <ArticleSubInfos />
          {user.level !== 1 ? <ArticleInfos /> : null}
        </Divider>
      </Row>
    </Col>
  )
}

const Article = () => {
  const { data, loading, error, setData, user } = useArticle()
  return (
    <RenderPage
      {...{
        data,
        loading,
        error: user.level === 1 && data.is_private ? 'Not have access' : error
      }}
    >
      <ArticleContext.Provider value={{ data, setData }}>
        <Row {...{ gutter: [0, 0] }}>
          <ArticleTitle />
          <ArticleContent />
          <ArticleVote />
        </Row>
        {user.level > 1 ? <ArticleActions /> : null}
      </ArticleContext.Provider>
    </RenderPage>
  )
}

export default Article
