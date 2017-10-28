<template>
  <div class="p-cover">
    <img class="w-show-img" src="~assets/images/cover/main.png"></img>
    <div class="w-start-btn" @click="changeRouter">开始游戏<img src="~assets/images/play.png"></img></div>
  </div>
</template>

<script>
import config from '../config'
import axios from 'axios'
const dev = config.dev
export default {
  async mounted () {
    if (!window.localStorage.getItem('openid') && !dev) {
      window.location.href = `${config.redirectUrl}?redirect=cover`
      return
    }
    const wx = window.wx
    if (!config.auth && this.$route.path === '/cover') {
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
        console.log('wx jsapi err:', res)
      })
    }
  },
  methods: {
    changeRouter () {
      setTimeout(() => {
        window.location.href = `${config.redirectUrl}/rule`
      }, 400)
    }
  }
}
</script>

<style scoped>
.p-cover {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  background-image: url("~assets/images/background.jpg");
  background-size: 100% 100%;
  background-attachment: local;
  background-repeat: no-repeat;
  overflow: auto;
}
.w-show-img {
  position: relative;
  top: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 1050px;
}
.w-start-btn {
  position: relative;
  top: -20px;
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

