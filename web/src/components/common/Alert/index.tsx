import { Alert as AntAlert, AlertProps } from 'antd'
import { queryListWithFilter } from '@helpers/QueryListWithFilter'

const Alert = (props: AlertProps) => {
  const { data, isSuccess } = queryListWithFilter('/ticket?status=PENDING')

  return (
    <>
      {isSuccess && data.data?.length > 0 ? (
        <AntAlert
          message="Há chamado(s) pendente(s)"
          type="warning"
          showIcon
          closable
          {...props}
        />
      ) : null}
    </>
  )
}

export default Alert
