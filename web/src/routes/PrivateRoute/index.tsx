import { createBrowserRouter } from 'react-router-dom'
import Default from '@layouts/Default'
import ProtectedRoute from '@components/ProtectedRoute'
import Error from '@pages/Error'
import Users from '@pages/Users'
import PageWithParams from '@pages/PageWithParams'
import Logout from '@pages/Logout'
import Articles from '@pages/Articles'
import Article from '@pages/Article'
import CreateArticle from '@pages/CreateArticle'
import EditArticle from '@pages/EditArticle'
import ArticleCategories from '@pages/ArticleCategories'
import RedirectPage from '@components/common/RedirectPage'

const PrivateRoute = createBrowserRouter([
  {
    path: '/',
    element: <Default />,
    errorElement: <Error />,
    children: [
      {
        path: '*',
        element: <Error code={404} />
      },
      {
        path: '/',
        element: (
          <PageWithParams name="articles">
            <Articles />
          </PageWithParams>
        )
      },
      {
        path: '/articles/:slug',
        element: <Article />
      },
      {
        path: '/articles',
        element: <Articles />
      },
      {
        path: '/articles/create',
        element: <CreateArticle />
      },
      {
        path: '/articles/:slug/edit',
        element: <EditArticle />
      },
      {
        path: '/articles/categories',
        element: (
          <ProtectedRoute level={950}>
            <ArticleCategories />
          </ProtectedRoute>
        )
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/register',
    element: <RedirectPage to="/" />
  },
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: '*',
    element: <Error code={404} />
  }
])

export default PrivateRoute
