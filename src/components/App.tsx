/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConfigProvider, Switch, theme } from 'antd'
import { RollbackOutlined, LeftOutlined } from '@ant-design/icons'
import { useLocation, Outlet, useNavigate, useParams } from 'react-router-dom'
import 'antd/dist/reset.css'
import Home from 'pages/Home'
import useTheme from '@/hooks/useTheme'
import './App.css'
import {
  generateAuthBySSOTzCode,
  SSOLoginPlatformType
} from '@tezign/foundation-common/lib/utils/auth'
import ThemeButton from './ThemeButton'

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
          <Switch
            checked={theme === 'dark'}
            unCheckedChildren={'☀️'}
            checkedChildren={'🌙'}
            // @ts-ignore
            onChange={() => toggleTheme()}
            className="ml-auto"
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

const initApp = async () => {
  const ssoType = SSOLoginPlatformType.Vms
  await generateAuthBySSOTzCode(ssoType)
  // await initGlobalUserId();
  // 499 => redirect
}
