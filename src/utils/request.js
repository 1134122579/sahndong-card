import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import { getToken, setToken } from './loaclStting'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
import { UrlCode, getUrlKey, overdueToken } from '@/utils/wxload.js'

import Api from '../api/index'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    // setToken(
    //   'b1be342c039c65565a602d2f87bb10ddbc1d2b32b6af64679ce2526bed0da1612ddaedfc8346e2a650a8a1ffc4ebcd27bca478c75141dca93c2378ead3b0241e2c0d51196dc79b4a7cb888a6a54d319e'
    // )
    config.headers['app-type'] = 'ios'
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      // if (res.status === 401) {
      //   store.dispatch('FedLogOut').then(() => {
      //     location.reload()
      //   })
      // }
      if (res.status === 202) {
        return Promise.reject(Toast.fail(res.message))
      }
      // token过期
      if (res.status == 203) {
        overdueToken()
      }
      // Toast.fail(res.message)
      return Promise.reject(Toast.fail(res.message))
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
