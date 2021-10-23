/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/6/9
 * @Description: 考勤区域，点位
 * @Version: 1.0
 */

import config from '@/config'
import axios from '@/libs/api.request'
import http from '@/libs/http'
const baseUrl = process.env.NODE_ENV === 'development' ? config.testoa.dev : config.testoa.pro
const reqUrl = baseUrl + 'innovate-api3/v3'

const attendanceConfig = '/attendanceConfig'
const attendance = '/attendance'
const download = '/download'
const kqScheduleGroup = '/kqScheduleGroup'

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/1/8
 * @Description: 考勤配置
 * @Version: 1.0
 */
export const savePoint = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/point`,
    method: 'post',
    data
  })
}

export const editPoint = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/point`,
    method: 'put',
    data
  })
}

export const queryPoint = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/point/list`,
    method: 'get',
    params: data
  })
}
export const pointInfo = id => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/point/${id}`,
    method: 'get'
  })
}
export const deletePoint = id => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/point/${id}`,
    method: 'delete'
  })
}

export const district = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/district`,
    method: 'post',
    data
  })
}

export const deleteDistrict = id => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/district/${id}`,
    method: 'delete'
  })
}

export const queryDistrict = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/district/list`,
    method: 'get',
    params: data
  })
}

export const districtInfo = id => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/district/${id}`,
    method: 'get'
  })
}

export const editDistrict = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/district`,
    method: 'put',
    data
  })
}

export const queryPointListByUsercode = (data) => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/queryPointList`,
    method: 'get',
    params: data
  })
}

export const attendNum = () => {
  return axios.request({
    url: '/oa' + `${attendance}/attendNum`,
    method: 'get'
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/6/24
 * @Description: 出勤率
 * @Version: 1.0
 */
export const attendCurrentMonthNum = () => {
  return axios.request({
    url: '/oa' + `${attendance}/attendCurrentMonthNum`,
    method: 'get'
  })
}

export const attendByYear = () => {
  return axios.request({
    url: '/oa' + `${attendance}/attendByYear`,
    method: 'get'
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/9/11
 * @Description: 考勤组人员列表
 * @Version: 1.0
 */
export const attendanceUserList = data => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/user/list`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/9/11
 * @Description: 人员绑定考勤组
 * @Version: 1.0
 */
export const updateUserDistrict = data => {
  return axios.request({
    url: '/oa' + `${attendanceConfig}/user/updateDistrict`,
    method: 'put',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/10/10
 * @Description: 获取考勤结果
 * @Version: 1.0
 */
export const queryResult = data => {
  return axios.request({
    url: '/oa' + `${download}/queryResult`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/7
 * @Description: 保存排班组
 * @Version: 1.0
 */
export const saveGroup = data => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/saveGroup`,
    method: 'post',
    data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/8
 * @Description: 修改排班组
 * @Version: 1.0
 */
export const editGroup = data => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/editGroup`,
    method: 'put',
    data
  })
}


/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/7
 * @Description: 查部门带权限
 * @Version: 1.0
 */
export const getDept = depFatherPK => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/getDept`,
    method: 'get',
    params: {
      depFatherPK
    }
  })
}

export const getChild = deptId => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/getChild`,
    method: 'get',
    params: {
      deptId
    }
  })
}


/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/8
 * @Description: 排班组列表
 * @Version: 1.0
 */
export const getGroupList = data => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/getGroupList`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/8
 * @Description: 根据id查询排班组
 * @Version: 1.0
 */
export const getGroup = data => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/getGroup`,
    method: 'get',
    params: data
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2021/4/8
 * @Description: 根据id删除排班组
 * @Version: 1.0
 */
export const deleteGroup = data => {
  return axios.request({
    url: '/oa' + `${kqScheduleGroup}/deleteGroup`,
    method: 'delete',
    params: data
  })
}

/**
 * @author Yanfei Zhu<zhuyafei0210@outlook.com>
 * @date 2021/7/19
 * @Description: 根据data查询
 * @Version: 1.0
 */
 export const getAllPersonSignRecord = date => {
  return http.request({
    url: reqUrl+'/oa' + `${attendance}/getAllPersonSignRecord/${date}`,
    method: 'get'
  })
}

/**
 * @author Yanfei Zhu<zhuyafei0210@outlook.com>
 * @date 2021/7/29
 * @Description: 根据data查询
 * @Version: 1.0
 */
 export const getNewPersonSignRecordGroup = date => {
  return http.request({
    url: reqUrl+'/oa' + `${attendance}/getNewPersonSignRecordGroup/${date}`,
    method: 'get'
  })
}

/**
 * @author Yanfei Zhu<zhuyafei0210@outlook.com>
 * @date 2021/7/19
 * @Description: 班组点名管理
 * @Version: 1.0
 */
 export const addNewPersonSignRecordGroup = data => {
  return http.request({
    url: reqUrl+'/oa' + `${attendance}/addNewPersonSignRecordGroup`,
    method: 'post',
    data
  })
}
