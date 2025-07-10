import { useTranslation } from 'react-i18next'

const TranslateText = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  return <span>{t(name)}</span>
}

export default TranslateText
