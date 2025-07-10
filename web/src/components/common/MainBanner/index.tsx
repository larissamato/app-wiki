import { Col, Space } from "antd"
import { Logo } from '../../../pages/Login/style.js'
import useWindowResize from "@hooks/useWindowResize"

const MainBanner = () => {
  const { width } = useWindowResize()
  return (
    <Col
      sm={{ span: 24 }}
      xs={{ span: 24 }}
      lg={{ span: 12 }}
      style={{
        height: `${width > 720 ? '100vh' : '40vh'}`,
        backgroundColor: '#232020',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Space
        direction="vertical"
        style={{ textAlign: 'center' }}
      >
        <Logo src="/assets/images/logo2.png" />
      </Space>
    </Col>
  )
}

export default MainBanner
