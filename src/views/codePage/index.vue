<template>
  <div class="codepage" v-show="is_pay">
    <p>购买成功请截图，只能使用一次</p>
    <div id="qrcode"></div>
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
      is_pay: false,
      userInfo: {},
      payToolsOrderApi: {}
    }
  },
  created() {
    if (!getToken()) {
      overdueToken()
    } else {
      this.Api.getUserInfo().then(res => {
        this.userInfo = res.data
        this.payVipOrder()
        this.qrcode() //展示二维码
      })
    }
  },
  methods: {
    payVipOrder() {
      let that = this
      let { is_auth } = this.userInfo
      if (is_auth != 1) {
        this.$router.push({
          path: '/user'
        })
        return
      }
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
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          // alert(out_trade_no)
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          // 成功调取在验证接口
          that.queryToolsOrder(out_trade_no)
        } else {
          // Toast.fail('支付失败')
          that.queryToolsOrder(out_trade_no)
        }
      })
    },
    // 查询是否支付成功
    queryToolsOrder(data) {
      this.Api.queryTicketOrder({ out_trade_no: data })
        .then(res => {
          Toast.success('支付成功')
          this.is_pay = true
        })
        .catch(() => {
          this.$wx.closeWindow()
        })
    },

    qrcode() {
      let qrcode = new QRCode('qrcode', {
        render: 'canvas', //也可以替换为table
        width: 250,
        height: 250,
        text: this.userInfo.vip_code, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
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
  p {
    color: #ff0000;
    font-weight: 600;
    padding: 20px 0;
  }
}
</style>
