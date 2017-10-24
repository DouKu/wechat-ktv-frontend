<template>
  <div :class="['p-share',{'no-scroll': showModel}]">
    <audio ref="preAudio" :src="preUrl" preload="true" @ended="preAudioEnd"></audio>
    <audio ref="afterAudio" :src="finalUrl" @ended="afterAudioEnd" preload="true"></audio>
    <img class="w-theme-show" src="~assets/images/personal/theme.png"></img>
    <div class="w-dick-container">
      <div :class="['w-dick-progress', progress]">
        <img :class="['w-song-image', { rotation: status }]" src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg">
          <template v-if="!status"><div class="w-action-btn w-action-btn-play" @click="toPlay"></div></template>
          <template v-else><div class="w-action-btn w-action-btn-pause" @click="toStop"></div></template>
        </img>
      </div>
      <!-- <div class="w-dick-progress-icons-row">
        <div class="w-dick-progress-icon-lt"></div>
        <div class="w-dick-progress-icon-rt"></div>
      </div>
      <div class="w-dick-progress-icons-column">
        <div class="w-dick-progress-icon-ct"></div>
        <div class="w-dick-progress-icon-lb"></div>
        <div class="w-dick-progress-icon-rb"></div>
      </div> -->
    </div>
    <div class="w-score-container-share-share">
      <!-- <h1>您为这首歌曲贡献了<span>100</span>分</h1> -->
      <h1>您的歌曲获得了<span>{{chorus.totalScore}}</span>高分</h1>
      <h1>超过了100%的K歌之王</h1>
    </div>
    <div class="w-users-container">
      <div class="w-users-outline-box w-users-outline-box-left">
        <div class="w-users-outline w-users-outline-left"></div>
      </div>
      <div class="w-users-outline-title">帮帮唱团友</div>
      <div class="w-users-outline-box w-users-outline-box-right">
        <div class="w-users-outline w-users-outline-right"></div>
      </div>
      <div class="w-users-deatail-box">
        <div class="w-user-detail-container" v-for="(item, index) in chorus.users" :key="index">
          <img :src="item.user.headimgurl"></img>
          <p>{{item.user.nickname}}</p>
        </div>
        <img class="w-user-decorate" src="~assets/images/share/line.png"></img>      
      </div>
    </div>
    <div class="w-btn-container">
      <div v-show="toJoinFlag" class="w-continue-btn" @click="toJoin">参加歌唱<img src="~assets/images/play.png"></img></div>
      <div class="w-share-btn" @click="toShareFriend">好歌要分享<img src="~assets/images/play.png"></img></div>
    </div>
    <img src="~assets/images/share/code.png" class="w-star-code"></img>
    <share-model v-model="showModel"></share-model>
    <model v-model="showTip" @selectSong="toContinue"></model>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../config'
import userImg from '../../assets/images/user.png'
import model from '../../components/model'
import shareModel from '../../components/share-model.vue'
const dev = config.dev

