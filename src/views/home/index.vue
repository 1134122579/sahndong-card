<!-- home -->
<template>
  <div class="index-container">
    <div class="header">
      <img src="http://video.greatorange.cn/cofevip.jpg" class="headerImg" />
    </div>
    <div class="content">
      <p>有趣的灵魂在这里相遇~</p>
      <h2>天空之橙购票入口~</h2>
      <h5>2021.11.01-2022.05.31</h5>
      <h5>￥20~￥54</h5>
      <div class="desc">
        <p>人一票,凭票入场。(PS:每天09:00-22:00)</p>
        <p>门票请当天购买,仅购买当天有效。</p>
        <p>PS.系统每天会自动核销,提前购买门票作废</p>
        <p>一定要看好下方的活动须知哦!!!</p>
      </div>
    </div>
    <!-- 活动介绍 -->
    <div class="bottom">
      <van-cell
        v-for="item in setList"
        :key="item.id"
        :title="item.title"
        is-link
        :arrow-direction="ITEMID == item.id ? 'down' : ''"
        clickable
        @click="onclick(item.id)"
      >
        <template #label>
          <div v-if="ITEMID == item.id">
            <p v-for="(decItem, decIndex) in item.dec">{{ decItem }}</p>
          </div>
        </template>
      </van-cell>
    </div>
    <div class="button">
      <!-- v-if="isVip" -->
      <van-button v-if="!isVip" round block color="#000000" @click="payVipOrder">立即购买</van-button>
      <van-button v-if="isVip" round block color="#000000" @click="addCard">立即领取</van-button>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { setToken, getToken } from '@/utils/loaclStting.js'
import { overdueToken } from '@/utils/wxload.js'
import { compareArray } from './comp'
import { Toast } from 'vant'
export default {
  data() {
    return {
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
      setList: [
        {
          id: 1,
          title: '活动时间',
          dec: ['即日起至2021.05.31（PS：每天9：00-22:00）']
        },
        {
          id: 2,
          title: '活动地址',
          dec: ['张店区上海路与和平路交叉口天空之双创艺术空间']
        },
        {
          id: 3,
          title: '活动规则',
          dec: [
            '注意事项',
            '1、不要踩室内室外的石子;',
            '2、请不要踩空间内的椅子&沙发;',
            '3、请随身携带您的衣物,请勿乱放,不要影响他人的参观感受;',
            '4.室内禁止吸烟,室外有专门吸烟区;',
            '5、垃圾请入垃圾桶,不要随处乱丢;',
            '6请在使用后及时归位空间内所属物品(桌椅、书籍、装饰物);',
            '7、请勿移动二楼展品;',
            '8、请轻拿轻放所有玻璃、陶瓷等易碎材质物品;',
            '9.禁止携带专业设备(单反、打光板、云台支架等)变装拍摄,',
            '如有商拍需要请致电Tel17864211712(小爱同学)。'
          ]
        }
      ],
      QM: ''
    }
  },
  computed: {
    isVip() {
      return this.userInfo.vip_time_out >= +new Date() / 1000
    }
  },
  created() {
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
      this.Api.queryVipOrder({ out_trade_no: data }).then(res => {
        Toast.success('支付成功')
        this.addCard() //添加卡片
      })
    },

    addCard() {
      let that = this
      let { vip_code, gh_openid } = this.userInfo
      let cardId = 'p0--VxG4NjeyKajM2cREPvC-Q7-s'
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
        that.Api.getApiTicket().then(Ticket => {
          console.log('Ticket', Ticket)
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
    // createdQM(list) {
    //   let strArr = []
    //   for (const key in list) {
    //     if (Object.hasOwnProperty.call(list, key)) {
    //       const element = list[key]
    //       strArr.push(element)
    //     }
    //   }
    //   console.log('compareArray', compareArray(strArr,))
    //   // let newarr = t.sort(function (e, t) {
    //   //   return e >= t ? 1 : -1
    //   // })
    //   let newarr = Array.prototype.sort.call(strArr, function (a, b) {
    //     for (var i = 0; i < a.length; i++) {
    //       console.log(b.charCodeAt(i))
    //       if (a.charCodeAt(i) == b.charCodeAt(i)) continue
    //       return a.charCodeAt(i) - b.charCodeAt(i)
    //     }
    //   })
    //   console.log('newarr', newarr)
    //   let QM = CryptoJS.SHA1(newarr.join('')).toString()
    //   console.log('QM', QM)
    //   return QM
    // }
  }
}
</script>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .header {
    width: 100%;
    box-sizing: border-box;
    .headerImg {
      width: 100%;
      height: auto;
    }
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
    bottom: 20px;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
  }
}
</style>
