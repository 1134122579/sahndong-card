import api from '../api'
// axios
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: api.Login,
    method: 'post',
    data
  })
}

// 用户信息 post 方法
export function getUserInfo(data) {
  return request({
    url: api.UserInfo,
    method: 'get',
    data,
    hideloading: true
  })
}

// 用户名称 get 方法
export function getUserName(params) {
  return request({
    url: api.UserName,
    method: 'get',
    params,
    hideloading: true
  })
}
export function getProblem(params) {
  return request({
    url: api.getProblem,
    method: 'get',
    params,
    hideloading: true
  })
}

export function getRule(params) {
  return request({
    url: api.getRule,
    method: 'get',
    params,
    hideloading: true
  })
}
export function getReport(params) {
  return request({
    url: api.getReport,
    method: 'get',
    params,
    hideloading: true
  })
}
export function getToken(params) {
  return request({
    url: api.getToken,
    method: 'get',
    params,
    hideloading: true
  })
}

export function subProblem(data) {
  return request({
    url: api.subProblem,
    method: 'post',
    data,
    hideloading: true
  })
}
export function getQiShu(data) {
  return request({
    url: api.getQiShu,
    method: 'get',
    data,
    hideloading: true
  })
}
export function getShare(data) {
  return request({
    url: api.getShare,
    method: 'post',
    data,
    hideloading: true
  })
}
