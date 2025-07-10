import { Tabs, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import Icon from '@common/Icon'
import { useTheme } from 'styled-components'
import { renderingTabFilter } from '@components/User/Tab'
import ModalUser from '@components/User/Modal'
import SearchByQueryInput from '@common/SearchByQueryInput'
import Title from '@components/common/Title'
export const CreateUser = ({
  data
}: {
  data: { companies: [{ uuid: string }]; entity: { uuid: string } } | undefined
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Col xs={{ span: 24 }} xl={{ span: 3, offset: 3 }}>
      <ModalUser
        data={data}
        title={t('CREATEUSER')}
        type="primary"
        action="create"
        id="createuser"
        children={t('CREATEUSER')}
        style={{ background: theme.green }}
        icon={<Icon name="fal fa-user-plus" color="white" />}
        block
      />
    </Col>
  )
}

const Users = () => {
  const { t } = useTranslation()
  const renderingWithTab = renderingTabFilter()
  return (
    <>
      <Title name={t('USERS')} />
      <Row justify="space-between" gutter={[8, 8]}>
        <SearchByQueryInput />
        <CreateUser />
      </Row>
      <Tabs
        destroyOnHidden={true}
        defaultActiveKey="1"
        items={renderingWithTab}
        type="card"
        size="large"
      />
    </>
  )
}

export default Users
