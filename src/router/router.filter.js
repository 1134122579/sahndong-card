import {
  getShareInfo
} from '@/utils/share.js'


export default function(router) {
  router.beforeEach((to, from, next) => {
    next()
    // let wxConfig = {
    //   title: '虹口区司法局答题竞赛',
    //   desc: '虹口区司法局答题竞赛',
    //   link: 'http://dati.nxcsoft.top/dth5',
    //   imgUrl: 'http://dati.nxcsoft.top/icon.jpg',
    //   success(res) {
    //     console.log('微信分享加载成功===', res)
    //   }
    // }
    // getShareInfo(wxConfig, res => {
    //   console.log('分享完成===', wxConfig, location)
    //   next()
    // })
  })
  // 跳转成功
  router.afterEach(route => {

  })
}
