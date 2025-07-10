import IconButton from '@components/common/IconButton'
import SearchByQueryInput from '@components/common/SearchByQueryInput'
import { useUser } from '@contexts/UserContext'
import { api } from '@helpers/api'
import useParamsSelect from '@hooks/useParamsSelect'
import { IArticleCategory } from '@/types/IArticle'
import { Col, Row, Select, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import useSearchParams from '@hooks/useSearchParams'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getGenericList } from '@helpers/getGenericList'
import { ISUser } from '@types/IUser'

const { Option } = Select

const selectProps = {
  allowClear: true,
  showSearch: true,
  filterOption: false
}

const KbCategoryOption = ({ data }: { data: IArticleCategory }) => {
  return (
    <Space>
      {data.parent ? `${data.parent.name} > ` : null}
      {data.name}
    </Space>
  )
}

const KbCategorySelect = () => {
  const { t } = useTranslation()
  const { options, ...props } = useParamsSelect({
    param: 'categories',
    func: async (search = '') => {
      return await getGenericList<IArticleCategory>('/kb/category', search)
    }
  })

  return (
    <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 4 }}>
      <Select
        data-cy="category-select"
        placeholder={t('FILTERBYCATEGORY')}
        style={{ width: '100%' }}
        {...{ ...props, ...selectProps }}
      >
        {Array.isArray(options) && options?.length
          ? options?.map((option: IArticleCategory) => (
            <Option value={option.slug}>
              <KbCategoryOption data={option} />
            </Option>
          ))
          : null}
      </Select>
    </Col>
  )
}

const useCreatedBySelect = () => {
  const { search } = useLocation()
  const params = useSearchParams()
  const { options, setValue, value, ...props }: any = useParamsSelect({
    initialValue: params.getItem('createdBy'),
    param: 'createdBy',
    func: async (search = '') => await getGenericList<ISUser>('/susers', search)
  })

  useEffect(() => {
    setValue(() => params.getItem('createdBy')?.split(','))
    props.onSearch(value)
  }, [search])
  return { value, options, ...props }
}

const CreatedBySelect = () => {
  const { value, options, ...props } = useCreatedBySelect()
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 6 }}>
      <Select
        showSearch
        data-cy="createdby-select"
        allowClear
        onClear={props.onClear}
        value={value}
        placeholder={t('FILTERBYCREATOR')}
        style={{ width: '100%' }}
        filterOption={false}
        multiple={true}
        {...props}
      >
        {Array.isArray(options)
          ? options.map(e => <Option key={e.uuid} children={e.name} />)
          : null}
      </Select>
    </Col>
  )
}

const CreateArticleButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 4 }}>
      <IconButton
        data-cy="create-article"
        name="fa-plus"
        type="primary"
        block
        onClick={() => navigate('/articles/create')}
      >
        {t('CREATEARTICLE')}
      </IconButton>
    </Col>
  )
}

const ArticlesFilter = ({ withCreatedBy = true }) => {
  const { user } = useUser()
  return (
    <Col span={24}>
      <Row justify="space-between" gutter={[8, 8]}>
        <SearchByQueryInput />
        <KbCategorySelect />
        {user.level > 1 ? (
          <>
            {withCreatedBy ? <CreatedBySelect /> : null}
            <CreateArticleButton />
          </>
        ) : null}
      </Row>
    </Col>
  )
}

export default ArticlesFilter
