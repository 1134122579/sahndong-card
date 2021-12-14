// 按需全局引入 vant组件
import Vue from 'vue'
import wx from 'weixin-js-sdk'
Vue.prototype.$wx = wx
import {
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Dialog,
  Popup,
  Icon,
  CellGroup,
  Lazyload,
  Swipe,
  SwipeItem,
  Image as VanImage,
  Progress
} from 'vant'
Vue.use(Button)
Vue.use(CellGroup)
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Cell)
Vue.use(Dialog)
Vue.use(Progress)
Vue.use(Popup)
Vue.use(List)
Vue.use(VanImage)
Vue.use(Icon)
Vue.use(Tabbar).use(TabbarItem)
