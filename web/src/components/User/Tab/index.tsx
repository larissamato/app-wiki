import { generateTabItem } from '@components/common/Tab'
import { TabsProps } from 'antd'
import { usersColumns } from '@components/User/Table'
import { useTranslation } from 'react-i18next'

export const renderingTabFilter = (uuid = '') => {
  const { t } = useTranslation()
  const [columns, inativeUsersColumns] = usersColumns
  const filter = uuid.length ? `?entity=${uuid}` : ''
  const renderingWithTab: TabsProps['items'] = [
    generateTabItem(
      { key: '1', label: t('CLIENTS'), url: `/user${filter}` },
      columns
    ),
    generateTabItem(
      {
        key: '2',
        label: t('INACTIVES'),
        url: `/user${filter ? `${filter}&` : '?'}inactive=1`
      },
      inativeUsersColumns
    )
  ]
  return renderingWithTab
}