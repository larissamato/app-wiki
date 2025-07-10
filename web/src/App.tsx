import UserProvider from '@contexts/UserContext'
import ClientMonitor from 'skywalking-client-js'
import { useEffect } from 'react'
import skywalking from '@constants/skywalking'
import { clearCache } from '@helpers/clearCache'
function App() {
  useEffect(() => {
    ClientMonitor.setPerformance(skywalking)
    clearCache()
  }, [window.location.pathname])
  return <UserProvider />
}

export default App
