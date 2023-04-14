/**
 * ======= Usage =======
 * 1. import createHttp from 'http';
 * 2. const http = createHttp(httpConfig);
 * ======= Done!! ======
 *
 * httpConfig 配置项
 * {
 *   // axios自定义请求配置
 *   axios: <object> {
 *       // 接口超时时间（毫秒）
 *       timeout: <Int> 60000,
 *       // 请求时是否带cookie
 *       withCredentials: <Boolean> true,
 *       // http自定义请求头
 *       headers: <object> {}
 *       // 取消请求，传一个函数参数为取消的方法，直接执行即取消请求
 *       cancelToken: (cancelFn) => {cancelFn()}
 *       // 其他axios的配置
 *       ...
 *   },
 *   // 统一请求前拦截器，需要return request
 *   onRequest: <func> (request) => request
 *   // 统一请求成功拦截器
 *   onSuccess: <func> (result) => data
 *   // 统一请求失败拦截器
 *   onFailure: <func> (res) => res,
 *   // 自定义请求失败拦截器
 *   // interceptors: <func> (res) => res,
 * }
 *
 * 单http请求配置项
 * {
 *    // 错误信息
 *    errorMessage: <string>
 *    // 是否跳过统一失败拦截器
 *    skipRequest: <Boolean> false,
 *    // 是否跳过统一失败拦截器
 *    // 不跳过拦截错误，默认都是走then逻辑
 *    // 当设置为true时，表示需要自己捕获错误走catch逻辑
 *    skipFailure: <Boolean> false,
 *    // 是否跳过统一成功拦截器
 *    skipSuccess: <Boolean> false,
 *    // 自定义http请求头内容（会覆盖http里headers的内容）
 *    headers: <object> {}
 *    // 返回前回调
 *    onResponse: <func> (opts) => opts
 *    // 请求埋点
 *    // buryingPoint: <Func> res => res
 *    // 请求异常上报
 *    // noReport: <Boolean> false,
 * }
 */

import axios from 'axios'
import cookies from 'js-cookie'
import message from 'antd'

class CatchyPromise {
  _promise: Promise<any>
  _catchyPromise: Promise<any>
  then: any
  catch: any
  finally: any

  constructor(originalPromise: Promise<any>) {
    this._promise = originalPromise

    // 执行默认的catch 外部有自定义catch 会执行自定义catch并吞掉默认的
    this._catchyPromise = Promise.resolve()
      .then(() => this._promise)
      .catch((err) => {
        // 这边统一处理的接口层报错，是否需要上报 ？
        console.error('Request Error', err)
      })

    const methods = ['then', 'catch', 'finally']

    for (const method of methods) {
      this[method] = function (...args) {
        return new CatchyPromise(this._promise[method](...args))
      }
    }
  }
}

// 添加一些项目的请求头
// 但我不懂为啥要将cookie的值在放到请求头里
// 后台可以直接从cookie拿呀
const token = cookies.get('x-token')
const userId = cookies.get('x-user-id')
const tenantId = cookies.get('X-TENANT-ID')

// 这个是已经请求出去的取消，业务层处理
const CancelToken = axios.CancelToken
// 这个是请求拦截的，录用记录已发的请求
let requestList = {}
// 1秒以内重复请求会被取消
let timeout
const timeoutTime = 1000

// 默认axios配置
const axiosDefaultConfig = {
  timeout: 600000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
    ['x-token']: token,
    ['x-user-id']: userId,
    [constants.X_LANG]: lang
  }
}

// 初始化http配置
const initConfig = (config) => {
  const { axios = {}, ...params } = config
  const httpConfig = {
    axios: {
      ...axiosDefaultConfig,
      ...axios,
      headers: {
        ...axiosDefaultConfig.headers,
        ...axios.headers
      }
    },
    ...params
  }
  // 初始化环境变量
  // 生产环境去除字段
  if (process.env.NODE_ENV === 'production') {
    delete httpConfig.axios.headers['x-tenant-id']
  }
  // console.log(httpConfig);
  // console.log(process.env.NODE_ENV);
  return httpConfig
}

