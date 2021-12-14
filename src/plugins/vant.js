// 按需全局引入 vant组件
import Vue from 'vue'
import {
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Dialog,
  Popup,
  Icon,
  Image as VanImage,
  Progress
} from 'vant'
Vue.use(Button)
Vue.use(Cell)
Vue.use(Dialog)
Vue.use(Progress)
Vue.use(Popup)
Vue.use(List)
Vue.use(VanImage)
Vue.use(Icon)
Vue.use(Tabbar).use(TabbarItem)
