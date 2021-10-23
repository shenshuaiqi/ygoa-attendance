import axios from '@/libs/api.request'

const shrOrg = '/shrOrg'

export const login = ({userName, password}) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: '/api' + '/login',
    data,
    method: 'post'
  })
}

export const getUserInfoNoPass = userCode => {
  return axios.request({
    url: '/oa' + `${shrOrg}/getUserByUserCode`,
    method: 'get',
    params: {
      userCode
    }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/api' + '/get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/api' + '/logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: '/api' + '/message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: '/api' + '/message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: '/api' + '/message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: '/api' + '/message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: '/api' + '/message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: '/api' + '/message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/5/18
 * @Description: 选择用户模块获取部门信息
 * @Version: 1.0
 */
export const getDepts = depFatherPK => {
  return axios.request({
    url: '/oa' + '/shrOrg/getDept',
    method: 'get',
    params: {
      depFatherPK
    }
  })
}
export const getUserByDeptID = (data) => {
  return axios.request({
    url: '/oa' + '/shrOrg/getUser',
    method: 'get',
    params: data
  })
}
/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/5/19
 * @Description: 模糊查找
 * @Version: 1.0
 */
export const queryUserBycodeAndName = userCode => {
  return axios.request({
    url: '/oa' + '/shrOrg/getUser',
    method: 'get',
    params: {
      userCode
    }
  })
}

export const queryDept = () => {
  return axios.request({
    url: '/oaapi' + '/innovate-apiV2/v2/oa/sysDepartment/queryDepartment',
    method: 'get'
  })
}
