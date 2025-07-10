import { ArticleContext } from '@contexts/ArticleContext'
import { useGenericContext } from '@hooks/useGenericContext'
import { Avatar } from 'antd'
import { useTheme } from 'styled-components'

const ArticleAvatar = () => {
  const { data } = useGenericContext(ArticleContext)
  const theme = useTheme()
  const src =
    data?.created_by?.sprite !== null ? localStorage.getItem('sprite') : null
  return (
    <Avatar
      style={{ backgroundColor: theme.blue }}
      src={
        data?.created_by?.sprite && (
          <img
            src={`data:image/png;base64,${src}`}
            style={{
              objectPosition: `-${data?.created_by?.sprite?.x / 4.267}px`
            }}
          />
        )
      }
    >
      {data?.created_by?.name?.charAt(0)}
    </Avatar>
  )
}

export default ArticleAvatar
