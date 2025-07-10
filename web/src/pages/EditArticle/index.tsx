import ArticleEditor from '@components/Article/Editor'
import ArticleForm from '@components/Article/Form'
import RenderPage from '@components/common/RenderPage'
import Title from '@components/common/Title'
import { api } from '@helpers/api'
import { useIntervalFetch } from '@hooks/useFetch'
import { IArticle } from '@/types/IArticle'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const modifyArticleValues = (values: IArticle | undefined) => {
  if (values) {
    return {
      ...values,
      categories: values.categories ? values.categories.map(e => e.slug) : []
    }
  }
}
const useEditArticle = () => {
  const { slug } = useParams()
  const { data, loading, error, setData } = useIntervalFetch({
    func: () => api.get<IArticle>(`kb/article/${slug}`),
    update: false
  })

  const onChange = (newValue?: string) => {
    setData((prev: IArticle) => ({ ...prev, content: newValue }))
  }

  return { data, loading, error, onChange }
}

const EditArticle = () => {
  const { t } = useTranslation()
  const { data, loading, error, onChange } = useEditArticle()
  return (
    <RenderPage {...{ data, loading, error }}>
      <Row style={{ width: '100%' }}>
        <Title name={`${t('EDITARTICLE')}: ${data.name}`} span={24} />
        <ArticleForm
          initialValues={modifyArticleValues(data)}
          type="edit"
          content={data.content}
        />
        <ArticleEditor value={data.content} onChange={onChange} />
      </Row>
    </RenderPage>
  )
}

export default EditArticle
