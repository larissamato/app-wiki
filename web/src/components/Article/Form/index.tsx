import HiddenFormItem from '@components/common/HiddenFormItem'
import InputWithForm from '@components/common/InputWithForm'
import { SearchSelectWithForm } from '@components/common/SearchSelectWithForm'
import { MessageContext } from '@contexts/MessageContext'
import { api } from '@helpers/api'
import { getGenericList } from '@helpers/getGenericList'
import { handleError } from '@helpers/handleError'
import { useGenericContext } from '@hooks/useGenericContext'
import useSearchSelect from '@hooks/useSearchSelect'
import { IArticle } from '@types/IArticle'
import { DefaultSearchSelectProps } from '@types/ITicketModalItems'
import {
  Button,
  ButtonProps,
  Col,
  Form,
  FormProps,
  Row,
  Select,
  Switch
} from 'antd'
import { AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const Option = Select.Option

interface ArticleFormProps extends FormProps {
  type: 'edit' | 'create'
}

const selectStyleProps: Pick<DefaultSearchSelectProps, 'mode' | 'span'> & {
  name: string
} = { mode: 'multiple', name: 'categories', span: 7 }

const useCategorySelect = () => {
  const { options, ...props } = useSearchSelect({
    func: async (search = '') => await getGenericList('/kb/category', search)
  })
  return { options, ...props }
}

const CategorySelect = () => {
  const { options, ...props } = useCategorySelect()
  const { t } = useTranslation()
  return (
    <SearchSelectWithForm
      {...{ ...props, ...selectStyleProps }}
      label={t('CATEGORIES')}
    >
      {Array.isArray(options)
        ? options.map(item => (
          <Option
            {...{
              key: item.slug,
              children: item.name,
              value: item.slug,
              label: item.name
            }}
          />
        ))
        : null}
    </SearchSelectWithForm>
  )
}

const ConfirmButton = (props: ButtonProps) => {
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} xl={{ span: 4 }}>
      <Form.Item>
        <Button
          type="primary"
          block
          {...props}
          data-cy="confirm-create-article"
        >
          {t('CONFIRM')}
        </Button>
      </Form.Item>
    </Col>
  )
}

const handleRequest = async (
  values: IArticle
): Promise<AxiosResponse<IArticle>> => {
  if (!values.slug) {
    return await api.post('/kb/article', values)
  }
  return await api.put(`/kb/article/${values.slug}`, values)
}

const useArticleForm = (content: string) => {
  const { t } = useTranslation()
  const messageApi = useGenericContext(MessageContext)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const onFinish = async (values: any) => {
    await handleRequest({ ...values, content })
      .then(e => {
        messageApi.success(
          `${t('ARTICLE')} ${t(values.slug ? 'EDITED' : 'CREATED')}`
        )
        navigate(`/articles/${e.data.slug}`)
      })
      .catch(e => {
        handleError(e, messageApi)
      })
  }
  return { form, onFinish }
}

interface ArticleFormProps extends FormProps {
  content: string
}

const IsPrivateSwitch = () => {
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} md={{ span: 8 }} xl={{ span: 3 }}>
      <Form.Item
        name="is_private"
        label={t('PRIVATE') + '?'}
        initialValue={true}
      >
        <Switch />
      </Form.Item>
    </Col>
  )
}

const ArticleForm = (props: ArticleFormProps) => {
  const { t } = useTranslation()
  const { form, onFinish } = useArticleForm(props.content)
  return (
    <Col span={24}>
      <Form {...props} form={form} onFinish={onFinish}>
        <Row style={{ width: '100%' }} gutter={[8, 8]}>
          <HiddenFormItem name="slug" />
          <Col xs={{ span: 24 }} xl={{ span: 10 }}>
            <InputWithForm
              name="name"
              rules={[{ min: 25 }, { required: true }]}
              label={t('TITLE')}
            />
          </Col>
          <CategorySelect />
          <IsPrivateSwitch />
          <ConfirmButton onClick={form.submit} />
        </Row>
      </Form>
    </Col>
  )
}

export default ArticleForm
