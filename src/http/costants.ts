import _tenantConfig from '@tezign/tenant-config'
const constants = {
  API_ORIGIN: _tenantConfig.value('API_ORIGIN'),
  API_SOCKET: _tenantConfig.value('API_SOCKET'),
  GETTING_DOWNLOAD_URL_MESSAGE: '正在获取下载链接，请耐心等待',
  GET_UPLOAD_FEED_URL:
    _tenantConfig.value('GET_UPLOAD_FEED_URL') ||
    ''.concat(
      _tenantConfig.value('API_ORIGIN'),
      '/resource-center/osService/public/policy'
    ),
  UPLOAD_RESOURCE_URL: ''.concat(
    _tenantConfig.value('API_ORIGIN'),
    '/resource-center/resBaseInfo/createResource'
  ),

  /** 获取用户云供应商 */
  MULTI_CLOUD_SERVICE_URL: ''.concat(
    _tenantConfig.value('API_ORIGIN'),
    '/resource-center/osService/public/getOsBasicInfo'
  ),

  /** 阿里云 上传 sdk 地址 */
  ALI_YUN_SDK_URL:
    _tenantConfig.value('ALIYUN_SDK_URL') ||
    'https://gosspublic.alicdn.com/aliyun-oss-sdk-6.8.0.min.js',

  /** 腾讯云 上传sdk 地址 */
  TENCENT_SDK_URL:
    _tenantConfig.value('TENCENT_SDK_URL') ||
    'https://unpkg.com/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js',

  /** 租户多云配置 存储locastorage key; 移除非租户化配置 */
  MULTI_CLOUD_KEY: 'multi_cloud_key',

  /** sdk script id */
  CLOUD_SDK_SCRIPT_ID: 'cloud_sdk',
  COOKIE_X_USER_ID: 'vmsxuid',
  COOKIE_X_TOKEN: 'vmsxtoken',
  C_XTENANTID: 'xtenantid',
  X_LANG: 'x-lang',
  X_USER_ID: 'X-User-Id',
  X_TOKEN: 'X-Token',
  GLOBAL_USER_ID: 'globalUserId',
  COOKIE_DOMAIN: window?.location?.host,
  CACHE_KEYS: {
    CURRENT_USER: 'userInfo',
    PROJECT_LOCATION_LIST: 'project_location_list',
    PROJECT_LOCATION_TREE: 'project_location_tree',
    LANG: 'lang',
    HIDE_DESIGN_COLLECT_TIP: 'hide_design_collect_tip',
    WORK_REVIEW_ACCESS_TOKEN: 'work_review_access_token'
  },
  PREVIEW_PAGE_FOR_3D: _tenantConfig.value('PREVIEW_PAGE_FOR_3D'),

  /** autodesk 3d模型服务器的bucket，上传时候使用 */
  BUCKET_KEY_FOR_3D: _tenantConfig.value('BUCKET_KEY_FOR_3D'),

  /** 主导航栏的高度 */
  PRIMARY_NAVIGATION_HEIGHT: 52,

  /** 次导航栏的高度 */
  MINOR_NAVIGATION_HEIGHT: 52,

  /** 短期内不要多次弹窗提示框，一般在网站升级提示中用到，如果不同网站总共有好几个提示弹框，切换时会多次弹框 */
  NOT_POP_UP_DIALOG: 'not_pop_up_dialog'
}

export default constants
