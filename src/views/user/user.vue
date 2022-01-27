<template>
  <div class="userinfoStyle">
    <div class="header">
      <van-nav-bar title="用户认证" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content_b">
      <!-- <img class="contentimg" src="../../assets/vipTitle.png" alt="" /> -->
      <div class="contentimg"></div>
      <div class="eitUser">
        <van-form @submit="onSubmit">
          <!-- <div class="upload">
            <van-uploader :after-read="afterRead">
              <van-image v-if="!cardImg" :src="card_Z"></van-image>
              <van-image v-if="cardImg" height="240" :src="cardImg"></van-image>
              <p class="rz">点击，快速认证</p>
            </van-uploader>sw
          </div> -->
          <van-field
            v-model="userInfo.name"
            name="name"
            label="姓名"
            placeholder="请填写姓名"
            required
            :rules="[{ required: true }]"
          />
          <van-field
            v-model="userInfo.mobile"
            type="tel"
            name="mobile"
            label="手机号"
            placeholder="请输入手机号"
            required
            :rules="[{ required: true }]"
          />
          <!-- <van-field v-model="userInfo.idcard" name="idcard" label="身份证" placeholder="请输入身份证" /> -->
          <!-- <van-field
          v-model="userInfo.address"
          name="address"
          label="地址"
          placeholder="请输入地址"
          :rules="[{ required: true, message: '请填写地址' }]"
        /> -->
          <div style="margin: 16px">
            <van-button round block size="small" type="info" color="#D85A1D" native-type="submit">立即认证</van-button>
          </div>
        </van-form>
      </div>
      <!-- <img class="bottomtimg" src="../../assets/bottom.png" alt="" /> -->
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { compressImg } from '@/utils/compressImg'
export default {
  data() {
    return {
      cardImg: '',
      card_Z: require('@/assets/card_z.png'),
      card_F: require('@/assets/card_f.png'),
      fileList: [],
      userInfo: ''
    }
  },
  created() {
    this.getinfoil()
  },
  methods: {
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
    padding: 10px;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
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
  }
}
</style>
