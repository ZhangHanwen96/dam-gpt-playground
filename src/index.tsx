import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
  useLocation,
  useOutlet
} from 'react-router-dom'
import 'tailwindcss/tailwind.css'
import App from '@/components/App'
import ErrorPage from '@/pages/ErrorPage'
import PlaygroudApp from '@/pages/PlaygroundApp'
import Home from '@/pages/Home'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import ChatPDF from './components/playground-apps/ChatPDF'
import './preflight.css'
import './index.css'
import { Button, Result } from 'antd'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorPage />,

    Component: () => {
      // const currentOutlet = useOutlet()
      const location = useLocation()
      // const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {}

      return (
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.key}
            unmountOnExit
            classNames="page"
            timeout={300}
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
        path: 'playground',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: ':type',
            element: <PlaygroudApp />
          }
        ]
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

const router = createBrowserRouter(routes, {
  basename: import.meta.PROD ? '/playground' : ''
})

root.render(<RouterProvider router={router} />)
