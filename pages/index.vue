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
    const wx = window.wx
    if (!config.auth && this.$route.path === '/') {
      const res = await axios.request({
        url: `${config.baseUrl}/api/wechat/getJSConfig`,
        method: 'get',
        params: {
          url: window.location.href
        }
      })
      wx.config(res.data.data)
      wx.ready(function () {
        config.auth = true
        console.log('config success')// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      })
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('wx jsapi err:', res)
      })
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
    }
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
          const redirect = window.localStorage.getItem('redirect') || '/cover'
          this.$router.push(redirect)
        } catch (error) {
        }
      } else {
        this.showToAuth = false
        const _res = await axios.request({
          url: `${config.baseUrl}/api/auth/chorus`,
          method: 'get',
          params: {
            openid: localStorage.getItem('openid')
          }
        })
        const chorus = _res.data.data
        if (chorus._id && this.$route.path !== '/share') {
          this.$router.push({ path: '/share', query: { chorusId: chorus._id } })
          return
        }
        if (this.$route.path === '/') {
          this.$router.push('/cover')
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


