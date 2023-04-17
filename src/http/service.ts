import http from '.'

export interface ITenant {
  aiAbility: number
  ruleCheckAbility: number
  brandId: number
  contactsEmail: string
  emailFromName: string
  emailFromNameAlias: string
  emailFromPre: string
  emailTenantImg: string
  emailTitle: string
  siteDescription: string
  siteIcon: string
  siteKeywords: string
  siteTitle: string
  siteUrl: string
  systemFullName: string
  systemFullNameAlias: string
  systemShortName: string | null
  systemShortNameAlias: string
  tenantId: string
  tenantName: string
  tenantNameAlias: string
  customMade?: string[]
  logo: string
}

export async function fetchTenantInfo() {
  return (
    await http.get<{ result: ITenant }>('/user/public/baseinfo/get', {
      params: {
        noAuth: true
      }
    })
  ).data.result
}
