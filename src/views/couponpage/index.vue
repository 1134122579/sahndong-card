<template>
  <div class="index-container" id="index-container">
    <!-- <img src="http://mfyfile.greatorange.cn/skyauth.png" class="headerImg" /> -->
    <div class="button_">
      <div class="coup_bg">
        <van-button class="buttontext img_animes" round block @click="ReceiveCoupon">立即领取</van-button>
      </div>
      <div style="margin: 5px 0 10px">
        <p class="tagone">本券当日有效，每人每天限用一张</p>
        <p>*如有疑问请咨询店内服务人员</p>
      </div>
      <div class="couponList">
        <div class="couponList_title">我的领取记录</div>
        <div class="couponList_nav">
          <p
            v-for="item in statusType"
            :class="status == item.status ? 'sur' : ''"
            :key="item.status"
            @click="navButton(item.status)"
          >
            {{ item.name }}
          </p>
        </div>
        <ul v-if="list.length > 0" class="nullstyle">
          <li v-for="item in list" :key="item.id">
            <div class="content_list">
              <h5>{{ item.code }}</h5>
              <p>{{ item.create_time }}</p>
            </div>
            <div
              :class="item.status == 2 ? (item.isshixiao ? 'shixiao shiyong' : 'shiyong') : 'shixiao shiyong'"
              @click="iscodebutton(item.code, item)"
            >
              {{ item.status == 2 ? (item.isshixiao ? '已失效' : '未使用') : '已使用' }}
            </div>
          </li>
        </ul>
        <div v-if="list.length <= 0" class="nullstyle">
          <van-empty description="暂无数据" />
        </div>
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
        <p>抵扣券仅限当日有效</p>
        <div id="qrcode" ref="qrcode"></div>
        <p>核销后失效</p>
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
import { parseTime } from '@/utils/index'

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
      statusType: [
        {
          status: 2,
          name: '未使用'
        },
        {
          status: 1,
          name: '已使用'
        }
      ],
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
      payToolsOrderApi: {},
      list: [],
      status: 2
    }
  },
  created() {
    this.onePlay()
  },

  mounted() {},
  methods: {
    navButton(status) {
      if (status == this.status) return
      this.status = status
      this.getCouponLog()
    },
    // 获取列表
    getCouponLog() {
      this.Api.getCouponLog({ status: this.status }).then(res => {
        res.data = res.data.map(item => {
          // new Date(parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')).getTime()
          item['isshixiao'] =
            new Date(item['create_time'].replaceAll('-', '/')).getTime() >
            new Date(parseTime(new Date(), '{y}/{m}/{d}') + ' 00:00:00')
              ? false
              : true
          return item
        })
        console.log(res.data)
        this.list = res.data
      })
    },
    // 领取
    ReceiveCoupon() {
      this.Api.ReceiveCoupon().then(res => {
        this.iscodebutton(res.data.coupon_code)
      })
    },
    iscodebutton(coupon_code, item) {
      if (item && item.status == 1) {
        this.$toast.fail('已使用')
        return
      }
      if (item && item.isshixiao) {
        this.$toast.fail('已失效')
        return
      }
      // let text = `${location.origin}${location.pathname}/applypage?couponcode=${coupon_code}`
      let text = `http://api.skyorange.cn/wxh5/applypage?couponcode=${coupon_code}`
      this.qrcodecreated.clear() // 清除二维码
      this.qrcodecreated.makeCode(text) // 也可以调用方法生成二维码，好处
      this.show = true
      this.getCouponLog()
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
          this.getCouponLog()
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
<style lang="scss" scoped>
@import '@/assets/css/formStyle.scss';
.index-container {
  // background: #94908d url('http://mfyfile.greatorange.cn/skyauth.png') no-repeat;
  background: #94908d url('../../assets/couponpage_bg.png') no-repeat;
  background-size: 100% auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  color: #595656;
  // 领取
  .button_ {
    width: 100%;
    margin-top: 2.76667rem;
    .coup_bg {
      background: url('../../assets/coupon_bg.png') no-repeat;
      background-size: 100% auto;
      height: 6.53333rem;
      box-sizing: border-box;
      padding-top: 110px;
      margin: 0 10px;
      overflow: hidden;
      .buttontext {
        background: #ea584e;
        color: #fff;
        width: 60%;
        margin: 0 auto;
        font-weight: 600;
      }
    }
    .tagone {
      font-size: 16px;
      font-weight: 600;
    }
    p {
      font-size: 12px;
      text-align: center;
      line-height: 1.5;
      color: #fff;
    }
    .couponList {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      margin: 20px 10px 30px;
      box-sizing: border-box;
      background: #fff;
      padding: 0 10px 10px;
      border-radius: 10px;
      text-align: center;
      line-height: 1.8;
      font-size: 16px;
      height: 350px;
      .couponList_title {
        font-size: 18px;
        padding: 4px 14px;
        text-align: left;
        width: 100%;
        flex-shrink: 0;
        box-sizing: border-box;
      }
      .couponList_nav {
        flex-shrink: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ec6925;
        padding: 4px;
        border-radius: 30px;
        margin-bottom: 10px;
        box-sizing: border-box;
        p {
          border-radius: 30px;
          line-height: 2;
          width: 150px;
        }
        .sur {
          background: #fff;
          color: #ec6925;
          // color: #595656;
        }
      }
      ul {
        box-sizing: border-box;
        flex: 1;
        width: 100%;
        overflow-y: auto;
        li {
          font-size: 14px;
          display: flex;
          padding: 5px 0;
          margin-bottom: 10px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eceaea;
          .content_list {
            color: #595656;
            text-align: left;
            h5 {
              font-weight: bold;
            }
            p {
              text-align: left;
              font-size: 12px;
              color: #595656;
              line-height: 1;
            }
          }
          .shiyong {
            border-radius: 40px;
            border: 1px solid #ec6927;
            font-size: 14px;
            padding: 0 14px;
            color: #ec6927;
            height: 25px;
            line-height: 25px;
          }
          .shixiao {
            color: #ccc;
            border: 1px solid #ccc;
          }
        }
      }
      .nullstyle {
        flex: 1;
        box-sizing: border-box;
        width: 100%;
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
