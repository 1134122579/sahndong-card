// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Api from './api/index'
// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.Api = Api
Vue.prototype.$cdn = $cdn
import './utils/equipment' //判断设备类型  shei是否强制限制字体

import vueMiniPlayer from 'vue-mini-player'
import 'vue-mini-player/lib/vue-mini-player.css'
Vue.use(vueMiniPlayer) // 视频组件

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'

// filters
import './filters'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
