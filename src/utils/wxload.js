// 转译url
import { APPID } from '@/config'
import { setToken, getToken } from '@/utils/loaclStting.js'
import API from '@/api/index'

export function UrlCode(url) {
  // 获取微信code
  const appId = APPID
  const Url = url ? url : encodeURIComponent(location.href)
  console.log('获取当前的地址====', APPID, location.href)
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${Url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
}

// 获取 code
export function getUrlKey(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}
// 微信登录过期
export function overdueToken() {
  let code = getUrlKey('code')
  let vipcode = getUrlKey('vipcode')
  let couponcode = getUrlKey('couponcode')
  if (code) {
    API.login({
      code
    }).then(res => {
      setToken(res.data.token)
      if (vipcode) {
        window.location.replace(`${window.location.origin}${window.location.pathname}?vipcode=${vipcode}`)
        return
      }
      if (couponcode) {
        window.location.replace(`${window.location.origin}${window.location.pathname}?couponcode=${couponcode}`)
        return
      }
      window.location.replace(window.location.origin + window.location.pathname)
    })
  } else {
    UrlCode()
  }
}
