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
    url: api.getUserInfo,
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
export function payTicketOrder(data) {
  return request({
    url: api.payTicketOrder,
    method: 'post',
    data,
    hideloading: true
  })
}
export function queryVipOrder(data) {
  return request({
    url: api.queryVipOrder,
    method: 'post',
    data,
    hideloading: true
  })
}
export function queryTicketOrder(data) {
  return request({
    url: api.queryTicketOrder,
    method: 'post',
    data,
    hideloading: true
  })
}

export function payVipOrder(data) {
  return request({
    url: api.payVipOrder,
    method: 'post',
    data,
    hideloading: true
  })
}
export function getApiTicket(data) {
  return request({
    url: api.getApiTicket,
    method: 'get',
    data,
    hideloading: true
  })
}
export function cardExtSignPackage(data) {
  return request({
    url: api.cardExtSignPackage,
    method: 'post',
    data,
    hideloading: true
  })
}
export function upCardImage(data) {
  return request({
    url: api.upCardImage,
    method: 'post',
    data,
    hideloading: true
  })
}
export function authUserInfo(data) {
  return request({
    url: api.authUserInfo,
    method: 'post',
    data,
    hideloading: true
  })
}
export function receiveVip(data) {
  return request({
    url: api.receiveVip,
    method: 'get',
    data,
    hideloading: true
  })
}
export function receiveSkyBeerVip(params) {
  return request({
    url: api.receiveSkyBeerVip,
    method: 'get',
    params,
    hideloading: true
  })
}
export function getUserOrder(data) {
  return request({
    url: api.getUserOrder,
    method: 'get',
    data,
    hideloading: true
  })
}
export function createSkybeerCode(data) {
  return request({
    url: api.createSkybeerCode,
    method: 'get',
    data,
    hideloading: true
  })
}
export function checkYearVip(data) {
  return request({
    url: api.checkYearVip,
    method: 'get',
    data,
    hideloading: true
  })
}
export function ReceiveCoupon(data) {
  return request({
    url: api.ReceiveCoupon,
    method: 'get',
    data,
    hideloading: true
  })
}
export function getCouponLog(params) {
  return request({
    url: api.getCouponLog,
    method: 'get',
    params,
    hideloading: true
  })
}
export function checkCoupon(params) {
  return request({
    url: api.checkCoupon,
    method: 'get',
    params,
    hideloading: true
  })
}
export function getCouponDetial(params) {
  return request({
    url: api.getCouponDetial,
    method: 'get',
    params,
    hideloading: true
  })
}
