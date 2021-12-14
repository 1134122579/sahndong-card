<template>
  <div class="ans_style">
    <!-- 进度条 -->
    <!-- home页 -->
    <div class="home_page" v-show="is_home">
      <div class="left">
        <div class="ranking block" @click="rankingButton">成绩单</div>
        <div class="rule block" @click="ruleButton">活动说明</div>
      </div>

      <div class="start_button" @click="gostart"></div>
    </div>
    <!-- 学习视频播放页 -->
    <div class="learn_page" v-show="is_learn">
      <div class="learn_title">
        {{ qishuObj.name }}
      </div>
      <div class="video_style">
        <vueMiniPlayer
          ref="vueMiniPlayer"
          :video="video"
          :mutex="true"
          @fullscreen="handleFullscreen"
          @videoPlay="videoPlay"
        />
      </div>

      <div class="look_video">
        <van-button color="linear-gradient(to right, #FFF4C6, #CF9660)" block round size="small " @click="gitData">
          立即答题
        </van-button>
      </div>
    </div>

    <!-- 答题 -->
    <div class="ans_page" v-show="is_ans">
      <div class="ans_list">
        <!-- 题目 -->
        <div class="ans_list_anscontent">
          <!-- 上边 -->
          <div class="ans_list_anscontent_top">
            <div class="ans_list_anscontent_top_l">
              <p></p>
              <p>第{{ 5 - ProblemList.length }}/5题目</p>
            </div>
          </div>
          <!-- 中间 -->
          <!-- 单选 -->
          <div class="problem_content" v-show="ProblemObj.type == 1">
            <!-- <span>单选</span> -->
            <h5>{{ ProblemObj.title }}</h5>
            <ul>
              <li
                v-for="item in ProblemObj.ans"
                :key="item.number"
                :class="
                  (correctId == item.number ? 'Problemcorrect' : '',
                  correctId ? (item.number == ProblemObj.right_key ? 'Problemcorrect' : 'Problemerror') : '')
                "
                @click="onselect(item.number)"
              >
                {{ item.number }}.{{ item.content }}
              </li>
            </ul>
          </div>
          <!-- 多选 -->
          <div class="problem_content" v-show="ProblemObj.type == 2">
            <h6>多选</h6>
            <h5>{{ ProblemObj.title }}</h5>
            <ul>
              <li
                v-for="item in ProblemObj.ans"
                :key="item.number"
                :class="classFilter(checkboxId, item.number)"
                @click="oncheckbox(item.number)"
              >
                {{ item.number }}.{{ item.content }}
              </li>
            </ul>
          </div>
        </div>
        <div class="ans_button" @click="goNext">
          {{ ProblemList.length > 0 ? ' 下一题' : ' 立即提交' }}
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <van-popup v-model="show" round class="poup_" closeable>
      <div class="poup_content">
        <h6>活动说明</h6>
        <div class="poup_text" v-html="getRuletext"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { UrlCode, getUrlKey } from '@/utils/wxload.js'
import { setToken, getToken } from '@/utils/loaclStting.js'

