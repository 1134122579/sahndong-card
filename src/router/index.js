import Vue from 'vue'
import Router from 'vue-router'
import {
  constantRouterMap
} from './router.config.js'
import beforeFilter from './router.filter.js' // 路由拦截器
// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

const createRouter = () =>
  new Router({
    mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: process.env.BASE_URL,
    // base: 'dth5',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRouterMap
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

beforeFilter(router) // 路由拦截器

router.onError(error => {
  console.log(error)
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