const cancelRequest = (request, Canceler) => {
  // 记录请求数据如果存在就拦截掉
  if (
    requestList.hasOwnProperty(request.url) &&
    requestList[request.url].data === JSON.stringify(request.data)
  ) {
    // 只能异步取消请求，同步无法取消请求
    setTimeout(requestList[request.url].cancelToken)
  }
  // 这个逻辑只拦截了post，参数为data
  requestList[request.url] = {
    data: JSON.stringify(request.data),
    cancelToken: Canceler
  }
  // 清除之前的定时器，生成一个新的定时器，将列表清除
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    requestList = {}
  }, timeoutTime)
}

// 拦截器
const interceptors = {
  // 请求前
  request: (request, httpConfig) => {
    // 请求拦截器前置逻辑
    const {
      errorMessage,
      skipRequest,
      skipFailure,
      skipSuccess,
      onResponse,
      cancelToken,
      disableCancel,
      ...params
    } = request
    const result = {
      ...params,
      cancelToken: disableCancel
        ? undefined
        : new CancelToken(
            cancelToken
              ? cancelToken
              : (Canceler) => cancelRequest(request, Canceler)
          ),
      extra: {
        errorMessage,
        skipFailure,
        skipSuccess,
        onResponse
        // noReport: !!request.noReport,
        // reportFilter: request.reportFilter
      }
    }
    // if (window.Perf) {
    //   opts = window.Perf.onRequest(opts) || opts;
    // }
    // 统一请求前拦截器
    if (
      httpConfig.onRequest &&
      typeof httpConfig.onRequest === 'function' &&
      !skipRequest
    ) {
      return httpConfig.onRequest(result)
    }
    // 请求拦截器后置逻辑
    return result
  },
  // http请求成功
  responseSuccess: (response, httpConfig) => {
    // console.log('responseSuccess', response);
    // 请求成功后response会有config,request,data,header等参数
    const {
      config: { extra = {} },
      data = {}
    } = response
    const { skipSuccess, onResponse } = extra
    // 单个请求的response回调
    if (onResponse && typeof onResponse === 'function' && !skipSuccess) {
      return onResponse(response)
    }
    // if (window.Perf) {
    //   window.Perf.afterRequest(response.data, response);
    // }
    // 这是后台数据格式，默认的response的data也是这个，所以没有改

    if (data.code === '0' || data.code === 200) {
      // 统一请求成功拦截器
      if (httpConfig.onSuccess && typeof httpConfig.onSuccess === 'function') {
        return httpConfig.onSuccess(response)
      }
      return data.result
    } else {
      // return Promise.reject(interceptors.responseError(response, httpConfig));
      return interceptors.responseError(response, httpConfig)
    }
  },
  // http请求失败
  responseError: (error, httpConfig) => {
    const response = error instanceof Error ? error.response || error : error
    // console.log('responseError', response);
    // 就算请求失败，正常情况下response会有config,request,data,header等参数
    // 取消请求不报错
    if (axios.isCancel(response)) {
      return Promise.reject(new Error('取消请求'))
    }

    if (response.config) {
      const {
        config: { extra = {} },
        data = {}
      } = response
      const { errorMessage } = extra
      // 报错信息处理
      response.errorMessage =
        errorMessage || data.message || I18N.dam_common.dam_common_request_error
      // 统一请求失败拦截器
      if (httpConfig.onFailure && typeof httpConfig.onFailure === 'function') {
        return httpConfig.onFailure(response)
      }
    }
    // if (window.Perf) {
    //   window.Perf.errorRequest(error, result);
    // }
    throw response
  }
}