export default {
  watch: {
    preUrl (val) {
      this.$refs.preAudio.src = val
    },
    finalUrl (val) {
      this.$refs.afterAudio.src = val
    }
  },
  computed: {
    progress () {
      return 'w-dick-progress-background-' + (this.progressNum + 1)
    }
  },
  async mounted () {
    const openid = window.localStorage.getItem('openid')
    if (!openid && !dev) {
      this.$router.push({ path: '/', query: { redirect: '/share' } })
      return
    }
    if (!this.$route.query.chorusId && !dev) {
      this.$router.push('/rule')
      return
    }
    this.chorusId = this.$route.query.chorusId
    const res = await axios.request({
      url: `${config.baseUrl}/api/auth/chorus/${this.chorusId}`,
      method: 'get'
    })
    this.chorus = res.data.data
    this.preUrl = this.chorus.audio.url
    this.finalUrl = this.chorus.recordUrl
    this.progressNum = res.data.data.users.length || 1
    this.$refs.preAudio.src = this.preUrl
    this.$refs.afterAudio.src = this.finalUrl
    const len = 5 - this.chorus.users.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        this.chorus.users.push({
          user: {
            headimgurl: userImg,
            nickname: '未加入'
          }
        })
      }
    }
    this.chorus.users.forEach(item => {
      if (item.user.openid === openid) {
        this.toJoinFlag = false
      }
    })
    this.settingShare()
  },
  methods: {
    toContinue () {
      this.$refs.afterAudio.play()
    },
    toPlay () {
      this.status = true
      this.$refs.preAudio.play()
    },
    toStop () {
    },
    toJoin () {
      this.$router.push({ path: '/personal', query: { chorusId: this.chorusId, musicId: this.chorus.audio._id } })
    },
    preAudioEnd () {
      this.showTip = true
    },
    afterAudioEnd () {
      this.status = false
    },
    async settingShare () {
      const wx = window.wx
      if (!config.auth) {
        const res = await axios.request({
          url: `${config.baseUrl}/api/wechat/getJSConfig`,
          method: 'get',
          params: {
            url: window.location.href
          }
        })
        wx.config(res.data.data)
        wx.ready(function () {
          console.log('config success')// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.log('wx jsapi err:', res)
        })
        config.auth = true
      }
      wx.onMenuShareTimeline({
        title: `广州美莱周年庆`, // 分享标题
        desc: `我在广州美莱周年庆ktv中获得${this.chorus.totalScore}分`, // 分享描述
        link: `${config.redirectUrl}/share?chorusId=${this.chorusId}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg', // 分享图标
        success: () => {
          console.log(config.recordId, '分享ID')
          console.log('分享成功')
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          console.log('分享失败')
          // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareAppMessage({
        title: `广州美莱周年庆`, // 分享标题
        desc: `我在广州美莱周年庆ktv中获得${this.chorus.totalScore}分`, // 分享描述
        link: `${config.redirectUrl}/share?chorusId=${this.chorusId}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg', // 分享图标
        // type: '', // 分享类型,music、video或link，不填默认为link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          console.log('分享成功')
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          console.log('分享失败')
          // 用户取消分享后执行的回调函数
        }
      })
    },
    toShareFriend () {
      this.showModel = true
    }
  },
  data () {
    return {
      showTip: false,
      progressNum: 0,
      chorusId: '',
      chorus: {
        user: []
      },
      preUrl: '',
      finalUrl: '',
      toJoinFlag: true,
      status: false,
      showModel: false
    }
  },
  components: {
    shareModel,
    model
  }
}
</script>

<style scoped>
.p-share {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-image: url('~assets/images/personal/background.jpg');
  background-size: 100% 100%;
  background-attachment: local;
  background-position: center center;
  background-repeat: no-repeat;
}
.w-theme-show {
  width: 100%;
  height: 400px;
  margin-top: 15px;
}

