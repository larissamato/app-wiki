import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import Icon from '../Icon'
import { IClearFilterProps } from '@types/IClearFilterButton'

const ClearFilterButton = ({ item, uri, ...props }: IClearFilterProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const shouldRenderButton = window.location.href.includes(`${uri}?`)

  const onClear = () => {
    localStorage.removeItem(item)
    navigate(uri)
  }

  return shouldRenderButton ? (
    <Button
      {...props}
      type="primary"
      icon={<Icon name="fa-light fa-trash" color="white" />}
      onClick={onClear}
      data-cy={'clear-filter-button'}
    >
      {t('CLEARFILTERS')}
    </Button>
  ) : null
}

export default ClearFilterButton
