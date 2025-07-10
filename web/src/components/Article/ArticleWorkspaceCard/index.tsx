import IconButton from '@components/common/IconButton'
import { useUser } from '@contexts/UserContext'
import useModal from '@hooks/useModal'
import useSearchParams from '@hooks/useSearchParams'
import { Card, Col, Form, Modal, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { SearchSelectWithForm } from '@components/common/SearchSelectWithForm'
import useSearchSelect from '@hooks/useSearchSelect'
import { AxiosResponse } from 'axios'
import { IArticle } from '@/types/IArticle'
import { IconButtonProps } from '@/types/IconButtonProps'
import { getGenericList } from '@helpers/getGenericList'

interface WorkspaceButtonProps extends IconButtonProps {
  name: string
  param: string
  describe: string
  criteria?: string
}

const styleButtonProps: Pick<IconButtonProps, 'type' | 'color' | 'size'> = {
  type: 'text',
  color: 'black',
  size: '20px'
}

const useSearchArticle = () => {
  const { options, ...props } = useSearchSelect<AxiosResponse<IArticle[]>, any>(
    {
      func: async (search = '') =>
        await getGenericList<IArticle>('/kb/article', search)
    }
  )
  return { options, ...props }
}

const SearchArticle = () => {
  const { options, ...props } = useSearchArticle()
  const { t } = useTranslation()
  return (
    <SearchSelectWithForm
      {...props}
      data-cy="search-article"
      name="existing_article"
      label={t('EXISTINGARTICLE')}
    >
      {Array.isArray(options)
        ? options.map(option => (
            <Select.Option
              key={option.slug}
              children={option.name}
              label={option.name}
              value={option.content}
            />
          ))
        : null}
    </SearchSelectWithForm>
  )
}

const useWorkspaceButton = ({
  param,
  criteria
}: Omit<WorkspaceButtonProps, 'describe' | 'name'>) => {
  const { search } = useLocation()
  const params = useSearchParams()
  const validate = () =>
    !!params?.getItem(param) &&
    (criteria ? params.getItem(param) === criteria : true)

  const [state, setState] = useState(validate())

  useEffect(() => {
    setState(validate())
  }, [search])
  return { state, params }
}

const WorkspaceButton = ({
  name,
  param,
  describe,
  criteria,
  ...props
}: WorkspaceButtonProps) => {
  const { t } = useTranslation()
  const { state, params } = useWorkspaceButton({ param, criteria })
  return (
    <IconButton
      onClick={() => params.toogleItem(param, criteria ? criteria : 'true')}
      describe={t(describe)}
      data-cy={`${param}-${state}`}
      name={name}
      type={!state ? 'text' : 'primary'}
      color={!state ? 'black' : 'white'}
      size="20px"
      {...props}
    />
  )
}

const filterButtonArr = [
  {
    describe: 'YOURARTICLES',
    criteria: true,
    param: 'createdBy',
    name: 'fa-light fa-chalkboard-user'
  },
  {
    describe: 'YOURVOTES',
    param: 'filterByVote',
    name: 'fa-light fa-folder-heart'
  },
  {
    describe: 'YOURSAVES',
    param: 'filterBySave',
    name: 'fa-light fa-bookmark'
  }
]

const FilterButtons = () => {
  const { user } = useUser()
  return (
    <>
      {filterButtonArr.map(e => (
        <WorkspaceButton
          {...{
            ...e,
            criteria: e.criteria ? user.uuid : undefined
          }}
        />
      ))}
    </>
  )
}

const ArticleWorkspaceCard = () => {
  const { t } = useTranslation()
  return (
    <Col span={24}>
      <Card title={t('YOURSECTION')}>
        <Row justify="space-around">
          <FilterButtons />
          <CloneArticleButton />
          <UserParamsButton />
        </Row>
      </Card>
    </Col>
  )
}

const useCloneArticleButton = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { open, onOpen, onCancel } = useModal()
  const onFinish = (values: any) => {
    navigate(`/articles/create`, { state: values.existing_article })
  }
  return { form, open, onOpen, onCancel, onFinish }
}

const CloneArticleButton = () => {
  const { form, open, onOpen, onCancel, onFinish } = useCloneArticleButton()
  const { t } = useTranslation()
  return (
    <Form onFinish={onFinish} form={form}>
      <Modal
        title={t('CLONEARTICLE')}
        {...{ open, onCancel }}
        onOk={form.submit}
      >
        <SearchArticle />
      </Modal>
      <IconButton
        onClick={onOpen}
        data-cy="clone-article-button"
        describe={t('CLONEEXISTINGARTICLE')}
        name="fa-light fa-clone"
        {...styleButtonProps}
      />
    </Form>
  )
}

const UserParamsButton = () => {
  const { t } = useTranslation()
  return (
    <IconButton
      disabled={true}
      describe={t('YOURPARAMS')}
      name="fa-light fa-user"
      {...styleButtonProps}
    />
  )
}
export default ArticleWorkspaceCard
