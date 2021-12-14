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
    config.headers['app-type'] = 'ios'
    setToken(
      '9d59c1418ce0b33a8e13e5b384c88a0c60b999d16f371077a31dd30316f28b0a806621a8a13b560508c54bb132a02926d36a5174d2b1da58db07386156f33b1886b936de3bc4a7b1e2946a927cd4f173'
    )
    if (getToken()) {
      config.headers['token'] =
        '9d59c1418ce0b33a8e13e5b384c88a0c60b999d16f371077a31dd30316f28b0a806621a8a13b560508c54bb132a02926d36a5174d2b1da58db07386156f33b1886b936de3bc4a7b1e2946a927cd4f173'
      // config.headers['token'] = getToken()
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
      // token过期
      if (res.status == 203) {
        overdueToken()
      }
      // Toast.fail(res.message)
      return Promise.reject(res || 'error')
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