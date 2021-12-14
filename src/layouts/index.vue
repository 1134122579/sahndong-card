<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      tabbars: [
        {
          title: '首页',
          to: {
            name: 'Home'
          },
          icon: 'home-o'
        },
        {
          title: 'VIP卡',
          to: {
            name: 'Codepage'
          },
          icon: 'qr'
        },
        {
          title: '关于我',
          to: {
            name: 'About'
          },
          icon: 'user-o'
        }
      ]
    }
  },
  components: {
    TabBar
  },
  methods: {
    handleChange(v) {
      console.log('tab value:', v)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  @include flexbox(space-between, center, column);
  .layout-content {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-bottom: 50px;
  }
  .layout-footer {
    position: fixed;
    z-index: 1;
    bottom: 0;
    width: 100%;
    height: 50px;
  }
}
</style>
