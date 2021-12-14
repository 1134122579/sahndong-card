<!-- home -->
<template>
  <div class="about-container">
    <!-- 用户信息 -->
    <div class="about_header">用户信息</div>
    <!-- 列表 -->
    <div class="about_setingList">
      <van-cell-group>
        <!-- <van-cell v-for="item in settingList" :title="item.title" value="内容" /> -->
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 请求接口
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      wechat: `${this.$cdn}/wx/640.gif`,
      settingList: [
        {
          title: '认证'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 请求数据案例
    initData() {
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      const params = { user: 'sunnie' }
      // this.Api.getProblem()
      //   .then(() => {})
      //   .catch(() => {})
    },
    // Action 通过 store.dispatch 方法触发
    doDispatch() {
      this.$store.dispatch('setUserName', '真乖，赶紧关注公众号，组织都在等你~')
    },
    goGithub(index) {
      window.location.href = 'https://github.com/sunniejs/vue-h5-template'
    }
  }
}
</script>
<style lang="scss">
.about-container {
  /* 你的命名空间 */
  background: #fff;
  height: 100vh;
  box-sizing: border-box;
}
</style>
