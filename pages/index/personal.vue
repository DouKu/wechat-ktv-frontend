<template>
  <div class="p-personal">
    <audio ref="preAudio" :src="currentMusic.url" preload="true" @ended="preAudioEnd"></audio>
    <audio ref="afterAudio" :src="finalUrl" @ended="afterAudioEnd" preload="true"></audio>
    <img class="w-theme-show" src="~assets/images/personal/theme.png"></img>
    <div class="w-dick-container">
      <div :class="['w-dick-progress', progress]">
        <img :class="['w-song-image', { rotation: status }]" src="~assets/images/xin.png">
          <template v-if="!status"><div v-show="recorded" class="w-action-btn w-action-btn-play" @click="tryListen"></div></template>
          <template v-else><div v-show="recorded" class="w-action-btn w-action-btn-pause" @click="stopListen"></div></template>
        </img>
      </div>
    </div>
    <div class="w-lryic-container">
      <h2>曲目: {{musicName}}</h2>
      <h3 class="w-current-lryic">{{curLyric}}</h3>
      <h3>{{nextOneLyric}}</h3>
      <h3>{{nextTowLyric}}</h3>
    </div>
    <div class="w-btn-container">
      <div class="w-btn-item" @click="startRecordFull">{{recorded ? '重新录制' : chorusId ? '加入录制' : '开始录制'}}</div>
      <div class="w-btn-item" @click="toFinish">完成</div>
    </div>
    <div class="w-users-container">
      <div class="w-users-outline-title">活动规则</div>
      <div class="w-rule-detail">
        <p class="w-rule-item w-rule-one" style="margin-top: 0px;">用户开始游戏后，录制明星信的经典歌曲，可获得一定的评分；邀请三位好友前来帮帮唱，组成完整歌曲即可获得团队分数。</p>
        <p class="w-rule-item w-rule-two" style="margin-bottom: 0px;">团队分数排名最高前49名可获得周年庆盛典丰厚礼品，中奖名单在广州美莱公众号(微信号:dgmylike)公布。</p>
        <p class="w-rule-item-deep"><span>特等奖：</span>30日周年庆盛典入场名额2名，与信面对面(前2名)</p>
        <p class="w-rule-item-deep"><span>一等奖：</span>爱马仕香水50ml 2名（第3-4名）</p>
        <p class="w-rule-item-deep"><span>二等奖：</span>兰芝护唇膏 5名（第5-9名）</p>
        <p class="w-rule-item-deep"><span>三等奖：</span>玻尿酸润白导入体验券 10名（第10-19名）</p>
        <p class="w-rule-item-deep"><span>四等奖：</span>专业护理妮斯面膜 10名（第20-29名）</p>
        <p class="w-rule-item-deep"><span>五等奖：</span>专业护理手膜 20名（第30-49名）</p>
        <p class="w-rule-item w-rule-three">用户在获奖名单公布后，凭姓名和手机号码到本院1楼前台领取，领取时间截止至2017年11月30日12:00，逾期不候。</p>
        <p class="w-rule-item w-rule-four">本次活动最终解释权归广州美莱医疗美容医院所有。</p>
      </div>
    </div>
    <div class="w-score-container">
      <div class="w-score-title">排行榜</div>
      <div class="w-score-items">
        <div class="w-score-item" v-for="(item, index) in rank" :key="index">
          <span class="w-rank-order">{{index+1}}.</span><span class="w-rank-username">{{item.users[0].user.nickname+"dfdfasdf"}}</span> ......... <span class="w-rank-score">{{item.totalScore}}分</span> ......... {{item.updateAt | dateFormat }}
        </div>
      </div>
    </div>
    <model v-model="showTip" @selectSong="toContinue"></model>
    <toast :text="toastText" :show="showToast"></toast>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../config'
import toast from '../../components/toast.vue'
import model from '../../components/model'
import { dateFormat } from '../../utils'
const dev = config.dev

