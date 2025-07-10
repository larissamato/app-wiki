import { createBrowserRouter } from 'react-router-dom'
import Login from '@pages/Login'
import Register from '@pages/Register'
import TicketRating from '@pages/TicketRating'
import ForgotPassword from '@pages/ForgotPassword'
import Logout from '@pages/Logout'
import FirstLogin from '@pages/FirstLogin'
import ResetPassword from '@pages/ResetPassword'
import Floauth from '@pages/Floauth'

const PublicRoute = createBrowserRouter([
  {
    path: '*',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: '/fl/:uuid',
    element: (
      <FirstLogin />
    )
  },
  {
    path: '/floauth',
    element: (
      <Floauth />
    )
  },
  {
    path: '/reset-password',
    element: (
      <ResetPassword />
    )
  },
])

export default PublicRoute
