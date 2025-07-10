import { AxiosError } from 'axios'
import Loader from '@common/Loader'
import ErrorElement from '@common/ErrorElement'
interface RenderPageProps {
  children: any
  data: any
  error?: AxiosError | string
  loading: boolean
}

const ErrorPage = ({ status }: { status: any }) => {
  const containerStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <div style={containerStyle}>
      <ErrorElement
        error={status}
        status={status.response}
        title={status.response?.status}
        subTitle={status.response?.data?.message}
      />
    </div>
  )
}

const RenderPage = ({ data, error, loading, children }: RenderPageProps) => {
  return (
    <>
      {loading && !data ? <Loader /> : null}
      {!loading && data && !error ? <>{children}</> : null}
      {!loading && error ? <ErrorPage status={error} /> : null}
    </>
  )
}

export default RenderPage
