<template>
  <div class="loadStyle">
    <div class="progress_style">
      <van-progress :percentage="percentage" stroke-width="8" color="linear-gradient(to right, #be99ff, #ee0a24)" />
    </div>
  </div>
</template>
<script>
import { UrlCode, getUrlKey } from '@/utils/wxload.js'
import { setToken, getToken } from '@/utils/loaclStting.js'
export default {
  data() {
    return {
      percentage: 20,
      progtime: null
    }
  },
  created() {
    // this.prog()
    // return
    this.login()
  },
  methods: {
    login() {
      let that = this
      let code = getUrlKey('code')
      if (code) {
        this.Api.login({
          code
        }).then(res => {
          if (res.status != 200) {
            UrlCode(location.origin + '/dth5')
            return
          }
          that.prog()
          setToken(res.data.token)
        })
      } else {
        UrlCode()
      }
    },
    prog() {
      let that = this
      this.percentage = 20
      that.progtime = setInterval(() => {
        that.percentage++
        if (this.percentage >= 100) {
          clearInterval(that.progtime)
          this.$router.push({
            path: '/answer'
          })
        }
      }, 20)
    }
  }
}
</script>

<style lang="scss">
.loadStyle {
  position: relative;
  width: 100%;
  height: 100%;
  // background: #ee0a24;
  .progress_style {
    position: absolute;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-direction: column;
    bottom: 80px;
  }
}
</style>
