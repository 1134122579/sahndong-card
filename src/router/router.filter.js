import { getShareInfo } from '@/utils/share.js'

export default function (router) {
  router.beforeEach((to, from, next) => {
    let wxConfig = {
      title: '天空之城',
      desc: '天空之城欢迎你',
      link: location.origin + location.pathname,
      imgUrl: 'http://mfyfile.greatorange.cn/skylogo.jpg',
      success(res) {}
    }
    getShareInfo(wxConfig, res => {
      console.log('分享完成===', res.data)
      next()
    })
  })
  // 跳转成功
  router.afterEach(route => {})
}
