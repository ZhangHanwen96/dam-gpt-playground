/**
 * tezign ownership
 * @owner xuchengjian
 * @team M3
 */
import cookies from 'js-cookie'
import constants from './costants'
import { getSSOAuthUrlForTenant } from '@tezign/foundation-common/lib/utils/auth'
import { fetchTenantInfo } from './service'

async function redirectToPageLogin(redirectUrl?: string) {
  let tenantId = cookies.get(constants.C_XTENANTID) as string
  if (!tenantId) {
    const tenantData = await fetchTenantInfo()
    tenantId = tenantData?.tenantId
    cookies.set(constants.C_XTENANTID, tenantId!, { expires: 365 })
  }
  getSSOAuthUrlForTenant({
    tenantId,
    redirectUrl: redirectUrl || location.href,
    lang: cookies.get(constants.X_LANG)
  }).then((url: string) => {
    if (url) {
      location.href = url
    }
  })
}

export default redirectToPageLogin