export default {
  data() {
    return {
      show: false,
      userinfo: {},
      getRuletext: '',
      video: {
        url: '',
        cover: '',
        muted: false,
        loop: false,
        preload: 'auto',
        poster: '',
        volume: 1,
        autoplay: false
      },
      sc_icon: require('../../assets/sc.png'),
      is_upsce: false,
      is_home: true,
      is_ans: false,
      is_learn: false,
      is_start: false,
      qishuObj: {},
      correctId: '', //单选
      checkboxId: [], //多选
      nullproblem: false,
      is_okproblem: false,
      ProblemList: [],
      ProblemObj: {}, // 获取一道题
      Problemcorrect: [], //正确题目
      Problemerror: [] //c错误题目
    }
  },
  computed: {
    $video() {
      return this.$refs.vueMiniPlayer.$video
    }
  },
  created() {
    this.login()
    this.getReport()
    this.getQiShu()
    this.UserInfo()
  },
  methods: {
    // 获取用户信息
    UserInfo() {
      this.Api.getUserInfo().then(res => {
        this.userinfo = res.data
      })
    },
    getReport() {
      this.Api.getRule().then(res => {
        console.log(res)
        this.getRuletext = res.data
      })
    },
    // 登陆
    login() {
      let code = getUrlKey('code')
      if (!getToken()) {
        if (code) {
          this.Api.login({
            code
          }).then(res => {
            setToken(res.data.token)
            window.location.replace(window.location.origin + window.location.pathname)
          })
        } else {
          UrlCode()
        }
      }
    },
    // 播放
    videoPlay(event) {
      console.log(event)
    },
    // 获取期数
    getQiShu() {
      this.Api.getQiShu().then(res => {
        console.log(res)
        this.qishuObj = res.data
        this.video.url = res.data.video_url
        this.video.cover = res.data.cover
      })
    },
    // 判断样式
    classFilter(arry, id) {
      if (arry.indexOf(id) > -1) {
        return 'Problemcorrect'
      }
    },
    // 多选
    oncheckbox(id) {
      let checkboxId = this.checkboxId
      if (checkboxId.indexOf(id) > -1) {
        this.checkboxId = checkboxId.filter(item => item == id)
      } else {
        this.checkboxId.push(id)
      }
    },

    // 单选择
    onselect(id) {
      if (!this.correctId) {
        this.correctId = id
        this.is_problem()
      }
    },
    // 判断是否正确
    is_problem() {
      let problemObj = this.ProblemObj
      let correctId = this.correctId
      let checkboxId = this.checkboxId
      console.log(213212123, correctId)
      if (!correctId) {
        that.$toast.fail('请选择答案')
        return
      }
      if (problemObj.type == 1) {
        if (correctId == problemObj.right_key) {
          this.Problemcorrect.push(problemObj)
          this.is_okproblem = true
          this.$toast.success({
            message: '回答正确',
            duration: 500
          })
        } else {
          this.Problemerror.push(problemObj)
          this.$toast.fail({
            message: '回答错误',
            icon: 'cross',
            duration: 500
          })
          this.is_okproblem = false
        }
      } else if (problemObj.type == 2) {
        if (checkboxId.toString() == problemObj.right_key) {
          this.Problemcorrect.push(problemObj)
          this.is_okproblem = true
          this.$toast.success('回答正确')
        } else {
          this.Problemerror.push(problemObj)
          this.is_okproblem = false
          this.$toast.fail({
            message: '回答错误',
            icon: 'cross',
            duration: 500
          })
        }
      }
    },

    // 开始学习
    gostart() {
      this.is_home = false
      this.is_learn = true
      this.is_ans = false
    },
    // 开始答题
    gostatus() {
      console.log(this.userinfo)
      if (this.userinfo.today_count < this.userinfo.all_count) {
        this.is_home = false
        this.is_learn = false
        this.is_ans = true
        this.$refs.vueMiniPlayer.handlePaused()
        this.nextproblrm()
      } else {
        this.$toast({
          message: '今日答题次数已用完',
          position: 'top',
          forbidClick: true
        })
      }
    },
    goNext() {
      if (!this.correctId) {
        this.$toast.fail({
          message: '请选择答案',
          icon: 'cross',
          forbidClick: true
        })
        return
      }
      this.nextproblrm()
    },
    // 下一题
    nextproblrm() {
      let that = this
      if (this.ProblemList.length > 0) {
        that.ProblemObj = that.ProblemList.splice(0, 1)[0]
        that.correctId = ''
        that.is_okproblem = false
        that.checkboxId = []
        console.log(that.ProblemObj)
      } else {
        that.nullproblem = false
        if (this.is_upsce) {
          return
        }
        this.is_upsce = true
        that.$toast.loading({
          message: '提交中...',
          forbidClick: true,
          duration: 0
        })
        that.Api.subProblem({ score: that.Problemcorrect.length > 0 ? that.Problemcorrect.length : 0 }).then(res => {
          console.log(res)
          if (res.status == 202) {
            that.$toast.fail({
              message: res.message,
              duration: 3000
            })
            setTimeout(() => {
              that.is_home = true
              that.is_ans = false
              that.is_upsce = false
              that.$toast.clear()
            }, 3000)
            return
          }
          this.$router.push({
            path: '/c',
            query: {
              score: that.Problemcorrect.length
            }
          })
          that.$toast.clear()
        })
      }
    },
    // 排行榜
    rankingButton() {
      console.log('排行榜')
      this.$router.push({
        path: '/c'
      })
    },
    // 活动说明
    ruleButton() {
      this.show = true
    },
    //视频吗
    handleFullscreen() {},
    // 获取题目
    gitData() {
      let that = this
      this.Api.getProblem().then(res => {
        that.ProblemList = res.data
        console.log(that.ProblemList)
        that.gostatus()
      })
    }
  }
}
</script>

