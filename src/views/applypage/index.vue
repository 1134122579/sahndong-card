<template>
  <div class="index-container" id="index-container">
    <img src="http://mfyfile.greatorange.cn/skyauth.png" class="headerImg" />
    <div class="button">
      <div class="codepage">
        <p>领取成功</p>
        <p>此优惠券当日只能试用一次</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>验证后失效</p>
      </div>
    </div>
    <!-- <div class="button">
      <div class="codepage">
        <p>领取成功</p>
        <p>此优惠券当日只能试用一次</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>验证后失效</p>
      </div>
    </div> -->
    <!-- <div class="button">
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
      <van-button class="buttontext img_animes" round block @click="payVipOrder">立即购买</van-button>
      <div class="myplay" @click="lookplayList">我的购票记录</div>
    </div> -->
    <!-- 安全协议 -->
    <van-popup
      :lazy-render="false"
      get-container="index-container"
      v-model="show"
      round
      closeable
      @click-overlay="overlay"
      :close-on-click-overlay="false"
    >
      <div class="lookpage" v-show="!is_pay">
        <Gtext />
        <!--  -->
        <van-button
          type="primary"
          color="#DC5317"
          :disabled="time > 0"
          style="margin: 16px 0"
          block
          @click="mylook"
          size="small"
          >我已阅读并同意《安全协议》{{ time > 0 ? time + '秒' : '' }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import { setToken, getToken } from '@/utils/loaclStting.js'
import { overdueToken } from '@/utils/wxload.js'
import { Toast } from 'vant'
import Gtext from '@/components/Gtext.vue'

export default {
  components: {
    Gtext
  },
  watch: {
    // show(newV, oldV) {
    //   !newV && this.$refs['audio'].load()
    // }
  },
  data() {
    return {
      qrcodecreated: null,
      mylist: [],
      myplayshow: false,
      activeIcon: require('@/assets/activeIcon.png'),
      inactiveIcon: require('@/assets/inactiveIcon.png'),
      isVip: false,
      time: 3,
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
    mylookCode(data) {
      if (data.status != 1) {
        Toast.fail('已使用')
        return
      }
      let text = `${this.userInfo.vip_code}-${data.order_no}`
      this.qrcodecreated.clear() // 清除二维码
      this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
      this.is_pay = true
      this.islookCard = true
      this.show = true
    },
    lookplayList() {
      this.Api.getUserOrder().then(res => {
        console.log(res.data)
        this.mylist = res.data
        this.myplayshow = true
      })
    },
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
      return
      this.show = false
    },
    mylook() {
      this.$refs.checkboxes.toggle(true)
      this.show = false
    },
    lookaqxy() {
      this.time = 3
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
    getUserOrder() {},
    payVipOrder() {
      let that = this
      if (!this.checked) {
        this.$toast.fail('请阅读安全协议')
        return
      }
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
          let text = `${this.userInfo.vip_code}-${data}`
          this.qrcodecreated.clear() // 清除二维码
          this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
          this.is_pay = true
          this.islookCard = true
          this.show = true
        })
        .catch(() => {
          console.log('支付失败')
          Toast.fail('支付失败')
          // this.$wx.closeWindow()
        })
    },
    qrcode() {
      let qrcodeName = this.$refs.qrcode
      console.log(location)
      let text = `${location.origin}/applypage?couponcode=12231415555454`
      // let text = this.userInfo.vip_code // 二维码地址
      this.qrcodecreated = new QRCode(qrcodeName, {
        render: 'canvas', //也可以替换为table
        width: 250,
        height: 250,
        colorDark: '#000',
        colorLight: '#fff'
      })
      this.qrcodecreated.clear() // 清除二维码
      this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处就是可以先清除在生成
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/formStyle.scss';
.index-container {
  background: #94908d;
  .codepage {
    background: #fff;
    padding: 10px 30px;
    border-radius: 20px;
    text-align: center;
    line-height: 1.8;
    font-size: 16px;
    #qrcode {
      padding: 5px 0;
    }
  }
}
</style>
