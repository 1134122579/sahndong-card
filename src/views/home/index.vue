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
      console.log(1)
      API.payVipOrder({
        pay_type: 1
      }).then(res => {
        console.log(res)
      })
    },

    addCard() {
      let that = this
      let { qrcode, gh_openid } = this.userInfo
      let cardId = 'p0--VxA2Y-Ptv4y_cjZfGXImPSi4'
      API.getShare({
        url: location.href
      }).then(res => {
        let { rawString, nonceStr, timestamp, jsapi_ticket } = res.data
        console.log(res.data)
        that.$wx.ready(() => {
          // that.$wx.chooseCard({
          //   shopId: '', // 门店Id
          //   cardType: '', // 卡券类型
          //   cardId: '', // 卡券Id
          //   timestamp: Number(timestamp), // 卡券签名时间戳
          //   nonceStr: nonceStr, // 卡券签名随机串
          //   signType: 'SHA1', // 签名方式，默认'SHA1'
          //   cardSign: this.createdQM(res.data), // 卡券签名
          //   success: function (res) {
          //     var cardList = res.cardList // 用户选中的卡券列表信息
          //   }
          // })
          that.$wx.addCard({
            cardList: [
              {
                cardId: cardId,
                cardExt: this.createdQM({ jsapi_ticket, timestamp, nonceStr, cardId, qrcode, gh_openid })
              }
            ], // 需要添加的卡券列表

            success: function (res) {
              var cardList = res.cardList // 添加的卡券列表信息
              console.log('添加的卡券列表信息', cardList)
            }
          })
        })
      })
    },

    createButton() {
      let list = this.list
      this.QM = this.createdQM(list)
    },
    createdQM(list) {
      let t = []
      for (const key in list) {
        if (Object.hasOwnProperty.call(list, key)) {
          const element = list[key]
          t.push(element)
        }
      }
      let newarr = t.sort(function (e, t) {
        return e >= t ? 1 : -1
      })
      let QM = CryptoJS.SHA1(newarr.join('')).toString()
      return QM
    }
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
