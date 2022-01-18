/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '天空之橙年卡购买',
      keepAlive: false
    }
  },
  {
    path: '/user',
    component: () => import('@/views/user/user.vue'),
    meta: {
      title: '用户信息',
      keepAlive: false
    }
  },
  {
    path: '/codepage',
    component: () => import('@/views/codePage/index.vue'),
    meta: {
      title: '单次购买',
      keepAlive: false
    }
  },
  {
    path: '/newyears',
    component: () => import('@/views/newyears/newyears.vue'),
    meta: {
      title: '年卡领取',
      keepAlive: false
    }
  },
  {
    path: '/receide',
    component: () => import('@/views/receide/index.vue'),
    meta: {
      title: '天空之橙特权卡',
      keepAlive: false
    }
  },

  {
    path: '*',
    name: 'pageNull',
    redirect: '/'
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
