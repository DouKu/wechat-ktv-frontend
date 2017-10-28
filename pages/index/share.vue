<template>
  <div :class="['p-share',{'no-scroll': showModel}]">
    <audio ref="preAudio" :src="preUrl" preload="true" @ended="preAudioEnd"></audio>
    <audio ref="afterAudio" :src="finalUrl" @ended="afterAudioEnd" preload="true"></audio>
    <img class="w-theme-show" src="~assets/images/personal/theme.png"></img>
    <div class="w-dick-container">
      <div :class="['w-dick-progress', progress]">
        <img :class="['w-song-image', { rotation: status }]" src="~assets/images/xin.png">
          <template v-if="!status"><div class="w-action-btn w-action-btn-play" @click="toPlay"></div></template>
          <template v-else><div class="w-action-btn w-action-btn-pause" @click="toStop"></div></template>
        </img>
      </div>
    </div>
    <div class="w-score-container-share">
      <h1>{{self ? '您' : '他'}}的歌声贡献了<span>{{userScore}}</span>分, 整首歌曲获得<span>{{chorus.totalScore}}</span高>分</h1>
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
        <div class="w-user-detail-container" v-for="(item, index) in joinUsers" :key="index">
          <img :src="item.headimgurl"></img>
          <p>{{item.nickname}}</p>
        </div>
        <img class="w-user-decorate" src="~assets/images/share/line.png"></img>      
      </div>
    </div>
    <div class="w-btn-container">
      <div v-show="toJoinFlag" class="w-continue-btn" @click="toJoin">为TA接着唱<img src="~assets/images/play.png"></img></div>
      <div class="w-share-btn" @click="toShareFriend">邀请好友帮帮唱<img src="~assets/images/play.png"></img></div>
      <div v-show="toPlayFlag" class="w-share-btn" @click="toPlay">我也要玩<img src="~assets/images/play.png"></img></div>
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
    this.init()
    const wx = window.wx
    if (!config.auth && this.$route.path === '/share') {
      const res = await axios.request({
        url: `${config.baseUrl}/api/wechat/getJSConfig`,
        method: 'get',
        params: {
          url: window.location.href
        }
      })
      wx.config(res.data.data)
      wx.ready(() => {
        wx.onMenuShareTimeline({
          title: config.title,
          desc: config.inviteDesc(this.chorus.totalScore),
          link: config.inviteLink(this.$route.query.chorusId, this.$route.query.openid || window.localStorage.getItem('openid')),
          imgUrl: config.imgUrl,
          success: () => {
          },
          cancel: () => {
          }
        })
        wx.onMenuShareAppMessage({
          title: config.title,
          desc: config.inviteDesc(this.chorus.totalScore),
          link: config.inviteLink(this.$route.query.chorusId, this.$route.query.openid || window.localStorage.getItem('openid')),
          imgUrl: config.imgUrl,
          success: () => {
          },
          cancel: () => {
          }
        })
        config.auth = true
      })
      wx.error(function (res) {
        console.log('wx jsapi err:', res)
      })
    }
  },
  methods: {
    async init () {
      const openid = window.localStorage.getItem('openid')
      if (!openid && !dev) {
        window.location.href = `${config.redirectUrl}?redirect=share`
        return
      }
      if (!this.$route.query.chorusId && !dev) {
        window.location.href = `${config.redirectUrl}/rule`
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
      this.joinUsers.push({
        headimgurl: 'http://os32fgzvj.bkt.clouddn.com/xin-avator.png',
        nickname: '信'
      })
      this.chorus.users.forEach(user => {
        this.joinUsers.push({
          headimgurl: user.user.headimgurl,
          nickname: user.user.nickname
        })
      })
      const len = 5 - this.joinUsers.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          this.joinUsers.push({
            headimgurl: userImg,
            nickname: '未加入'
          })
        }
      }
      this.toPlayFlag = true
      this.chorus.users.forEach(item => {
        if (item.user.openid === openid) {
          this.toJoinFlag = false
        }
      })
      if (len < 1) {
        this.toJoinFlag = false
      }
      this.chorus.users.forEach((item, index) => {
        if (item.user.openid === this.shareOpenId) {
          this.userScore = item.extendMessage.point
        }
      })
      if (openid === this.chorus.users[0].user.openid) {
        this.toPlayFlag = false
      }
      if (openid === this.shareOpenId) {
        this.self = true
      } else if (openid === this.chorus.users[0].user.openid) {
        this.self = true
        this.userScore = this.chorus.users[0].extendMessage.point
      } else {
        this.self = false
      }
      if (config.dev) {
        this.toJoinFlag = true
      }
    },
    toContinue () {
      this.$refs.afterAudio.play()
      this.audioIndex = 2
    },
    toPlay () {
      this.status = true
      if (this.audioIndex === 1) {
        this.$refs.preAudio.play()
      } else {
        this.$refs.afterAudio.play()
      }
    },
    toStop () {
      this.status = false
      if (this.audioIndex === 1) {
        this.$refs.preAudio.pause()
      } else {
        this.$refs.afterAudio.pause()
      }
    },
    toJoin () {
      window.location.href = `${config.redirectUrl}/personal?chorusId=${this.chorusId}&musicId=${this.chorus.audio._id}`
    },
    toPlay () {
      window.location.href = `${config.redirectUrl}/cover`
    },
    preAudioEnd () {
      this.showTip = true
    },
    afterAudioEnd () {
      this.status = false
      this.audioIndex = 1
    },
    toShareFriend () {
      this.showModel = true
    }
  },
  data () {
    return {
      shareOpenId: this.$route.query.openid,
      userScore: 0,
      self: true,
      audioIndex: 1,
      showTip: false,
      progressNum: 0,
      chorusId: '',
      chorus: {
        user: []
      },
      joinUsers: [],
      preUrl: '',
      finalUrl: '',
      toJoinFlag: true,
      status: false,
      showModel: false,
      toPlayFlag: false
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
  width: 90px;
  height: 90px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.w-action-btn-play {
  background-image: url("~assets/images/personal/play.png");
}
.w-action-btn-pause {
  background-image: url("~assets/images/personal/pause.png");
}

.w-score-container-share {
  position: relative;
  top: -20px;
  width: 100%;
  height: 50px;
}
.w-score-container-share h1 {
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
  width: 100%;
  height: auto;
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
  display: inline;
  width: 300px;
  text-align: center;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
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
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  top: 120px;
  left: 0;
  right: 0;
  margin: auto;
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
  top: 160px;
  flex-direction: column;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-continue-btn, .w-share-btn {
  width: 360px;
  height: 100px;
  font-size: 30px;
  line-height: 120px;
  text-align: center;
  color: #ffb5ff;
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
  top: 230px;
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

