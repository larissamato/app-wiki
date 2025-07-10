import { Tag as ATag, TagProps } from 'antd'

const Tag = (props: TagProps) => {
  return (
    <ATag
      style={{
        padding: 2,
        paddingLeft: 4,
        paddingRight: 4,
        gap: 4,
        marginTop: 4,
        marginBottom: 4,
        display: 'inline-flex',
        alignItems: 'center'
      }} {...props}
    />
  )
}

export default Tag
