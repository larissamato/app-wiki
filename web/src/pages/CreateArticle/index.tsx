import ArticleEditor from '@components/Article/Editor'
import ArticleForm from '@components/Article/Form'
import Title from '@components/common/Title'
import { Row } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const CreateArticle = () => {
  const { t } = useTranslation()
  const { state } = useLocation()
  const [value, setValue] = useState<string>(state || '')
  const onChange = (value?: string | undefined) => {
    if (value) setValue(value)
  }

  return (
    <Row style={{ height: '90%' }} gutter={[8, 8]}>
      <Title name={t('CREATEARTICLE')} span={24} />
      <ArticleForm content={value} type="create" />
      <ArticleEditor {...{ value, setValue, onChange }} />
    </Row>
  )
}

export default CreateArticle
