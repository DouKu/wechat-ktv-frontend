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
  box-sizing: border-box;
  margin: 15px 15px 0 15px;
  width: 100%;
  height: 1050px;
}
.w-start-btn {
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
.w-start-btn:active {
  transform: scale(1.2);
}
.w-start-btn > img {
  position: relative;
  top: 20px;
}
</style>

