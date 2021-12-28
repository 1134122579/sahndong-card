import { getShareInfo } from '@/utils/share.js'

export default function (router) {
  router.beforeEach((to, from, next) => {
    console.log(to)
    document.title = to.meta.title
    let wxConfig = {
      title: '@所有人 您有一张元旦免票卡等待领取',
      desc: '天空之橙元旦福利免费领取啦~',
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
