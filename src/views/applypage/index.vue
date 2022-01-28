<template>
  <div class="index-container" id="index-container">
    <!-- <img src="" class="headerImg" /> -->
    <div class="button_">
      <div class="codepage">
        <p class="codepage_title">抵扣券核销</p>
        <div id="qrcodeqrcode" ref="qrcode"></div>
        <h4>
          {{ couponcode }}
        </h4>
        <p>验证后失效！！</p>
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
      if (res.data.is_admin != 1) {
        this.$toast.fail('权限不足')
        return
      }
      this.Api.checkCoupon({ code: this.couponcode }).then(res => {
        this.$toast('已核销 ')
      })
    },
    onePlay() {
      if (!getToken()) {
        overdueToken()
      } else {
        this.Api.getUserInfo().then(res => {
          this.userInfo = res.data
          this.qrcode() //展示二维码
          if (res.data.is_admin != 1) {
            this.$router.push({
              path: '/404'
            })
            return
          }
          // this.payVipOrder()
        })
      }
    },

    qrcode() {
      let qrcodeName = this.$refs.qrcode
      console.log(location)
      let text = `${this.couponcode}`
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
<style lang="scss" scoped>
@import '@/assets/css/formStyle.scss';
.index-container {
  background: #94908d url('../../assets/couponpage_bg.png') no-repeat;
  background-size: 100% auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .button_ {
    .codepage {
      background: #fff;
      padding: 10px 40px;
      border-radius: 20px;
      text-align: center;
      line-height: 1.8;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #333;
      .codepage_title {
        font-size: 20px;
        font-weight: 600;
      }
      #qrcodeqrcode {
        // width: 260px;
        // height: 260px;
        margin: 10px 0;
      }
      h4 {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .buttontext {
      background: #ea584e;
      color: #fff;
      width: 100%;
      margin: 0 auto;
      font-weight: 600;
    }
  }
}
</style>
