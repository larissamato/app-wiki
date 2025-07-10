import Modal from '@components/common/Modal'
import useModal from '@hooks/useModal'
import { IArticleCategory } from '@/types/IArticle'
import { Button, ButtonProps, Col, Form, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import InputWithForm from '@components/common/InputWithForm'
import { SearchSelectWithForm } from '@components/common/SearchSelectWithForm'
import useSearchSelect from '@hooks/useSearchSelect'
import { api } from '@helpers/api'
import { handleError } from '@helpers/handleError'
import { useContext } from 'react'
import { MessageContext } from '@contexts/MessageContext'
import useTableContext from '@hooks/useTableContext'
import { getGenericList } from '@helpers/getGenericList'
import { ModalContext } from '@contexts/ModalContext'
import { useGenericContext } from '@hooks/useGenericContext'
import { ModalContextType } from '@types/ModalContextType'
import { MessageInstance } from 'antd/es/message/interface'
import { TFunction } from 'i18next'

interface ArticleCategoryModalProps extends ButtonProps {
  data?: IArticleCategory
}

const getInitialValues = (data?: IArticleCategory) => {
  if (!data) return undefined
  return {
    ...data,
    category_parent: data?.parent?.slug
  }
}

const CategoryParentSelect = () => {
  const { options, ...props } = useSearchSelect({
    func: async (search = '') =>
      await getGenericList<IArticleCategory>('/kb/category', search)
  })

  return (
    <Col span={24}>
      <SearchSelectWithForm
        {...props}
        name="category_parent"
        required={false}
        allowClear
      >
        {Array.isArray(options)
          ? options.map(e => (
              <Select.Option key={e.slug} value={e.slug} children={e.name} />
            ))
          : null}
      </SearchSelectWithForm>
    </Col>
  )
}

const ArticleCategoryForm = () => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col span={24}>
        <InputWithForm label={t('NAME')} name="name" required={true} />
      </Col>
      <CategoryParentSelect />
    </Row>
  )
}
const ArticleCategoryModalFooter = () => {
  const form = Form.useFormInstance()
  const { t } = useTranslation()
  return (
    <Button
      htmlType="submit"
      onClick={form.submit}
      data-cy="submit-article-category"
    >
      {t('CONFIRM')}
    </Button>
  )
}

const handleSuccess = async (
  t: TFunction,
  messageApi?: MessageInstance,
  modalContext?: ModalContextType
) => {
  if (messageApi) await messageApi?.success(t('SUCCESSREQUEST'))
  if (modalContext?.onCancel) modalContext?.onCancel()
}

const requestCategory = async (values: any, data?: IArticleCategory) => {
  return data
    ? await api.put(`/kb/category/${data.slug}`, { slug: data.slug, ...values })
    : await api.post(`/kb/category`, values)
}

const useArticleCategoryModal = (data?: IArticleCategory) => {
  const context = useTableContext()
  const { t } = useTranslation()
  const modalContext = useGenericContext(ModalContext)
  const messageApi = useContext(MessageContext)

  const successRequest = async () => handleSuccess(t, messageApi, modalContext)

  const onFinish = async (values: any) => {
    await requestCategory(values, data)
      .then(async e => {
        await successRequest()
        context && data && context.update(data?.slug, e.data)
      })
      .catch(e => handleError(e, messageApi, 'ERROR'))
  }

  return { onFinish }
}

const ArticleCategoryModal = ({
  data,
  ...props
}: ArticleCategoryModalProps) => {
  const { t } = useTranslation()
  const { open, onCancel, onOpen } = useModal()
  const { onFinish } = useArticleCategoryModal(data)
  return (
    <ModalContext.Provider value={{ open, onCancel, onOpen }}>
      <Form initialValues={getInitialValues(data)} onFinish={onFinish}>
        <Modal
          {...{ open, onCancel }}
          title={`${data ? t('EDITARTICLE') : t('CREATEARTICLE')}`}
          footer={[<ArticleCategoryModalFooter />]}
        >
          <ArticleCategoryForm />
        </Modal>
        <Button
          {...props}
          onClick={onOpen}
          data-cy={`${data ? 'edit' : 'create'}-category`}
        />
      </Form>
    </ModalContext.Provider>
  )
}

export default ArticleCategoryModal
