import { getShareInfo } from '@/utils/share.js'

export default function (router) {
  router.beforeEach((to, from, next) => {
    let wxConfig = {
      title: '',
      desc: '',
      link: location.origin + location.pathname,
      imgUrl: 'http://dati.nxcsoft.top/icon.jpg',
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
