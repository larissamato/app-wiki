import { useEffect, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Result, Button } from "antd"
import { ResultProps } from "antd"
import skywalking from '@constants/skywalking'
import ClientMonitor from 'skywalking-client-js'

interface ErrorElementProps extends ResultProps {
  error: any
}


const ErrorElement = ({error, title, subTitle,...props}: ErrorElementProps) => {
  const {t} = useTranslation()
  useEffect(() => {
    ClientMonitor.reportFrameErrors(skywalking, error);
  },[error])
  return (
    <Result
      {...props}
      status={error?.status || 500}
      title={ title ? title : t('OHNO')}
      subTitle={subTitle ? subTitle : t('THISLINKISNOTVALID')}
      extra={
        <Link to='/'>
          <Button data-cy='error-page' type='primary' >
            {t('BACKHOME')}
          </Button>
        </Link>
      }
    />
  )
}

export default ErrorElement
