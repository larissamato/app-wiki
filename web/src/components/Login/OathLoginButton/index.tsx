import { Button } from "antd"
import { GoogleOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"

const API = import.meta.env.VITE_OPEN_URL
  ? import.meta.env.VITE_OPEN_URL
  : 'dev-api.opendata.center'

const OauthLoginButton = () => {
  const { t } = useTranslation()
  return (
    <a href={`${API}/oauth`}>
      <Button
        icon={<GoogleOutlined />}
        block
      >
        {t('LOGINWITHGOOGLE')}
      </Button>
    </a>
  )
}

export default OauthLoginButton
