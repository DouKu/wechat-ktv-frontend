<template>
  <div :class="['p-rule', {'no-scroll': open}]">
    <img class="w-rule-img" src="~assets/images/rule/theme.png"></img>
    <div class="w-rule-detail">
      <p class="w-rule-item w-rule-one" style="margin-top: 0px;">用户开始游戏后，录制明星信的经典歌曲，可获得一定的评分；邀请三位好友前来帮帮唱，组成完整歌曲即可获得团队分数。</p>
      <p class="w-rule-item w-rule-two" style="margin-bottom: 0px;">团队分数排名最高前49名可获得周年庆盛典丰厚礼品，中奖名单在广州美莱公众号(微信号:dgmylike)公布。</p>
      <p class="w-rule-item-deep"><span>特等奖：</span>30日周年庆盛典入场名额2名，与信面对面(前2名)</p>
      <p class="w-rule-item-deep"><span>一等奖：</span>爱马仕香水50ml 2名（第3-4名）</p>
      <p class="w-rule-item-deep"><span>二等奖：</span>DHC护唇膏5名（第5-9名）</p>
      <p class="w-rule-item-deep"><span>三等奖：</span>玻尿酸润白导入体验券 10名（第10-19名）</p>
      <p class="w-rule-item-deep"><span>四等奖：</span>专业护理妮斯面膜 10名（第20-29名）</p>
      <p class="w-rule-item-deep"><span>五等奖：</span>专业护理手膜 20名（第30-49名）</p>
      <p class="w-rule-item w-rule-three">用户在获奖名单公布后，凭姓名和手机号码到本院1楼前台领取，领取时间截止至2017年11月30日12:00，逾期不候。</p>
      <p class="w-rule-item w-rule-four">本次活动最终解释权归广州美莱医疗美容医院所有。</p>
    </div>
    <div class="w-virtual-line"></div>
    <div class="w-input-container">
      <div class="w-input-item w-input-item-first">
        姓名: <input v-model="realname"></input>
      </div>
      <div class="w-input-item">
        手机: <input v-model="phoneNumber"></input>
      </div>
      <div class="w-input-hint-text"><div><span>*</span>此信息仅做获奖联系使用</div></div>
    </div>
    <div class="w-start-btn" @click="toSelectSong">开始选歌<img src="~assets/images/play.png"></img></div>
    <popup-select :musics="musics" v-model="open" @selectSong="handleSelectSong"></popup-select>
    <toast :text="toastText" :show="showToast"></toast>
  </div> 
</template>

<script>
import axios from 'axios'
import config from '../config'
import toast from '../../components/toast.vue'
import popupSelect from '../../components/popup-select.vue'
const dev = config.dev

export default {
  methods: {
    async init () {
      const _res = await axios.request({
        url: `${config.baseUrl}/api/auth/chorus`,
        method: 'get',
        params: {
          openid: localStorage.getItem('openid')
        }
      })
      const chorus = _res.data.data
      if (chorus._id && !this.$route.query.chorusId) {
        window.location.href = `${config.redirectUrl}/share?chorusId=${chorus._id}&openid=${window.localStorage.getItem('openid')}`
        return
      }
      const res = await axios.request({
        url: `${config.baseUrl}/api/auth/audio`,
        method: 'get'
      })
      this.musics = res.data.data
    },
    toSelectSong () {
      if (!this.realname) {
        this.toastText = '请填写您的姓名'
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 1500)
        return
      }
      if (!this.phoneNumber) {
        this.toastText = '请填写您的手机号码'
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 1500)
        return
      }
      if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phoneNumber)) {
        this.toastText = '请填写正确的手机号码'
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 1500)
        return
      }
      this.open = true
    },
    async handleSelectSong (item) {
      const openid = window.localStorage.getItem('openid')
      if (this.realname && this.phoneNumber) {
        await axios.request({
          url: `${config.baseUrl}/api/auth/updateUserMessage/${openid}`,
          method: 'put',
          data: {
            realname: this.realname,
            phoneNumber: this.phoneNumber
          }
        })
      }
      window.location.href = `${config.redirectUrl}/personal?musicId=${item._id}`
    }
  },
  async mounted () {
    if (!window.localStorage.getItem('openid') && !dev) {
      window.location.href = `${config.redirectUrl}?redirect=rule`
      return
    }
    this.init()
    const wx = window.wx
    if (!config.auth && this.$route.path === '/rule') {
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
          title: config.title,
          desc: config.desc,
          link: config.link,
          imgUrl: config.imgUrl,
          success: () => {
          },
          cancel: () => {
          }
        })
        wx.onMenuShareAppMessage({
          title: config.title,
          desc: config.desc,
          link: config.link,
          imgUrl: config.imgUrl,
          success: () => {
          },
          cancel: () => {
          }
        })
        config.auth = true
      })
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('wx jsapi err:', res)
      })
    }
  },
  data () {
    return {
      open: false,
      musics: [],
      realname: '',
      phoneNumber: '',
      showToast: false,
      toastText: ''
    }
  },
  components: {
    popupSelect,
    toast
  }
}
</script>


<style scoped>
.no-scroll {
  overflow: hidden !important;
}
.p-rule {
  width: 100%;
  height: 100%;
  background-image: url("~assets/images/rule/background.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: auto;
}
.w-rule-img {
  width: 100%;
}
.w-rule-detail {
  position: relative;
  top: -50px;
  margin: 0 12%;
  box-sizing: border-box;
  width: 590px;
  font-size: 22px;
  font-weight: lighter;
  color: #ffffff;
}
.w-rule-item {
  margin: 10px 0;
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
.w-virtual-line {
  position: relative;
  top: -50px;
  margin: 0 45px;
  border: 1px dashed #ffffff;
}
.w-input-container {
  position: relative;
  top: -50px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.w-input-item {
  width: 400px;
  height: 46px;  
  font-family: 微软雅黑;
  color: #ffffff;
  font-size: 30px;
  line-height: 46px;
}
.w-input-item-first {
  margin-bottom: 20px;
}
.w-input-item > input {
  width: 280px;
  height: 40px;
  padding: 2px 5px;
  color: #ffffff;
  margin-left: 16px;
  font-size: 30px;
  border: 2.5px solid #ffffff;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0);
}
.w-input-hint-text {
  position: relative;
  width: 400px;
  color: #ffffff;
  font-size: 18px;
}
.w-input-hint-text > div {
  position: absolute;
  top: 8px;
  right: 16px;
}
.w-input-hint-text span {
  color: red;
}
.w-start-btn {
  top: -10px;
  position: relative;
  margin: 0 auto;
  width: 360px;
  height: 100px;
  font-size: 35px;
  line-height: 120px;
  text-align: center;
  color: #ffb5ff;
  background-image: url("~assets/images/pink-btn.png");
  background-repeat: no-repeat;
  background-size: cover;
  text-shadow: -5px 0 20px #ad47b2, 0 0 20px #ad47b2, 5px 0 20px #ad47b2, 0 5.5px 20px #ad47b2;
}
.w-start-btn:active {
  transform: scale(1.2);
}
.w-start-btn > img {
  position: relative;
  top: 20px;
}
</style>
