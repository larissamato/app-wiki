import { TabsProps } from "antd"
import { TFunction } from "i18next"

const translateTabs = (tabs: TabsProps['items'], t: TFunction): TabsProps['items'] => {
  return tabs?.map((item => ({
    ...item,
    label: t(String(item?.label))
  })))
}

export default translateTabs
