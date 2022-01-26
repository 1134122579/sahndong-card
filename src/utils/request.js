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
    setToken(
      'ec4916ffccc5b40318679e5f8b472ebfbbf39e03676b7d3bb5ff9803f07221fcddf6615ccecc86f654a82e902f1dff6c5e872b9b4c2f995ace6e2a974eec55a55726b9ee532fdb4a01e6449788adc7ce'
    )
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
