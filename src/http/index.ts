import axios, { AxiosResponse } from 'axios'
import { cacheAdapterEnhancer, retryAdapterEnhancer } from 'axios-extensions'
import cookies from 'js-cookie'
import { message } from 'antd'
import constants from './costants'
import redirectToPageLogin from './redirectToLogin'

const token = cookies.get('x-token')
const userId = cookies.get('x-user-id')
const tenantId = cookies.get('X-TENANT-ID')

const axiosDefaultConfig = {
  timeout: 600000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
    [constants['X_TOKEN']]: token,
    [constants.X_USER_ID]: userId,
    [constants.X_LANG]: cookies.get(constants.X_LANG) || 'zh-CN'
  }
}

const initConfig = () => {
  const httpConfig = {
    axios: {
      ...axiosDefaultConfig,
      ...axios,
      headers: {
        ...axiosDefaultConfig.headers
      }
    }
  }
  // 初始化环境变量
  // 生产环境去除字段
  if (process.env.NODE_ENV === 'production') {
    delete httpConfig.axios.headers['x-tenant-id']
  }
  return httpConfig
}

const isPublicPage = (href: string) => {
  const homepage = /\/playground$/.test(href)

  // TODO: 优化
  return true || homepage
}

const createAxiosInstance = () => {
  // 生成请求实例
  const instance = axios.create({
    baseURL: constants.API_ORIGIN,
    timeout: 600000,
    ...initConfig(),
    adapter: retryAdapterEnhancer(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cacheAdapterEnhancer(axios.defaults.adapter, {
        enabledByDefault: false
      }),
      {
        times: 1
      }
    )
  })

  instance.interceptors.response.use(null, (err) => {
    const { response } = err
    const { status } = response as AxiosResponse
    // 499重定向
    if (status === 499) {
      if (!isPublicPage(window.location.href)) {
        cookies.remove(constants.COOKIE_X_TOKEN)
        cookies.remove(constants.COOKIE_X_USER_ID)
        cookies.remove(constants.C_XTENANTID)
        redirectToPageLogin()
      }
    } else {
      message.error(response.errorMessage)
    }
    // return data.result || {};
    throw response
  })

  return instance
}

export default createAxiosInstance()
