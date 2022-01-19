<template>
  <!-- <div class="codepage" v-show="is_pay">
    <p>购买成功请截图，只能使用一次</p>
    <div id="qrcode"></div>
  </div> -->
  <div class="index-container" id="index-container">
    <img src="http://mfyfile.greatorange.cn/unitVip.png" class="headerImg" />
    <div class="button">
      <van-checkbox v-model="checked" ref="checkboxes" @click="lookaqxy" icon-size="16px">
        <template #icon="props">
          <div style="margin-top: -1px">
            <img
              class="img-icon"
              style="width: 18px; height: 18px; display: block; border-radius: 50%"
              :src="props.checked ? activeIcon : inactiveIcon"
            />
          </div>
        </template>
        <p class="aqxy">我已阅读并同意 <a>《安全协议》</a></p>
      </van-checkbox>
      <van-button
        v-if="!islookCard"
        class="buttontext img_animes"
        style="margin: 8px 0"
        size="small"
        round
        block
        @click="payVipOrder"
        >立即购买</van-button
      >
      <van-button
        v-if="islookCard"
        size="small"
        style="margin: 8px 0"
        round
        block
        class="buttontext img_animes"
        @click="lookCard"
        >立即查看</van-button
      >
    </div>
    <!-- 安全协议 -->
    <van-popup :lazy-render="false" get-container="index-container" v-model="show" round @click-overlay="overlay">
      <div class="lookpage" v-show="!is_pay">
        <div class="title">《安全协议》</div>
        <p>
          立立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立即领取立
        </p>
        <!--  -->
        <van-button
          type="primary"
          color="#EC6925"
          :disabled="time > 0"
          style="margin: 16px 0"
          block
          @click="mylook"
          size="small"
          >我已阅读并同意《安全协议》{{ time > 0 ? time + '秒' : '' }}</van-button
        >
      </div>
      <div class="codepage" v-show="is_pay">
        <p>购买成功请截图，只能使用一次</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>退出无法查看！</p>
      </div>
    </van-popup>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import { setToken, getToken } from '@/utils/loaclStting.js'
import { overdueToken } from '@/utils/wxload.js'
import { Toast } from 'vant'

export default {
  data() {
    return {
      activeIcon: require('@/assets/activeIcon.png'),
      inactiveIcon: require('@/assets/inactiveIcon.png'),
      isVip: false,
      time: 5,
      timeT: null,
      islookCard: false,
      checked: false,
      is_pay: false,
      show: false,
      userInfo: {},
      payToolsOrderApi: {}
    }
  },
  created() {
    this.onePlay()
  },

  mounted() {},
  methods: {
    lookCard() {
      if (!this.checked) {
        this.$toast.fail('请阅读安全协议')
        return
      }
      this.show = true
      this.is_pay = true
    },
    overlay() {
      console.log(14)
      this.show = false
    },
    mylook() {
      this.$refs.checkboxes.toggle(true)
      this.show = false
    },
    lookaqxy() {
      this.time = 5
      this.is_pay = false
      this.$refs.checkboxes.toggle(false)
      clearInterval(this.timeT)
      this.timeT = setInterval(() => {
        this.time--
        if (this.time < -0) {
          clearInterval(this.timeT)
          this.time = 0
        }
      }, 1000)
      this.show = true
    },
    onePlay() {
      if (!getToken()) {
        overdueToken()
      } else {
        this.Api.getUserInfo().then(res => {
          this.userInfo = res.data
          // this.payVipOrder()
          this.qrcode() //展示二维码
        })
      }
    },
    payVipOrder() {
      if (!this.checked) {
        this.$toast.fail('请阅读安全协议')
        return
      }
      let that = this
      let { is_auth } = this.userInfo
      // 认证
      // if (is_auth != 1) {
      //   this.$router.push({
      //     path: '/user'
      //   })
      //   return
      // }
      this.Api.payTicketOrder({
        pay_type: 1
      }).then(res => {
        console.log(res)
        that.payToolsOrderApi = res.data //数据
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
          }
        } else {
          this.onBridgeReady()
        }
      })
    },
    onBridgeReady() {
      let that = this
      let { out_trade_no } = this.payToolsOrderApi
      WeixinJSBridge.invoke('getBrandWCPayRequest', that.payToolsOrderApi, function (res) {
        that.queryToolsOrder(out_trade_no)
        return
      })
    },
    // 查询是否支付成功
    queryToolsOrder(data) {
      this.Api.queryTicketOrder({ out_trade_no: data })
        .then(res => {
          Toast.success('支付成功')
          this.is_pay = true
          this.islookCard = true
          this.show = true
        })
        .catch(() => {
          this.$wx.closeWindow()
        })
    },
    qrcode() {
      let qrcodeName = this.$refs.qrcode
      console.log(qrcodeName)
      let text = this.userInfo.vip_code // 二维码地址
      let qrcode = new QRCode(qrcodeName, {
        render: 'canvas', //也可以替换为table
        width: 250,
        height: 250,
        colorDark: '#000',
        colorLight: '#fff'
      })
      qrcode.clear() // 清除二维码
      qrcode.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
    }
  }
}
</script>

<style lang="scss">
.codepage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding: 14px;
  p {
    color: #ff0000;
    font-weight: 600;
    padding: 8px 0;
  }
}
</style>

<style lang="scss" scoped>
.index-container {
  width: 100%;
  min-height: 100%;
  // height: 100%;
  background: #94908d;
  // overflow: hidden;
  position: relative;
  .headerImg {
    display: block;
    width: 100%;
    height: auto;
  }
  .header {
    width: 100%;
    box-sizing: border-box;
  }
  .content {
    padding: 20px;
    h2 {
      font-size: 24px;
      letter-spacing: 2px;
      line-height: 2;
    }
    h5 {
      letter-spacing: 2px;
      line-height: 2;
    }
    .desc {
      margin-top: 20px;
    }
    p {
      // padding: 10px 0;
      // letter-spacing: 4px;
      font-size: 14px;
      line-height: 2;
    }
  }
  .bottom {
    padding-bottom: 80px;
  }
  .button {
    position: absolute;
    bottom: 4.93333rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
    color: #dc5317;
  }
  // 安全协议
  .aqxy {
    font-size: 14px;
    color: #fff;
    text-align: center;
    width: 100%;
    a {
      // color: #de6129;
    }
  }
  // 看
  .lookpage {
    width: 86vw;
    height: 86vh;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    p {
      flex: 1;
    }
  }
}
</style>
<style lang="scss">
.buttontext {
  color: #dc5317;
  margin-top: 4px;
}
// .img_animes {
//   animation: scaleDrew 2s ease-in-out infinite;
// }
/* 按钮动画效果 */
.img_animes {
  -webkit-animation: free_download 1s linear alternate infinite;
  animation: free_download 1s linear alternate infinite;
}
@-webkit-keyframes free_download {
  0% {
    -webkit-transform: scale(0.9);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
@keyframes free_download {
  0% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
