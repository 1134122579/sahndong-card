<template>
  <div class="index-container" id="index-container">
    <!-- <img src="http://mfyfile.greatorange.cn/skyauth.png" class="headerImg" /> -->
    <div class="button_">
      <van-button class="buttontext img_animes" round block @click="getcouponCode">立即领取</van-button>
      <div class="couponList">
        <div class="couponList_title">领取记录</div>
        <ul>
          <li v-for="item in 30">
            <div>时间</div>
            <div class="shiyong" @click="iscodebutton">已使用</div>
          </li>
        </ul>
      </div>
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
      <div class="codepage">
        <p>领取成功</p>
        <p>此优惠券当日有效</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>验证后失效</p>
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
    iscodebutton() {
      let text = `${location.origin}/applypage?couponcode=12231415555454`
      this.qrcodecreated.clear() // 清除二维码
      this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处
      this.show = true
    },
    overlay() {},
    getcouponCode() {
      this.$toast.success('领取成功')
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
  background: #94908d url('http://mfyfile.greatorange.cn/skyauth.png') no-repeat;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  // 领取
  .button_ {
    width: 100%;
    .couponList {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      margin: 20px 10px;
      box-sizing: border-box;
      background: #fff;
      padding: 10px 10px;
      border-radius: 20px;
      text-align: center;
      line-height: 1.8;
      font-size: 16px;
      height: 350px;
      .couponList_title {
        width: 100%;
        font-size: 20px;
        font-weight: 600;
        flex-shrink: 0;
      }
      ul {
        flex: 1;
        width: 100%;
        overflow-y: auto;

        li {
          margin-bottom: 10px;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          .shiyong {
            border-radius: 40px;
            border: 1px solid #ec6927;
            font-size: 14px;
            padding: 0 14px;
            color: #ec6927;
          }
          .weishiyong {
            color: #ccc;
            border: 1px solid #ccc;
          }
        }
      }
    }
  }
  .codepage {
    background: #fff;
    padding: 10px 30px;
    border-radius: 20px;
    text-align: center;
    line-height: 1.8;
    font-size: 16px;
    color: #ff0000;
    #qrcode {
      padding: 5px 0;
    }
  }
}
</style>
