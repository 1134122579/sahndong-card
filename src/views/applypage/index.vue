<template>
  <div class="index-container" id="index-container">
    <img src="http://mfyfile.greatorange.cn/skyauth.png" class="headerImg" />
    <div class="button">
      <div class="codepage">
        <p>券码核销</p>
        <h4>
          {{ couponcode }}
        </h4>
        <p>验证后失效</p>
        <van-button class="buttontext img_animes" round block @click="ReceiveCoupon">立即核销</van-button>
      </div>
    </div>
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
      couponcode: '',
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
    this.couponcode = this.$route.query.couponcode
    this.onePlay()
  },

  mounted() {},
  methods: {
    ReceiveCoupon() {
      this.$toast.success('已核销 ')

      // this.Api.ReceiveCoupon().then(res => {
      //   this.iscodebutton(res.data)
      // })
    },
    onePlay() {
      if (!getToken()) {
        overdueToken()
      } else {
        this.Api.getUserInfo().then(res => {
          this.userInfo = res.data
          // this.payVipOrder()
          // this.qrcode() //展示二维码
        })
      }
    },

    qrcode() {
      let qrcodeName = this.$refs.qrcode
      console.log(location)
      let text = `${location.origin}/applypage?couponcode=${this.couponcode}`
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
  overflow-y: hidden;
  height: 100%;
  .button {
    top: 50%;
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
    .buttontext {
      background: #ea584e;
      color: #fff;
      width: 80%;
      margin: 0 auto;
      font-weight: 600;
    }
  }
}
</style>