export default {
  filters: {
    dateFormat (val) {
      return dateFormat(val, 'MM月dd日')
    }
  },
  computed: {
    progress () {
      return 'w-dick-progress-background-' + (this.progressNum + 1)
    },
    curLyric () {
      let next = this.lyrics[this.times.indexOf(this.second)]
      if (next) {
        this.index++
      } else {
        next = this.preLyric
      }
      return next
    },
    nextOneLyric () {
      return this.lyrics[this.index]
    },
    nextTowLyric () {
      return this.lyrics[this.index + 1]
    }
  },
  watch: {
    curLyric (val) {
      this.preLyric = val
    },
    finalUrl (val) {
      this.$refs.afterAudio.src = val
    },
    currentMusic (val) {
      this.$refs.preAudio.src = this.currentMusic.url
    }
  },
  data () {
    return {
      audioIndex: 1,
      showTip: false,
      progressNum: 0,
      rank: [],
      preLyric: '',
      chorusId: '',
      status: false,
      currentMusic: {},
      localId: '',
      finalUrl: '',
      recorded: false,
      toastText: '请先录制歌曲',
      showToast: true,
      second: 0,
      index: 0,
      times: [0, 5, 7, 10, 12, 15],
      lyrics: [],
      musicName: '',
      interval: 0,
      userNum: 1,
      timeout: 0,
      recordTime: 0
    }
  },
  async mounted () {
    if (!window.localStorage.getItem('openid') && !dev) {
      window.location.href = `${config.redirectUrl}?redirect=personal`
      return
    }
    this.init()
    const wx = window.wx
    if (!config.auth && this.$route.path === '/personal') {
      const wechat = await axios.request({
        url: `${config.baseUrl}/api/wechat/getJSConfig`,
        method: 'get',
        params: {
          url: window.location.href
        }
      })
      wx.config(wechat.data.data)
      wx.ready(() => {
        wx.onMenuShareTimeline({
          title: '美莱周年庆', // 分享标题
          link: `${config.redirectUrl}?type=share`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
          title: '美莱周年庆', // 分享标题
          desc: '唱歌', // 分享描述
          link: `${config.redirectUrl}?type=share`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
        config.auth = true
        console.log('config success')// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      })
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('wx jsapi err:', res)
      })
    }
  },
  methods: {
    async init () {
      if (this.$route.query.musicId) {
        const res = await axios.request({
          url: `${config.baseUrl}/api/auth/audio/${this.$route.query.musicId}`,
          method: 'get'
        })
        this.currentMusic = res.data.data
        this.musicName = res.data.data.name
        this.lyrics = [...res.data.data.lyric, '...', 'END']
        this.times = res.data.data.secondes
        this.parLen = res.data.data.parLen
        for (let i = 0; i < this.userNum + 1; i++) {
          this.timeout = this.timeout + parseInt(this.parLen[i])
        }
        console.log(this.timeout)
      } else {
        window.location.href = `${config.redirectUrl}/rule`
      }
      if (this.$route.query.chorusId) {
        this.chorusId = this.$route.query.chorusId
        const res = await axios.request({
          url: `${config.baseUrl}/api/auth/chorus/${this.chorusId}`,
          method: 'get'
        })
        this.progressNum = res.data.data.users.length
        this.currentMusic = res.data.data.audio
        this.finalUrl = res.data.data.recordUrl
      }
      console.log(this.progressNum, 'progressNum')
      this.recordTime = this.parLen[this.progressNum + 1]
      console.log(this.recordTime, 'recordTime')
      const rankRes = await axios.request({
        url: `${config.baseUrl}/api/auth/chorus/rank`,
        method: 'get'
      })
      this.rank = rankRes.data.data
    },
    toContinue () {
      this.interval = setInterval(() => {
        this.preLyric = this.curLyric
        ++this.second
        console.log(this.second)
        if (this.second === (this.timeout - this.recordTime - 2)) {
          this.toastText = '接下来要轮到你录制啦'
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 1500)
        }
        if (this.second === this.timeout) {
          clearInterval(this.interval)
        }
      }, 1000)
      this.$refs.afterAudio.play()
    },
    preAudioEnd () {
      if (!this.chorusId && !this.localId) {
        this.startRecord()
      } else if (!this.chorusId && this.localId) {
        this.playLoaclVoice()
      } else {
        this.showTip = true
        clearInterval(this.interval)
        if (this.status) {
          this.audioIndex = 2
        }
      }
    },
    afterAudioEnd () {
      if (this.status) {
        this.audioIndex = 3
        this.playLoaclVoice()
        return
      }
      this.startRecord()
    },
    startPreVoice () {
      this.second = 0
      this.index = 0
      this.interval = setInterval(() => {
        this.preLyric = this.curLyric
        ++this.second
        console.log(this.second)
        if (this.second === (this.timeout - this.recordTime - 4)) {
          this.toastText = '接下来要轮到你录制啦'
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 2000)
        }
        if (this.second === this.timeout) {
          clearInterval(this.interval)
        }
      }, 1000)
      this.$refs.preAudio.play()
    },
    startRecordFull () {
      this.startPreVoice()
    },
    startRecord () {
      this.localId = null
      this.recorded = false
      const wx = window.wx
      wx.startRecord()
      setTimeout(() => {
        this.firstRecord = false
        this.stopRecord()
      }, this.recordTime * 1000)
    },
    tryListen () {
      this.status = true
      if (this.audioIndex === 1) {
        this.$refs.preAudio.play()
      } else if (this.audioIndex === 2) {
        this.$refs.afterAudio.play()
      } else if (this.audioIndex === 3) {
        this.playLoaclVoice()
      }
    },
    stopListen () {
      this.status = false
      if (this.audioIndex === 1) {
        this.$refs.preAudio.pause()
      } else if (this.audioIndex === 2) {
        this.$refs.afterAudio.pause()
      } else if (this.audioIndex === 3) {
        this.pauseVoice()
      }
    },
    stopRecord () {
      const wx = window.wx
      wx.stopRecord({
        success: res => {
          this.toastText = '录制成功,点击播放可以进行试听'
          this.showToast = true
          setTimeout(() => {
            this.showToast = false
          }, 1500)
          this.recorded = true
          this.localId = res.localId
        }
      })
    },
    toFinish () {
      if (!this.localId) {
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 1000)
        return
      }
      this.uploadVoice()
    },
    pauseVoice () {
      const wx = window.wx
      wx.pauseVoice({
        localId: this.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      })
    },
    playLoaclVoice () {
      const wx = window.wx
      wx.playVoice({
        localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
      })
      wx.onVoicePlayEnd({
        success: (res) => {
          this.status = false
        }
      })
    },
    uploadVoice () {
      const wx = window.wx
      wx.uploadVoice({
        localId: this.localId,
        isShowProgressTips: 0,
        success: async (res) => {
          const serverId = res.serverId // 返回音频的服务器端ID
          if (!this.chorusId) {
            const _res = await axios.request({
              url: `${config.baseUrl}/api/auth/chorus`,
              method: 'post',
              data: {
                mediaId: serverId,
                audioId: this.currentMusic._id,
                openid: localStorage.getItem('openid')
              }
            })
            window.location.href = `${config.redirectUrl}/share?chorusId=${_res.data.data.chorusId}&openid=${window.localStorage.getItem('openid')}`
          } else {
            const _res = await axios.request({
              url: `${config.baseUrl}/api/auth/chorus/${this.chorusId}`,
              method: 'patch',
              data: {
                mediaId: serverId,
                audioId: this.currentMusic._id,
                openid: localStorage.getItem('openid')
              }
            })
            window.location.href = `${config.redirectUrl}/share?chorusId=${_res.data.data.chorusId}&openid=${window.localStorage.getItem('openid')}`
          }
        }
      })
    }
  },
  components: {
    toast,
    model
  }
}
</script>

