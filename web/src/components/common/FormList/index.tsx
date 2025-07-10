import { useTranslation } from 'react-i18next'
import { Form, Col, Button } from 'antd'
import { IFormList } from '@/types/IFormList'

interface FormListProps {
  name: string
  label: string
  children: (props: IFormList) => JSX.Element
}
const FormList = ({ name, label, children }: FormListProps) => {
  const { t } = useTranslation()
  return (
    <Col xs={{ span: 24 }} xl={{ span: 12 }} style={{ marginBottom: '20px' }}>
      <Form.List name={name}>
        {(fields, { remove, add }) => (
          <>
            {fields.map((field, index) => children({ field, remove, index }))}
            <Button block onClick={() => add()} type="dashed">
              {t(label)}
            </Button>
          </>
        )}
      </Form.List>
    </Col>
  )
}

export default FormList
