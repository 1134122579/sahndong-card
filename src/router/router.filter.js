import { getShareInfo } from '@/utils/share.js'

export default function (router) {
  router.beforeEach((to, from, next) => {
    console.log(to)
    document.title = to.meta.title
    if (to.path != '/receide') {
      if (to.path == '/newyears') {
        let wxConfig = {
          title: '@所有人 速抢！天空之橙春节特权卡！',
          desc: '免费领取春节特权卡',
          link: location.origin + location.pathname,
          imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
          success(res) {}
        }
        getShareInfo(wxConfig, res => {
          console.log('分享完成===', res.data)
          next()
        })
        return
      }
      if (to.path == '/couponpage') {
        let wxConfig = {
          title: '@所有人 速抢！天空之橙抵用券',
          desc: '免费领取天空之橙抵用券',
          link: location.origin + location.pathname,
          imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
          success(res) {}
        }
        getShareInfo(wxConfig, res => {
          console.log('分享完成===', res.data)
          next()
        })
        return
      }
      let wxConfig = {
        title: '@所有人 速抢！天空之橙全年免票卡！',
        desc: '19.9抢价值天空之橙全年免票卡',
        link: location.origin + location.pathname,
        // imgUrl: 'http://mfyfile.greatorange.cn/skylogo.jpg',
        imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
        success(res) {}
      }
      getShareInfo(wxConfig, res => {
        console.log('分享完成===', res.data)
        next()
      })
    } else {
      let wxConfig = {
        title: '@所有人 您有一张元旦免票卡等待领取',
        desc: '天空之橙元旦福利免费领取啦~',
        link: location.origin + location.pathname,
        // imgUrl: 'http://mfyfile.greatorange.cn/skylogo.jpg',
        imgUrl: 'http://api.skyorange.cn/wxh5/skylogo.jpg',
        success(res) {}
      }
      getShareInfo(wxConfig, res => {
        console.log('分享完成===', res.data)
        next()
      })
    }
  })
  // 跳转成功
  router.afterEach(route => {})
}
