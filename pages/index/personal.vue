<template>
  <div :class="['p-personal', {'no-scroll': showModel}]">
    <img class="w-theme-show" src="~assets/images/personal/theme.png"></img>
    <div class="w-dick-container">
      <div class="w-dick-progress">
        <img class="w-song-image" src="http://os32fgzvj.bkt.clouddn.com/012489fbdca023b5de1f5ddb41e15f61-head-picture.jpg">
          <template v-if="status"><div class="w-action-btn w-action-btn-play" @click="handleMusicAction"></div></template>
          <template v-else><div class="w-action-btn w-action-btn-pause" @click="handleMusicAction"></div></template>
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
    <div class="w-btn-container">
      <template v-if="status">
        <div class="w-btn-item">重新录制</div>
      </template>
      <template v-else>
        <div class="w-btn-item">开始录制</div>
      </template>
      <div class="w-btn-item" @click="toShareFriend">好友一起唱</div>
    </div>
    <div class="w-users-container">
      <div class="w-users-outline-box w-users-outline-box-left">
        <div class="w-users-outline w-users-outline-left"></div>
      </div>
      <div class="w-users-outline-title">活动规则</div>
      <div class="w-users-outline-box w-users-outline-box-right">
        <div class="w-users-outline w-users-outline-right"></div>
      </div>
      <div class="w-rules-container-outline">
        <div class="w-rules-container">
          <div class="w-rule-detail">
            <p class="w-rule-item w-rule-one" style="margin-top: 0px;">用户开始游戏后，录制明星信的经典歌曲，可获得一定的评分；邀请三位好友前来帮帮唱，组成完整歌曲即可获得团队分数。</p>
            <p class="w-rule-item w-rule-two" style="margin-bottom: 0px;">活动结束后，团队分数排名最高前49名可获得周年庆盛典丰厚礼品，中奖名单在广州美莱公众号(微信号:dgmylike)公布。</p>
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
      </div>
    </div>
    <div class="w-score-container">
      <div class="w-score-title">排行榜</div>
    </div>
    <share-model v-model="showModel"></share-model>
  </div>
</template>

<script>
import shareModel from '../../components/share-model.vue'
export default {
  data () {
    return {
      status: false,
      showModel: false
    }
  },
  methods: {
    toShareFriend () {
      this.showModel = true
    },
    handleMusicAction () {
      this.status = !this.status
    }
  },
  components: {
    shareModel
  }
}
</script>

<style scoped>
.no-scroll {
  overflow: hidden !important;
}
.p-personal {
  position: relative;
  height: 100%;
  overflow: auto;
  background-image: url('~assets/images/personal/background.png');
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

.w-btn-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 600px;
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
  width: 175px;
  overflow: hidden;
}
.w-users-outline-box-left {
  left: 60px;
}
.w-users-outline-box-right {
  right: 60px;
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
  left: 5px;
}
.w-users-outline-right {
  right: 5px;
}
.w-rules-container-outline {
  position: absolute;
  top: 56px;
  width: 600px;
  min-height: 950px;
  box-sizing: border-box;
  overflow: hidden;
}
.w-rules-container {
  position: absolute;
  display: flex;
  left: 8px;
  height: auto;
  width: 586px;
  box-sizing: border-box;
  border-left: 5px solid #e0d6fe;
  border-bottom: 5px solid #e0d6fe;
  border-right: 5px solid #e0d6fe;
  border-radius: 0 0 60px 60px;
  box-shadow: -5px 0 30px #313777, 0 0 30px #313777, 0 0 30px #313777, 0 5.5px 30px #313777;
}
.w-rule-detail {
  margin-left: 48px;
  width: 90%;
  box-sizing: border-box;
  font-size: 20px;
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
  top: 1570px;
  margin: 0 auto;
  width: 575px;
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
</style>

