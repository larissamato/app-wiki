import { Col, Statistic, Card, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import useSummary from '@hooks/useSummary'
import { IGraphStatiscCount, IGraphStatiscUrl } from '@/types/IGraphStatisc'

interface IGraphStatiscProps {
  func: () => Promise<IGraphStatiscCount[]>
  name: string
  summary: IGraphStatiscUrl[]
}

const GraphStatistc = ({ func, name, summary }: IGraphStatiscProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { data } = useSummary(func, name)

  return (
    <Row gutter={[24, 24]}>
      {summary.map(item => (
        <Col lg={12} md={24} xs={24} key={item.key}>
          <Card variant="borderless" style={{ backgroundColor: theme[item.color] }}>
            <Statistic
              title={<div style={{ color: 'white' }}>{t(`${item.label}`)}</div>}
              value={
                data ? data.find(count => count.key === item.key)?.count : 0
              }
              valueStyle={{ color: 'white' }}
              prefix={summary.icon}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}
export default GraphStatistc
