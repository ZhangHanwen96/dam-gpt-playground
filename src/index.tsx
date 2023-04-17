import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
  useLocation
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Button, Result } from 'antd'

import App, { AuthProvider } from '@/components/App'
import ErrorPage from '@/pages/ErrorPage'
import Home from '@/pages/Home'
import TenantLogin from '@/pages/TenantLogin'

import './preflight.css'
import 'tailwindcss/tailwind.css'
import './index.scss'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorPage />,
    Component: function PageTransition() {
      const location = useLocation()

      return (
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            unmountOnExit
            classNames="page"
            timeout={300}
            onEnter={() => {
              document.body.classList.add('page-transition-active')
            }}
            onExited={() => {
              document.body.classList.remove('page-transition-active')
            }}
          >
            <Outlet />
          </CSSTransition>
        </TransitionGroup>
      )
    },
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'apps',
        element: (
          <AuthProvider>
            <App />
          </AuthProvider>
        ),

        errorElement: <ErrorPage />,
        children: [
          {
            path: ':type',
            lazy: async () => {
              const { default: Component } = await import(
                './pages/PlaygroundApp'
              )
              return {
                Component
              }
            }
          }
        ]
      },
      {
        path: 'tenant-login',
        element: <TenantLogin />
      },
      {
        path: '*',
        Component: () => {
          return (
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={<Button type="primary">Back Home</Button>}
            />
          )
        }
      }
    ]
  }
]

/**
 * asdasdaa
 */

const router = createBrowserRouter(routes, {
  basename: '/playground'
})

root.render(<RouterProvider router={router} />)
