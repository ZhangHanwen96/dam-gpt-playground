import cookies from 'js-cookie'
import constants from './costants'
import { getSSOAuthUrlForTenant } from '@tezign/foundation-common/lib/utils/auth'
import { fetchTenantInfo } from './service'

async function redirectToPageLogin(redirectUrl?: string) {
  let tenantId = cookies.get(constants.C_XTENANTID) as string
  const {
    location: { pathname, search, origin },
  } = window;
  if (!tenantId) {
    const tenantData = await fetchTenantInfo()
    window.alert(tenantData)
    tenantId = tenantData?.tenantId
    cookies.set(constants.C_XTENANTID, tenantId!, { expires: 365 })
  }

  getSSOAuthUrlForTenant({
    tenantId,
    redirectUrl: redirectUrl || `${origin}${pathname}${search}`,
    // lang: cookies.get(constants.X_LANG) || 'zh-CN'
  }).then((url: string) => {
    if (url) {
      location.href = url
    }
  })
}

export default redirectToPageLogin
