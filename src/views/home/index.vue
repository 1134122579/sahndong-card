<!-- home -->
<template>
  <div class="index-container">
    <div class="header">
      <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" class="headerImg" />
    </div>
    <div class="content">
      <p>有趣的灵魂在这里相遇~</p>
      <h2>天空之橙购票入口~</h2>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
      <p>即日起-2022.05.31</p>
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
      <van-button round block color="#000000" @click="addCard">立即购买</van-button>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { setToken, getToken } from '@/utils/loaclStting.js'
import { overdueToken } from '@/utils/wxload.js'
import { compareArray } from './comp'

import API from '@/api'
export default {
  data() {
    return {
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
          dec: ['即日起至2021.05.31（PS：每天9：00-22:00）']
        },
        {
          id: 3,
          title: '活动地址',
          dec: ['即日起至2021.05.31（PS：每天9：00-22:00）']
        }
      ],
      QM: ''
    }
  },

  computed: {},
  created() {
    if (!getToken()) {
      overdueToken()
    } else {
      API.getUserInfo().then(res => {
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
      API.payVipOrder({
        pay_type: 1
      }).then(res => {
        console.log(res)
      })
    },

    addCard() {
      let that = this
      let { vip_code, gh_openid } = this.userInfo
      let cardId = 'p0--VxA2Y-Ptv4y_cjZfGXImPSi4'
      API.getShare({
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
        API.getApiTicket().then(Ticket => {
          console.log('Ticket', Ticket)
          API.cardExtSignPackage({ card_id: cardId, code: vip_code, openid: gh_openid, timestamp }).then(
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
      letter-spacing: 4px;
    }
    p {
      padding: 10px 0;
      letter-spacing: 4px;
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
