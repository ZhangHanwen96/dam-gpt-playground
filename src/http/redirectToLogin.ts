import cookies from 'js-cookie'
import constants from './costants'
import { getSSOAuthUrlForTenant } from '@tezign/foundation-common/lib/utils/auth'
import { fetchTenantInfo } from './service'
import showModal from '@/components/show-modal'
import { redirect } from 'react-router-dom'

async function redirectToPageLogin(redirectUrl?: string) {
  let tenantId = cookies.get(constants.C_XTENANTID) as string
  const {
    location: { pathname, search, origin },
  } = window;

  // if (!tenantId) {
  //   const tenantData = await fetchTenantInfo()
  //   window.alert(tenantData)
  //   tenantId = tenantData?.tenantId
  //   cookies.set(constants.C_XTENANTID, tenantId!, { expires: 365 })
  // }
  // No tenant id => prompt user to get tenant id
  if(!tenantId) {
      return redirect('/tenant-login')
  }


  getSSOAuthUrlForTenant({
    tenantId: 't5',
    redirectUrl: redirectUrl || `${origin}${pathname}${search}`,
    lang: cookies.get(constants.X_LANG) || 'zh-CN'
  }).then((url: string) => {
    if (url) {
      location.href = url
    }
  })
}

export default redirectToPageLogin
