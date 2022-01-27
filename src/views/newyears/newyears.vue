<!-- home -->
<template>
  <div class="index-container">
    <img src="http://mfyfile.greatorange.cn/newyear1.png" class="headerImg" />
    <div class="button">
      <van-checkbox v-model="checked" ref="checkboxes" label-disabled checked-color="#ff0000" icon-size="16px">
        <template #icon="props">
          <div style="margin-top: -1px">
            <img
              class="img-icon"
              style="width: 18px; height: 18px; display: block"
              :src="props.checked ? activeIcon : inactiveIcon"
            />
          </div>
        </template>
        <p class="aqxy" @click="lookaqxy">我已阅读并同意 <a style="color: #0c5ffe">《安全协议》</a></p>
      </van-checkbox>
      <van-button v-if="!isVip" class="buttontext img_animes" round block @click="receiveVip">立即领取</van-button>
      <van-button v-if="isVip" class="buttontext img_animes" round block @click="addCard">立即查看</van-button>
    </div>
    <!-- 安全协议 -->
    <van-popup
      closeable
      :lazy-render="false"
      get-container="index-container"
      v-model="show"
      round
      @click-overlay="overlay"
    >
      <div class="lookpage">
        <Gtext />
        <van-button type="primary" color="#DC5317" style="margin: 16px 0" block @click="mylook" size="small"
          >我已阅读并同意《安全协议》</van-button
        >
        <!-- <van-button
          type="primary"
          color="#DC5317"
          :disabled="time > 0"
          style="margin: 16px 0"
          block
          @click="mylook"
          size="small"
          >我已阅读并同意《安全协议》{{ time > 0 ? time + '秒' : '' }}</van-button
        > -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { setToken, getToken } from '@/utils/loaclStting.js'
import { overdueToken } from '@/utils/wxload.js'
import { compareArray } from '@/utils/comp'
import { Toast } from 'vant'
import Gtext from '@/components/Gtext.vue'
export default {
  data() {
    return {
      activeIcon: require('@/assets/activeIcon.png'),
      inactiveIcon: require('@/assets/inactiveIcon.png'),
      isVip: false,
      time: 3,
      timeT: null,
      islookCard: false,
      checked: false,
      is_pay: false,
      show: false,
      payToolsOrderApi: null,
      userInfo: '',
      ITEMID: '',
      list: {
        code: '123456',
        api_ticket: 'ojZ8YtyVyr30HheH3CM73y7h4jJE',
        nonce_str: 'jonyqin',
        card_id: 'pjZ8Yt1XGILfi-FUsewpnnolGgZk',
        timestamp: 1404896688
      },
      setList: [],
      QM: ''
    }
  },
  components: {
    Gtext
  },
  computed: {
    isVip() {
      return this.userInfo.vip_time_out >= +new Date() / 1000
    }
  },
  created() {
    this.computImg()
    if (!getToken()) {
      overdueToken()
    } else {
      this.Api.getUserInfo().then(res => {
        this.userInfo = res.data
        console.log(this.userInfo)
      })
    }
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
      this.time = 3
      this.is_pay = false
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
    computImg() {},
    receiveVip() {
      if (!this.checked) {
        this.$toast.fail('请阅读安全协议')
        return
      }
      // 是否认证
      // if (this.userInfo.is_auth != 1) {
      //   this.$router.push({
      //     path: '/user'
      //   })
      //   return
      // }
      this.Api.receiveVip().then(res => {
        if (res.status == 200) {
          this.addCard()
        } else {
        }
      })
    },
    onclick(id) {
      this.ITEMID = id
    },
    // 购买
    payVipOrder() {
      let that = this
      let { is_auth } = this.userInfo
      if (is_auth != 1) {
        that.$router.push({ path: '/user' })
        return
      }
      this.Api.payVipOrder({
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
        console.log('onBridgeReady', res)
        that.queryToolsOrder(out_trade_no)
        return
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          // alert(out_trade_no)
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          // 成功调取在验证接口
        } else {
          // Toast.fail('支付失败')
        }
      })
    },
    // 查询是否支付成功
    queryToolsOrder(data) {
      this.Api.queryVipOrder({ out_trade_no: data }).then(res => {
        Toast.success('支付成功')
        this.addCard() //添加卡片
      })
    },

    addCard() {
      let that = this
      let { vip_code, gh_openid } = this.userInfo
      let cardId = this.userInfo.new_year_card_id
      that.Api.getShare({
        url: location.href
      }).then(res => {
        console.log(res.data)
        let appId = res.data.appId
        let timestamp = res.data.timestamp
        let nonceStr = res.data.nonceStr
        let signature = res.data.signature
        that.$wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识，填自己的！
          timestamp: timestamp, // 必填，生成签名的时间戳，刚才接口拿到的数据
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见附录1
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseCard', 'addCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        that.Api.cardExtSignPackage({ card_id: cardId, code: vip_code, openid: gh_openid, timestamp }).then(
          cardExtSign => {
            console.log('cardExtSignPackage', cardExtSign.data)
            let { signature, apiTicket, nonceStr, openid, card_id, code } = cardExtSign.data
            that.$wx.ready(() => {
              that.$wx.addCard({
                cardList: [
                  {
                    cardId: cardId,
                    cardExt: JSON.stringify({
                      api_ticket: apiTicket,
                      card_id,
                      nonce_str: nonceStr,
                      code,
                      openid,
                      timestamp,
                      signature
                    })
                  }
                ], // 需要添加的卡券列表
                success: function (ress) {
                  var cardList = ress.cardList // 添加的卡券列表信息
                  console.log('添加的卡券列表信息', cardList)
                }
              })
            })
          }
        )
      })
    },

    createButton() {
      let list = this.list
      this.QM = this.createdQM(list)
    },
    createdQM(list) {
      let strArr = []
      for (const key in list) {
        if (Object.hasOwnProperty.call(list, key)) {
          const element = list[key]
          strArr.push({ name: element })
        }
      }
      console.log('compareArray', compareArray(strArr, 'name'))
      let newarr = strArr.sort(function (e, t) {
        return e.name >= t.name ? 1 : -1
      })
      let newstr = ''
      console.log('newarr', newarr)
      newarr.forEach(item => {
        newstr += item.name
      })
      let QM = CryptoJS.SHA1(newstr).toString()
      console.log('QM', QM)
      return QM
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/css/formStyle.scss';
.index-container {
  background: #94908d;
  .button {
    bottom: 4.8rem;
  }
}
</style>
