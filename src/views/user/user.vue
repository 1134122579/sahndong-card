<template>
  <div class="userinfoStyle">
    <div class="header">
      <van-nav-bar title="用户信息" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="eitUser">
      <van-form @submit="onSubmit">
        <div class="upload">
          <van-uploader :after-read="afterRead">
            <van-image v-if="!cardImg" :src="card_Z"></van-image>
            <van-image v-if="cardImg" height="240" :src="cardImg"></van-image>
          </van-uploader>
        </div>
        <van-field
          v-model="userInfo.name"
          name="name"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="userInfo.mobile"
          type="tel"
          name="mobile"
          label="手机"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field
          v-model="userInfo.idcard"
          name="idcard"
          label="身份证"
          placeholder="请输入身份证"
          :rules="[{ required: true, message: '请填写身份证' }]"
        />
        <van-field
          v-model="userInfo.address"
          name="address"
          label="地址"
          placeholder="请输入地址"
          :rules="[{ required: true, message: '请填写地址' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" color="#000000" native-type="submit">认证</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'

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
      console.log(file)
      let that = this
      let fromData = new FormData()
      fromData.append('file', file.file)
      this.Api.upCardImage(fromData).then(res => {
        console.log(res, 'upCardImage')
        that.cardImg = res.data.imgLink
        that.userInfo.idcard = res.data.cardInfo['公民身份号码']
        that.userInfo.name = res.data.cardInfo['姓名']
        that.userInfo.address = res.data.cardInfo['住址']
      })
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
  padding-bottom: 40px;
  .eitUser {
    .van-cell {
      padding: 0.667rem 0.43rem;
    }
    .upload {
      display: flex;
      background: #fff;
      border-bottom: 1px solid #ebedf0;
      box-sizing: border-box;
      padding: 20px;
      justify-content: center;
      .van-uploader {
        box-sizing: border-box;
        padding: 10px;
      }
    }
  }
}
</style>
