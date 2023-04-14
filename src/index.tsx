import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'tailwindcss/tailwind.css'
import App from '@/components/App'
import ErrorPage from '@/pages/ErrorPage'
import PlaygroudApp from '@/pages/PlaygroundApp'
import Home from '@/pages/Home'
import ChatPDF from './components/playground-apps/ChatPDF'
import './preflight.css'
import './index.css'
import { Button, Result } from 'antd'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <ErrorPage />,
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
  ],
  {
    basename: import.meta.PROD ? '/playground' : ''
  }
)

root.render(<RouterProvider router={router} />)
