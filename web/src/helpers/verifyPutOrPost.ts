import { useTranslation } from "react-i18next"

function verifyPutOrPost(data: any) {
  let updateFlag = data ? true : false
  
  const { t } = useTranslation()
  return updateFlag ? `${t('PRODUCT')} ${data.name} ${t('UPDATED')}` : t('PRODUCTCREATED')
}

export default verifyPutOrPost
