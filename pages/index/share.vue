<template>
  <div :class="['p-share',{'no-scroll': showModel}]">
    <img class="w-theme-show" src="~assets/images/personal/theme.png"></img>
    <div class="w-dick-container">
      <div class="w-dick-progress">
        <img class="w-song-image" src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg">
          <template v-if="status"><div class="w-action-btn w-action-btn-play"></div></template>
          <template v-else><div class="w-action-btn w-action-btn-pause"></div></template>
        </img>
      </div>
      <div class="w-dick-progress-icons-row">
        <div class="w-dick-progress-icon-lt"></div>
        <div class="w-dick-progress-icon-rt"></div>
      </div>
      <div class="w-dick-progress-icons-column">
        <div class="w-dick-progress-icon-ct"></div>
        <div class="w-dick-progress-icon-lb"></div>
        <div class="w-dick-progress-icon-rb"></div>
      </div>
    </div>
    <div class="w-score-container">
      <!-- <h1>您为这首歌曲贡献了<span>100</span>分</h1> -->
      <h1>您的歌曲获得了<span>1000</span>高分</h1>
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
        <div class="w-user-detail-container">
          <img src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg"></img>
          <p>信</p>
        </div>
        <div class="w-user-detail-container">
          <img src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg"></img>          
          <p>lgybetter</p>          
        </div>
        <div class="w-user-detail-container">
          <img src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg"></img>
          <p>dfadd</p>
        </div>
        <div class="w-user-detail-container">
          <img src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg"></img>
          <p>dfadasdfdfdddddd</p>
        </div>
        <div class="w-user-detail-container">
          <img src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg"></img>
          <p>dfadf</p>
        </div>
        <img class="w-user-decorate" src="~assets/images/share/line.png"></img>      
      </div>
    </div>
    <div class="w-btn-container">
      <div class="w-continue-btn">参加歌唱<img src="~assets/images/play.png"></img></div>
      <div class="w-share-btn" @click="toShareFriend">好歌要分享<img src="~assets/images/play.png"></img></div>
    </div>
    <img src="~assets/images/share/code.png" class="w-star-code"></img>
    <share-model v-model="showModel"></share-model>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../config'
import shareModel from '../../components/share-model.vue'

export default {
  async mounted () {
    // if (!this.$route.query.chorusId) {
    //   this.$router.push('/rule')
    //   return
    // } else {
    this.chorusId = '59ec51059469dd266f4cb7a4'
    // }
    // this.chorusId = this.$route.query.chorusId
    const res = await axios.request({
      url: `${config.baseUrl}/api/auth/chorus/${this.chorusId}`,
      method: 'get'
    })
    console.log(res.data.data)
    this.chorus = res.data.data.chorus
  },
  methods: {
    toShareFriend () {
      this.showModel = true
    }
  },
  data () {
    return {
      chorusId: '',
      chorus: {},
      status: false,
      showModel: false
    }
  },
  components: {
    shareModel
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
  position: absolute;
  top: 370px;
  left: 0px;
  width: 90%;
  height: 600px;
  background-image: url("~assets/images/personal/dick.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.w-dick-progress {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 96px;
  left: 136px;
  width: 444px;
  height: 444px;
  border: 4px solid #f8b551;
  box-shadow: -2px 0 5px #f8b551, 0 0 5px #f8b551, 2px 0 5px #f8b551, 0 2.5px 5px #f8b551;
  border-radius: 50%;
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

.w-score-container {
  position: relative;
  top: 550px;
  width: 100%;
  height: 50px;
}
.w-score-container h1 {
  text-align: center;
  margin: 0 0;
  font-size: 30px;
  color: #ffffff;
}
.w-score-container span {
  font-size: 45px;
  color: #0dccb0;
}

.w-users-container {
  position: relative;
  top: 650px;
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
  top: 650px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-continue-btn, .w-share-btn {
  width: 360px;
  height: 90px;
  font-size: 35px;
  margin-top: 20px;
  padding-top: 32px;
  padding-left: 18px;
  text-align: center;
  color: #ffb5ff;
  background-image: url("~assets/images/rule/btn.png");
  background-repeat: no-repeat;
  background-size: cover;
  text-shadow: -5px 0 20px #ad47b2, 0 0 20px #ad47b2, 5px 0 20px #ad47b2, 0 5.5px 20px #ad47b2;
}

.w-continue-btn > img,
.w-share-btn > img {
  position: relative;
  top: 20px;
}

.w-star-code {
  position: relative;
  top: 660px;
  width: 700px;
  height: 350px;
}

</style>

