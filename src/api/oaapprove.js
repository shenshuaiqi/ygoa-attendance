/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/1/13
 * @Description: oa审批（V2）
 * @Version: 1.0
*/
import axios from '@/libs/http'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.oaApprove.dev : config.oaApprove.pro
const version = '/v2/oa/'
const reqUrl = baseUrl + 'innovate-apiV2'
const kqBkApply = 'kqBkApply'


/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/1/13
 * @Description: 查询补卡记录
 * @Version: 1.0
*/
export const queryKqBk = data => {
  return axios.request({
    url: `${reqUrl}${version}${kqBkApply}/queryKqBk`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/1/13
 * @Description: 导出
 * @Version: 1.0
*/
export const downKqBk = data => {
  return axios.request({
    url: `${reqUrl}${version}${kqBkApply}/downKqBk`,
    method: 'get',
    params: data
  })
}

export const queryKqBkDetail = data => {
  return axios.request({
    url: `${reqUrl}${version}${kqBkApply}/queryKqBkDetail`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/1/13
 * @Description: 查询补卡部门
 * @Version: 1.0
*/
export const getShrDept = () => {
  return axios.request({
    url: `${reqUrl}${version}${kqBkApply}/getShrDept`,
    method: 'get'
  })
}


