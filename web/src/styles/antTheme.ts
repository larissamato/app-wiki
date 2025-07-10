import { theme } from 'antd'

const { defaultAlgorithm, darkAlgorithm } = theme

const altered = {
  fontSizeHeading1: 25,
  fontSizeHeading2: 22,
  fontWeightStrong: 300,
  lineHeightHeading1: 1,
  titleMarginBottom: '0px'
}

const changedComponents = {
  Steps: {
    descriptionMaxWidth: 70,
  },
  Button: {
    colorPrimary: '#232020',
  },
  Input: {
    colorPrimary: '#232020',
    defaultActiveBorderColor: '#232020',

    algorithm: true,
  },
  Menu: {
    colorPrimary: '#232020',
    defaultActiveBorderColor: '#232020',
    colorBgContainer: '#232020',
    algorithm: true,
  }
}

const light = {
  algorithm: defaultAlgorithm,
  token: altered,
  components: changedComponents
}

const dark = {
  algorithm: darkAlgorithm,
  token: altered,
  components: changedComponents
}

export { light, dark }
