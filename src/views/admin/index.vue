<template>
  <div class="userinfoStyle">
    <!-- <div class="header">
      <van-nav-bar title="用户认证" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div> -->
    <div class="content_b">
      <div class="eitUser">
        <h4>天空精酿赠礼卡</h4>
        <div id="qrcode" ref="qrcode"></div>
        <van-button
          class="buttontext img_animes"
          type="primary"
          round
          block
          @click="createSkybeerCode"
          size="small"
          color="#EC6925"
          >立即更新</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { Toast } from 'vant'
import { compressImg } from '@/utils/compressImg'
export default {
  data() {
    return {
      qrcodecreated: null,
      cardImg: '',
      card_Z: require('@/assets/card_z.png'),
      card_F: require('@/assets/card_f.png'),
      fileList: [],
      userInfo: ''
    }
  },
  created() {
    this.getinfoil()
    this.createSkybeerCode()
  },
  mounted() {
    this.qrcode()
  },
  methods: {
    createSkybeerCode() {
      Toast.loading('加载中..')
      this.Api.createSkybeerCode().then(res => {
        console.log(res)
        Toast.clear()
        let data = `http://api.skyorange.cn/wxh5/giveshop?vipcode=${res.data.code}`
        this.qrcodecreated.clear() // 清除二维码
        this.qrcodecreated.makeCode(data) // 也可以调用方法生成二维码，好处
      })
    },
    // 生成二维码
    qrcode(data = '') {
      let qrcodeName = this.$refs.qrcode
      console.log(qrcodeName)
      this.qrcodecreated = new QRCode(qrcodeName, {
        render: 'canvas', //也可以替换为table
        width: 250,
        height: 250,
        colorDark: '#000',
        colorLight: '#fff'
      })
      this.qrcodecreated.clear() // 清除二维码
      this.qrcodecreated.makeCode(data) // 也可以调用方法生成二维码，好处就是可以先清除在生成
    },
    async getinfoil() {
      let that = this
      let res = await this.Api.getUserInfo()
      console.log(res.data)
      that.userInfo = res.data
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let that = this
      this.$toast.loading({ message: '上传中...' })
      console.log(file.file.size, '压缩前')
      compressImg(file.file).then(res => {
        res = that.dataURLtoFile(res)
        console.log('compressImg', res)
        let data = res.sise > file.file.size ? file.file : res
        if (data.size / 1024 / 1024 > 2) {
          that.$toast.clear()
          return false
        }
        let fromData = new FormData()
        fromData.append('file', data)
        this.Api.upCardImage(fromData).then(res => {
          console.log(res, 'upCardImage')
          that.$toast.clear()
          that.cardImg = res.data.imgLink
          that.userInfo.idcard = res.data.cardInfo['公民身份号码']
          that.userInfo.name = res.data.cardInfo['姓名']
          that.userInfo.address = res.data.cardInfo['住址']
        })
      })
    },
    dataURLtoFile(dataurl, filename) {
      // 生成Blob
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    onClickLeft() {
      console.log('返回')
      this.$router.go(-1)
    },
    onSubmit(e) {
      console.log(e)
      let that = this
      let { idcard, address, name, mobile } = this.userInfo
      this.Api.authUserInfo({ idcard, address, name, mobile }).then(res => {
        Toast.success('认证成功')
        setTimeout(() => {
          that.$router.go(-1)
        }, 1500)
      })
    }
  }
}
</script>

<style lang="scss">
.userinfoStyle {
  width: 100%;
  height: 100vh;
  background: #94908d url('http://mfyfile.greatorange.cn/skyauth.png') no-repeat;
  background-size: 100% auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .header {
    width: 100%;
  }
  .content_b {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    .contentimg {
      width: 80%;
    }
    .bottomtimg {
      width: 100%;
    }
  }

  .eitUser {
    margin-top: 134px;
    padding: 10px;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    h4 {
      text-align: center;
      font-weight: bold;
    }
    // margin-top: 100%;
    // .van-cell {
    //   padding: 0.667rem 0.43rem;
    // }
    .upload {
      display: flex;
      background: #fff;
      border-bottom: 1px solid #ebedf0;
      box-sizing: border-box;
      padding: 20px;
      justify-content: center;
      .rz {
        color: #1900f7;
        text-align: center;
        font-size: 14px;
      }
      .van-uploader {
        box-sizing: border-box;
        // padding: 10px;
      }
    }
    #qrcode {
      // width: 250px;
      // height: 250px;
      margin: 14px;
    }
  }
}
</style>
