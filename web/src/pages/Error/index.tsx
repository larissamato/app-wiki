import { useEffect } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';
import { Layout } from 'antd'
import ErrorElement from '@common/ErrorElement'
import { useTheme } from 'styled-components'


const Container = Layout

const Error = ({ manualError, code }: {
  manualError?: string
  code?: number
}) => {
  const theme = useTheme()
  const error = useRouteError()
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('floauth')) {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Container style={{
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: theme?.background
    }}>
      {!location.pathname.includes('floauth') &&
        <ErrorElement
          error={error ? error : { status: code }}
          title={manualError}
          subTitle={error ? String(error) : ''}
        />
      }
    </Container>
  )
}


export default Error