<style scoped>
.no-scroll {
  overflow: hidden !important;
}
.p-personal {
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
  /* background-color: rgba(123, 141, 0, 0.6); */
}
.w-dick-progress-icons-column {
  position: absolute;
  top: 91px;
  left: 224px;
  width: 275px;
  height: 416px;
  /* background-color: rgba(123, 141, 0, 0.6); */
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

.w-lryic-container {
  position: relative;
  top: -70px;
  color: #ffffff;
  text-align: center; 
}
.w-lryic-container h2 {
  font-size: 32px;
  margin: 10px 0;
}
.w-lryic-container h3 {
  color: #ffffff;
  margin: 8px 0;
  font-size: 28px;
}
.w-lryic-container .w-current-lryic {
  color: purple;
}

.w-btn-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -80px;
  width: 100%;
  height: 100px;
}

.w-btn-item {
  width: 278px;
  height: 80px;
  box-sizing: border-box;
  text-align: center;
  font-weight: bold;
  margin: 0 20px;
  font-size: 33px;
  line-height: 80px;
  background-image: url("~assets/images/popup/btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.w-btn-item:active {
  transform: scale(1.1);
}

.w-users-container {
  position: relative;
  top: -50px;
  width: 85%;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('~assets/images/rule.png');
  background-size: 100% 100%;
  background-attachment: local;
  background-position: center center;
  background-repeat: no-repeat;
}
.w-users-outline-title {
  position: relative;
  top: -10px;
  height: 50px;
  font-size: 42px;
  line-height: 50px;
  color: #e0d6fe;
  text-shadow: -5px 0 15px #313777, 0 0 15px #313777, 8px 0 15px #313777, 0 5px 15px #313777;
}
.w-rule-detail {
  margin-left: 48px;
  width: 90%;
  box-sizing: border-box;
  font-size: 22px;
  font-weight: lighter;
  color: #ffffff;
}
.w-rule-item {
  margin: 29px 0;
  line-height: 35px;
}
.w-rule-item-deep {
  margin: 10px 0;
}
.w-rule-item-deep > span {
  color: #06c6aa;
}
.w-rule-item:before {
  position: relative;
  top: 0px;
  left: -30px;
  width: 0;
  height: 0;
  display: block;
}
.w-rule-one:before {
  content: "①";
}
.w-rule-two:before {
  content: "②";
}
.w-rule-three:before {
  content: "③";
}
.w-rule-four:before {
  content: "④";
}
.w-score-container {
  position: relative;
  top: -50px;
  margin: 0 auto;
  width: 600px;
  height: 640px;
  background-image: url("~assets/images/popup/background.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 10px;
}

.w-score-title {
  padding-top: 20px;
  font-weight: bold;
  font-size: 40px;
  text-align: center;
}

.rotation {
  animation: rotating 6s infinite linear;
}

.w-score-items {
  margin-top: 30px;
}
.w-score-item {
  display: flex;
  align-items: center;
  text-align: center;
  padding: 5px 30px;
  font-size: 26px;
}
.w-score-item > .w-rank-username {
  display: inline-block;
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.w-score-item > .w-rank-score {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  color: #931447;
}
.w-score-item > .w-rank-order {
  position: relative;
  top: 3px;
  display: inline-block;
  width: 30px;
  overflow: hidden;
  text-align: right;
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

