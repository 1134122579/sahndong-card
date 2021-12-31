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
    //   '429b5ae1bcf096474bf54a48cfa1460128fbf625ad91a056dda1f2cb0bdb189a5b6a838fde8290d11e6a9090743cedf615f3526e647dd2a91aa4a81aed93ab2bfc0f6acb244cccde11cd407b648f30c2'
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
