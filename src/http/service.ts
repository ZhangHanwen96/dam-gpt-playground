/**
 * tezign ownership
 * @owner xuchengjian
 * @team M3
 */
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

export interface ISlot {
  config: {
    [key: string]: {
      component: string
    }
  }
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

/**
 * 获取插槽配置
 * @param params
 * @returns boolean
 */
export async function getSlotList() {
  return (await http.get<{ result: ISlot }>('/user/tenantConfig/switch/list'))
    .data.result
}
