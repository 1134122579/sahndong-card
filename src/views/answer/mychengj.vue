<template>
  <div class="chengji_page">
    <!-- 成绩单  -->
    <div class="c_content">
      <!-- 头像 -->
      <div class="header">
        <van-image :src="userinfo.headimgurl" round width="82" height="82"></van-image>
      </div>
      <!-- 成绩 -->
      <div class="chjengji">{{ this.$route.query.score ? this.$route.query.score * 20 : userinfo.today_score }}分</div>
      <!-- 答题次数 -->
      <div class="num">今日答题次数:{{ userinfo.today_count }}次</div>
    </div>
    <div class="backbutton" @click="next">
      <!-- 返回首页 -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userinfo: {},
      is_score: false
    }
  },
  created() {
    // if()
    this.UserInfo()
  },
  methods: {
    next() {
      this.$router.push({ path: '/' })
    },
    // 获取用户信息
    UserInfo() {
      this.Api.getUserInfo().then(res => {
        this.userinfo = res.data
      })
    }
  }
}
</script>

<style lang="scss">
.chengji_page {
  width: 100%;
  height: 100%;
  // background: #770817 url('http://mdcdn.nxcsoft.top/bj.jpg') no-repeat;
  // background: #7a1417 url('../../assets/mybj.png') no-repeat;

  background: #7a1417 url('http://mdcdn.nxcsoft.top/mybj_1.png') no-repeat;

  background-size: 100% auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .c_content {
    width: 330px;
    height: 420px;
    background: url('http://mdcdn.nxcsoft.top/kapian_bj.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding: 70px 0 44px 0;
    .header {
      width: 100px;
      height: 3.8rem;
      background: url('../../assets/touxiang_bj.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding-top: 1.1rem;
    }
    .chjengji {
      font-size: 50px;
      // margin: 20px 0;
      font-weight: 600;
    }
    .num {
      width: 74%;
      height: 40px;
      background: url('../../assets/defen_bj.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      color: #fcdda7;
      padding-top: 10px;
    }
  }
  .backbutton {
    width: 50%;
    height: 80px;
    background: url('../../assets/zaidayici.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
