/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/9/17
 * @Description: 人事同步
 * @Version: 1.0
 */

import axios from '@/libs/http'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.shrUrl.dev : config.shrUrl.pro
const version = '/v3/oa/'
const reqUrl = baseUrl + 'innovate-sync'
const sync = 'shrOrg'
const putSync = 'sysOrg'

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/9/17
 * @Description: 部门同步
 * @Version: 1.0
 */
export const syncDept = data => {
  return axios.request({
    url: `${reqUrl}${version}${sync}/syncDept`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/9/17
 * @Description: 人员同步
 * @Version: 1.0
 */
export const syncUser = data => {
  return axios.request({
    url: `${reqUrl}${version}${sync}/syncUser`,
    method: 'get',
    params: data
  })
}

export const putSyncUser = data => {
  return axios.request({
    url: `${reqUrl}${version}${putSync}/syncUser`,
    method: 'get',
    params: data
  })
}

