<template>
  <div class="p-cover">
    <img class="w-show-img" src="~assets/images/cover/main.png"></img>
    <div class="w-start-btn" @click="changeRouter">开始游戏<img src="~assets/images/play.png"></img></div>
  </div>
</template>

<script>
import config from '../config'
const dev = config.dev
export default {
  async mounted () {
    if (!window.localStorage.getItem('openid') && !dev) {
      this.$router.push({ path: '/', query: { redirect: '/cover' } })
    }
  },
  methods: {
    changeRouter () {
      setTimeout(() => {
        this.$router.push('/rule')
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

