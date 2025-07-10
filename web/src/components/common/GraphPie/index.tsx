import { Pie } from '@ant-design/plots'
import { IPie } from '@/types/IGraphPie'
import useSummary from '@hooks/useSummary'
import { useTheme } from 'styled-components'

interface PieProps {
  func: () => Promise<IPie[]>
  colors: string[]
  name: string
}

const GraphPie = ({ func, colors, name }: PieProps) => {
  const { data } = useSummary(func, name)
  const theme = useTheme()
  const config = {
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: (d: IPie) => `${d.value}`,
      position: 'outside',
      fill: theme.text,
      connectorStroke: theme.text
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
        itemLabelFill: theme.text
      }
    },
    scale: { color: { palette: colors } }
  }
  return <>{data && <Pie data={data} {...config} />}</>
}

export default GraphPie
