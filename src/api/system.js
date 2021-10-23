/**
 * @author Qifan Huang<hqf0924@outlook.com>
 * @date 2020/6/2
 * @Description: 系统配置功能
 * @Version: 1.0
 */

import axios from '@/libs/api.request'

const menu = '/menu'
const role = '/role'
const userRole = '/userRole'

export const routeindex = () => {
  return axios.request({
    url: '/local' + '/getMenu',
    method: 'get'
  })
}

export const queryMenu = () => {
  return axios.request({
    url: '/oa' + `${menu}/getMenuList`,
    method: 'get'
  })
}

export const saveMenu = (data) => {
  return axios.request({
    url: '/oa' + `${menu}/saveMenu`,
    method: 'post',
    data
  })
}

export const editMenu = (data) => {
  return axios.request({
    url: '/oa' + `${menu}/editMenu`,
    method: 'post',
    data
  })
}
export const menuInfo = rowGuid => {
  return axios.request({
    url: '/oa' + `${menu}/queryMenu`,
    method: 'get',
    params: {rowGuid}
  })
}

export const deleteMenu = rowGuid => {
  return axios.request({
    url: '/oa' + `${menu}/deleteMenu`,
    method: 'delete',
    params: {rowGuid}
  })
}


export const queryRole = (data) => {
  return axios.request({
    url: '/oa' + `${role}/list`,
    method: 'get',
    params: data
  })
}

export const saveRole = (data) => {
  return axios.request({
    url: '/oa' + `${role}`,
    method: 'post',
    data
  })
}

export const editRole = (data) => {
  return axios.request({
    url: '/oa' + `${role}`,
    method: 'put',
    data
  })
}

export const roleInfo = id => {
  return axios.request({
    url: '/oa' + `${role}/${id}`,
    method: 'get'
  })
}

export const deleteRole = id => {
  return axios.request({
    url: '/oa' + `${role}/${id}`,
    method: 'delete'
  })
}


export const queryUserRole = (data) => {
  return axios.request({
    url: '/oa' + `${userRole}/list`,
    method: 'get',
    params: data
  })
}

export const userMenu = () => {
  return axios.request({
    url: '/oa' + `${userRole}/userMenus`,
    method: 'get'
  })
}

export const saveUserRole = (data) => {
  return axios.request({
    url: '/oa' + `${userRole}/userRole`,
    method: 'put',
    data
  })
}

export const getRoleId = (userCode) => {
  return axios.request({
    url: '/oa' + `${userRole}/getRoleId/${userCode}`,
    method: 'get'
  })
}