// const httpException = (response, config) => {
//   // 自定义异常拦截器
//   if (config.interceptor && typeof config.interceptor === 'function') {
//     return config.interceptor(response);
//   }
//   console.log(response);
//   // 通用异常拦截器
//   const { code, msg = '网络错误', origin: { url, method, data, params, skipFailure, noReport, reportFilter } } = result;

// 401 = 未登录/登录过期  跳转登录页面
// if (code == 401 && !skipFailure) {
//   return window && window.location.replace(BASE_URL.YQN_PASSPORT + '?redirect=' + encodeURIComponent(window.location.href));
// }

// 请求失败信息上报
// 存在异常上报组件且noReport为false且错误码不为401的情况下允许上报异常
// if (reporter && !noReport && getReportFilter(res, reportFilter)) {
//   reporter.scope(scope => {
//     scope.setExtras({
//       requestUrl: url,
//       requestMethod: method,
//       requestOrigin: {
//         data: JSON.stringify(data),
//         params: JSON.stringify(params)
//       },
//       responseCode: code,
//       responseMsg: msg,
//       responseMsgDetail: res.msgDetail || null,
//       responseData: JSON.stringify(res.data) || null
//     });
//     scope.setTags({
//       requestUrl: url,
//       xTraceId: res.header && res.header.xTraceId || 0,
//       errorType: 'request error'
//     });
//     return new Error('request error');
//   });
// }
// 最终返回异常
// return response;
// };

const createHttp = (config = {}) => {
  const httpConfig = initConfig(config)
  // 生成请求实例
  const instance = axios.create(httpConfig.axios)
  // utils.getInstance(httpConfig);
  // 注册请求前拦截器
  instance.interceptors.request.use((request) =>
    interceptors.request(request, httpConfig)
  )
  // 注册请求后拦截器
  instance.interceptors.response.use(
    (response) => interceptors.responseSuccess(response, httpConfig),
    (err) => interceptors.responseError(err, httpConfig)
  )

  return {
    get httpConfig() {
      return httpConfig
    },

    get instance() {
      return instance
    },

    // 根据请求接口类型，处理data格式
    request(config) {
      // url添加前置
      const { url } = config
      const newUrl =
        url.indexOf('http') === 0 ? url : `${constants.API_ORIGIN}${url}`
      return new CatchyPromise(
        instance.request({
          ...config,
          url: newUrl
        })
      )
    },

    get(url, data = {}, config = {}) {
      config.method = 'get'
      config.url = url
      config.params = data
      return this.request(config)
    },

    // 修改delete 方法
    delete(url, data = {}, config = {}) {
      config.method = 'delete'
      config.url = url
      config.data = data
      return this.request(config)
    },

    post(url, data = {}, config = {}) {
      config.method = 'post'
      config.url = url
      config.data = data
      return this.request(config)
    },

    put(url, data = {}, config = {}) {
      config.method = 'put'
      config.url = url
      config.data = data
      return this.request(config)
    },

    patch(url, data = {}, config = {}) {
      config.method = 'patch'
      config.url = url
      config.data = data
      return this.request(config)
    },

    sendForm(url, data, { method = 'post', target = '_blank' } = {}) {
      const form = document.createElement('form')
      form.action = url
      form.method = method
      form.target = target

      const setFiled = (key, val) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = val
        form.appendChild(input)
      }

      for (const key in data) {
        setFiled(key, data[key])
      }

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  }
}

const http = createHttp({
  // 使用return，出错也能获取数据 - old
  // 统一再catch里获取数据 - new
  onFailure: (response) => {
    const {
      status,
      config: { skipToast }
    } = response
    // 499重定向
    if (status === 499) {
      if (!isPublicPage(window.location.href)) {
        cookies.remove(constants.COOKIE_X_TOKEN)
        cookies.remove(constants.COOKIE_X_USER_ID)
        cookies.remove(constants.C_XTENANTID)
        redirectToPageLogin()
      }
    } else if (!skipToast) {
      message.error(response.errorMessage)
    }
    // return data.result || {};
    throw response
  }
})
export default http