.w-dick-container {
  position: relative;
  top: -50px;
  left: 0px;
  width: 90%;
  height: 600px;
  background-image: url("~assets/images/personal/dick.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.w-dick-progress {
  background-size: 100% 100%;
  background-attachment: local;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 96px;
  left: 136px;
  width: 453px;
  height: 453px;
  border-radius: 50%;
}
.w-dick-progress-background-1 {
  background-image: url("~assets/images/progress/1.png");
}
.w-dick-progress-background-2 {
  background-image: url("~assets/images/progress/2.png");
}
.w-dick-progress-background-3 {
  background-image: url("~assets/images/progress/3.png");
}
.w-dick-progress-background-4 {
  background-image: url("~assets/images/progress/4.png");
}
.w-dick-progress-background-5 {
  background-image: url("~assets/images/progress/5.png");
}

.w-dick-progress-icons-row {
  position: absolute;
  top: 276px;
  left: 135px;
  width: 455px;
  height: 15px;
}
.w-dick-progress-icons-column {
  position: absolute;
  top: 91px;
  left: 224px;
  width: 275px;
  height: 416px;
}
.w-dick-progress-icon-ct, .w-dick-progress-icon-lt, .w-dick-progress-icon-rt, .w-dick-progress-icon-lb, .w-dick-progress-icon-rb {
  width: 10px;
  height: 10px;
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
}

.w-dick-progress-icon-ct {
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.w-dick-progress-icon-lt {
  top: 0;
  left: 0;
}
.w-dick-progress-icon-rt {
  top: 0;
  right: 0;
}
.w-dick-progress-icon-lb {
  bottom: 0;
  left: 0;
}
.w-dick-progress-icon-rb {
  bottom: 0;
  right: 0;
}

.w-song-image {
  width: 300px;
  height: 300px;
  border-radius: 50%;
}

.w-action-btn {
  z-index: 99;
  position: absolute;
  margin: 0 auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.w-action-btn-play {
  background-image: url("~assets/images/personal/play.png");
}
.w-action-btn-pause {
  background-image: url("~assets/images/personal/pause.png");
}

.w-score-container-share-share {
  position: relative;
  top: -20px;
  width: 100%;
  height: 50px;
}
.w-score-container-share-share h1 {
  text-align: center;
  margin: 0 0;
  font-size: 30px;
  color: #ffffff;
}
.w-score-container-share span {
  font-size: 45px;
  color: #0dccb0;
}

.w-users-container {
  position: relative;
  top: 50px;
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
}
.w-users-outline-box {
  position: absolute;
  top: 0;
  height: 60px;
  width: 160px;
  overflow: hidden;
}
.w-users-outline-box-left {
  left: 72px;
}
.w-users-outline-box-right {
  right: 72px;
}
.w-users-outline {
  position: absolute;
  top: 10px;
  width: 500px;
  height: 200px;  
  border: 5px solid #e0d6fe;
  box-shadow: -5px 0 30px #313777, 0 0 30px #313777, 10px 0 30px #313777, 0 5.5px 30px #313777;
  border-radius: 60px;
}
.w-users-outline-title {
  position: absolute;
  top: -10px;
  height: 50px;
  box-sizing: border-box;
  font-size: 42px;
  line-height: 50px;
  color: #e0d6fe;
  text-shadow: -5px 0 30px #313777, 0 0 30px #313777, 10px 0 30px #313777, 0 5.5px 30px #313777;
}
.w-users-outline-left {
  left: 10px;
}
.w-users-outline-right {
  right: 10px;
}

.w-users-deatail-box {
  width: 100%;
  height: 150px;
  position: relative;
  top: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.w-user-detail-container {
  position: relative;
  z-index: 10;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("~assets/images/share/circle.png");
  background-size: 100% 100%;
  background-attachment: local;
  background-position: center center;
  background-repeat: no-repeat;
}
.w-user-detail-container > img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.w-user-detail-container > p {
  position: absolute;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  top: 100px;
  font-size: 22px;
  font-weight: bold;
  color: white;
}

.w-user-decorate {
  top: 45px;
  left: -15px;
  width: 720px;
  height: 85px;
  position: absolute;
}

.w-btn-container {
  position: relative;
  top: 90px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-continue-btn, .w-share-btn {
  width: 360px;
  height: 100px;
  font-size: 35px;
  line-height: 120px;
  text-align: center;
  color: #ffb5ff;
  margin-bottom: 25px;
  background-image: url("~assets/images/pink-btn.png");
  background-repeat: no-repeat;
  background-size: cover;
  text-shadow: -5px 0 20px #ad47b2, 0 0 20px #ad47b2, 5px 0 20px #ad47b2, 0 5.5px 20px #ad47b2;
}

.w-continue-btn:active, .w-share-btn:active {
  transform: scale(1.2);
}

.w-continue-btn > img,
.w-share-btn > img {
  position: relative;
  top: 20px;
}

.w-star-code {
  position: relative;
  top: 100px;
  width: 700px;
  height: 350px;
}

.rotation {
  animation: rotating 6s infinite linear;
}

@keyframes rotating {
  from { 
    transform: rotate(0deg); 
  }
  to { 
    transform: rotate(360deg); 
  }
}
</style>

