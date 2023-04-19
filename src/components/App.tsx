/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, ConfigProvider, Spin, theme } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import 'antd/dist/reset.css'
import useTheme from '@/hooks/useTheme'
import './App.css'
import {
  generateAuthBySSOTzCode,
  SSOLoginPlatformType,
  hasSSOLogin
} from '@tezign/foundation-common/lib/utils/auth'
import IconMdiSunny from '~icons/mdi/white-balance-sunny'
import IconMdiMoon from '~icons/mdi/moon-waning-crescent'
import { FC } from 'react'
import redirectToPageLogin from '@/http/redirectToLogin'
// import http from '@/http'
// import axios from 'axios'

const { darkAlgorithm, defaultAlgorithm } = theme

function App() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()

  const { toggleTheme, theme } = useTheme()
  console.log(theme)

  return (
    <ConfigProvider
      theme={{
        token: {},
        algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm
      }}
    >
      <div className="relative h-screen w-screen overflow-hidden">
        <nav className="nav-header flex h-[var(--navbar-h)] w-full items-center bg-light-0 px-4 dark:bg-dark-0 md:px-24 lg:px-48">
          <button
            onClick={() => {
              navigate('/')
            }}
            className="whitespace-nowrap rounded bg-transparent px-4 py-2 text-sm text-dark-10 transition-colors duration-150 hover:bg-light-4 dark:hover:bg-dark-4"
          >
            <RollbackOutlined className="text-xl text-dark-0 dark:text-light-0" />
          </button>
          {/* <Switch
            checked={theme === 'dark'}
            unCheckedChildren={'☀️'}
            checkedChildren={'🌙'}
            // @ts-ignore
            onChange={() => toggleTheme()}
            className="ml-auto"
          /> */}
          <Button
            className="ml-auto text-lg"
            shape="circle"
            icon={
              theme === 'dark' ? (
                <IconMdiSunny className="m-auto text-dark-0 dark:text-light-0" />
              ) : (
                <IconMdiMoon className="m-auto -rotate-45 text-dark-0 dark:text-light-0" />
              )
            }
            ghost
            onClick={() => toggleTheme()}
          />
          <h4 className="absolute left-1/2 -translate-x-1/2 text-[26px] font-semibold dark:text-dark-10">
            {type}
          </h4>
        </nav>
        <main
          className="relative flex w-full overflow-hidden"
          style={{
            height: 'calc(100vh - var(--navbar-h))'
          }}
        >
          {/* {!isHome && (
            <div className="sidebar h-full w-[250px] bg-slate-400"></div>
          )} */}

          {/* <div className="relative h-full w-full overflow-y-scroll px-10 py-4 xl:px-60"> */}
          <Outlet />
          {/* </div> */}
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App

export const AuthProvider: FC<{ children: any }> = ({ children }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateAuthBySSOTzCode(SSOLoginPlatformType.Vms)
      .then((ssoInfo) => {
        console.log(ssoInfo, 'ssoInfo')
        console.log(hasSSOLogin(SSOLoginPlatformType.Vms))
        if (!ssoInfo) {
          redirectToPageLogin()
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return loading ? (
    <div className="m-auto flex h-screen w-full bg-dark-2 text-center">
      <Spin size="large" spinning={loading} />
    </div>
  ) : (
    children
  )
}