<style lang="scss">
.ans_style {
  width: 100%;
  height: 100%;
  font-size: 20px;
  background: linear-gradient(#e19573, #eaaa82);

  // 首页
  .home_page {
    background: #770817 url('http://mdcdn.nxcsoft.top/home.png') no-repeat;
    background-size: 100% auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .left {
      margin-top: 74%;
      overflow: hidden;
      .block {
        border: 2px solid #fecf4a;
        border-left: none;
        writing-mode: vertical-rl;
        padding: 10px 5px 10px 4px;
        margin-top: 20px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.4);
        text-align: center;
        border-radius: 0 6px 6px 0;
        color: #fff4c6;
        letter-spacing: 2px;
      }
    }

    .start_button {
      position: fixed;
      bottom: 1.1rem;
      right: 0;
      left: 0;
      margin: 0 auto;
      background: url('../../assets/start_button.png') no-repeat;
      background-size: 100% 100%;
      width: 40%;
      height: 60px;
    }
  }
  // 学习页面
  .learn_page {
    background: #a10b0f;
    width: 100%;
    height: 100%;
    @include flexbox(center, center, column);
    .video_style {
      width: 100%;
      height: 200px;
    }
    .learn_title {
      margin: 40px 0;
      color: #fff4c6;
      font-weight: 600;
    }
    .look_video {
      width: 100%;
      box-sizing: border-box;
      padding: 40px 100px;
    }
  }
  // 答题
  .ans_page {
    // background: #da9369 url('../../assets/bg_dt_page.png') no-repeat;
    background: #da9369 url('http://mdcdn.nxcsoft.top/bg_dt_page.png') no-repeat;
    background-size: 100% auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ans_list {
      width: 94%;
      height: 12rem;
      background: url('../../assets/dt_bg.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      padding: 20px 10px;
      margin: 0 auto;
      margin-top: 41.8%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      .ans_list_anscontent {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        flex: 1;
        margin-top: -9px;
        overflow: auto;
        .ans_list_anscontent_top {
          width: 100%;
          .ans_list_anscontent_top_l {
            margin-bottom: 10px;
            @include flexbox(space-between, center);
            width: 100%;
            box-sizing: border-box;
            p {
              color: #fea03c;
              font-size: 18px;
            }
          }
        }
        .problem_content {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
          align-items: flex-start;
          overflow: auto;
          span {
            font-size: 16px;
            line-height: 40px;
          }
          h5 {
            text-indent: 16px;
            font-weight: 600;
            line-height: 1.5;
            font-size: 16px;
          }
          ul {
            flex: 1;
            overflow: auto;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;

            li {
              padding: 10px;
              width: 100%;
              font-weight: 600;
              box-sizing: border-box;
              border: 1px solid #e9e9ec;
              border-radius: 5px;
              margin-top: 10px;
            }
            .Problemcorrect {
              border: 1px solid #3176ea;
            }
            .Problemerror {
              border: 1px solid #bf4a4d;
            }
          }
        }
      }

      .ans_button {
        background: url('../../assets/ok_button.png') no-repeat;
        background-size: 100% 100%;
        width: 70%;
        height: 50px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        line-height: 50px;
      }
    }
  }

  // 弹窗
  .poup_ {
    width: 7.4rem;
    height: 340px;
    // background: #a91a1b;
    // color: #fff;

    .poup_content {
      height: 100%;
      overflow: auto;
      h6 {
        text-align: center;
        height: 10%;
        line-height: 4;
        font-weight: 700;
        font-size: 18px;
      }
      .poup_text {
        box-sizing: border-box;
        margin-top: 20px;
        padding: 0 20px;
        height: 80%;
        overflow: auto;
        font-size: 16px;
      }
    }
  }
}
</style>
