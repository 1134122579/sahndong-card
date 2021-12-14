/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '',
      keepAlive: false
    }
  }

  // {
  //   path: '/',
  //   component: () => import('@/layouts/index'),
  //   redirect: '/home',
  //   meta: {
  //     title: '',
  //     keepAlive: false
  //   },
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'Home',
  //       component: () => import('@/views/home/index.vue'),
  //       meta: {
  //         title: '首页',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'codepage',
  //       name: 'Codepage',
  //       component: () => import('@/views/codePage/index.vue'),
  //       meta: {
  //         title: '会员',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'about',
  //       name: 'About',
  //       component: () => import('@/views/about/about.vue'),
  //       meta: {
  //         title: '关于',
  //         keepAlive: false
  //       }
  //     }
  //   ]
  // }
]
