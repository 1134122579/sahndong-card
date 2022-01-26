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
      <van-button class="buttontext img_animes" round block @click="payVipOrder">立即购买</van-button>
      <div class="myplay" @click="lookplayList">我的购票记录</div>
    </div>
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
      <div class="codepage" v-show="is_pay">
        <p>购买成功</p>
        <p>请将本二维码对准下方摄像头</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>验证后失效</p>
      </div>
    </van-popup>

    <!-- 我的记录  -->
    <van-popup
      :lazy-render="false"
      get-container="index-container"
      v-model="myplayshow"
      round
      closeable
      @click-overlay="overlay"
      :close-on-click-overlay="false"
    >
      <div class="list">
        <p class="list_ttle">购买记录</p>
        <div class="block" v-if="mylist.length > 0" v-for="item in mylist" :key="item.id">
          <div>
            <p class="order_no">
              {{ item.order_no }}
            </p>
            <p>
              {{ item.create_time }}
            </p>
          </div>
          <p></p>
          <p :class="item.status == 1 ? 'buttonlook' : 'buttonlook nolook'" @click="mylookCode(item)">查看</p>
        </div>
        <div v-if="mylist.length <= 0">
          <van-empty description="暂无订单" />
        </div>
      </div>
    </van-popup>
    <!-- <audio
      ref="audio"
      preload="auto"
      loop
      src="https://voiceintelligent-1253824635.file.myqcloud.com/voiceintelligent/2022/01/fde7a5e3-24fc-4c2e-8f74-f460cc302b3c.mp3"
    >
      您的浏览器不支持 audio 元素。
    </audio> -->
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
      console.log(qrcodeName)
      let text = this.userInfo.vip_code // 二维码地址
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
  .button {
    bottom: 3.9rem;
  }
  .myplay {
    color: #fff;
    border-bottom: 1px solid #ff0000;
    padding: 4px 0;
  }
  // 我的记录
  .list {
    width: 70vw;
    height: 60vh;
    padding: 10px 20px;
    .list_ttle {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
    }
    .block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dbdbdd;
      padding: 10px 0;
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.5;
      .order_no {
        font-weight: bold;
      }
      .buttonlook {
        padding: 4px 16px;
        font-size: 12px;
        border: 1px solid #ec6925;
        border-radius: 30px;
        color: #ec6925;
      }
      .nolook {
        border: 1px solid #ccc;
        color: #ccc;
      }
    }
  }
}
.codepage {
  padding: 10px 20px;
  p {
    color: #ff0000;
    text-align: center;
    // padding: 14px 0;
    line-height: 1.6;
  }
  .qrcode {
    width: 250px;
    height: 250px;
    margin: 0.33rem 0;
  }
  #qrcode {
    margin: 0.33rem;
  }
}
</style>
