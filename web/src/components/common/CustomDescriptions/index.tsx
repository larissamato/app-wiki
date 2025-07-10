import { DescriptionsProps } from 'antd'
import Descriptions from '@components/common/Descriptions'

interface CustomDescriptions extends DescriptionsProps {
  dataSource: any
  columns: any
}

const CustomDescriptions = (props: CustomDescriptions) => {
  return (
    <Descriptions
      bordered
      size="small"
      column={{ xs: 1, sm: 2, md: 3, xl: 4 }}
      {...props}
    />
  )
}

export default CustomDescriptions
