import { Spin } from 'antd'

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      height: '90vh',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}
    >
      <Spin size='large' />
    </div>
  )
}

export default Loader
