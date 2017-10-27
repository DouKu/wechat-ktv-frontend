<template>
  <div class="p-index-page">
    <template v-if="showToAuth">
      <div class="w-auth-model">
        微信授权<br>
        <a :href="authUrl">授权登录</a>
      </div>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import config from './config'
const dev = config.dev

export default {
  data () {
    return {
      showToAuth: false,
      authUrl: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUrl)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`,
    }
  },
  async mounted () {
    const wechatCode = this.$route.query.code
    const saveOpenId = window.localStorage.getItem('openid')
    if (this.$route.query.redirect) {
      window.localStorage.setItem('redirect', this.$route.query.redirect)
    }
    if (!dev) {
      if (!saveOpenId && !wechatCode) {
        this.showToAuth = true
      } else if (wechatCode && !saveOpenId) {
        this.showToAuth = false
        try {
          const res = await axios.request({
            method: 'post',
            url: `${config.baseUrl}/api/wechat/exchangeToken`,
            data: {
              code: wechatCode
            }
          })
          window.localStorage.setItem('openid', res.data.data.openid)
          const redirect = window.localStorage.getItem('redirect') || 'cover'
          window.location.href = `${config.redirectUrl}/${redirect}`
        } catch (error) {
        }
      } else {
        this.showToAuth = false
        const wx = window.wx
        if (this.$route.path === '/') {
          window.location.href = `${config.redirectUrl}/cover`
          return
        }
        if (config.auth && this.$route.path === '/') {
          const res = await axios.request({
            url: `${config.baseUrl}/api/wechat/getJSConfig`,
            method: 'get',
            params: {
              url: window.location.href
            }
          })
          wx.config(res.data.data)
          wx.ready( () => {
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
      }
    }
  }
}
</script>

<style>
@import '../assets/style/normal.css';
.p-index-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("~assets/images/rule/background.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: auto;
}
.w-auth-model {
  padding: 80px;
  width: 400px;
  height: 500px;
  text-align: center;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(204, 204, 204, 0.8);
}
.w-auth-model a {
  margin: 200px auto;
  display: block;
  width: 300px;
  height: 80px;
  line-height: 80px;
  font-size: 38px;
  border-radius: 8px;
  background: #44b549;
  color: white;
  outline: none;
  box-shadow: 0 2px 5px rgba(204, 204, 204, 0.8);
  text-decoration: blink;
}
.w-auth-btn {
}
</style>


