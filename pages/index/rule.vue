<template>
  <div :class="['p-rule', {'no-scroll': open}]">
    <img class="w-rule-img" src="~assets/images/rule/theme.png"></img>
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
    <div class="w-virtual-line"></div>
    <div class="w-input-container">
      <div class="w-input-item w-input-item-first">
        姓名: <input></input>
      </div>
      <div class="w-input-item">
        手机: <input></input>
      </div>
      <div class="w-input-hint-text"><div><span>*</span>此信息仅做获奖联系使用</div></div>
    </div>
    <div class="w-start-btn" @click="toSelectSong">开始选歌&nbsp▶</div>
    <popup-select :musics="musics" v-model="open" @selectSong="handleSelectSong"></popup-select>
  </div> 
</template>

<script>
import popupSelect from '../../components/popup-select.vue'
export default {
  methods: {
    toSelectSong () {
      this.open = true
    },
    handleSelectSong () {
      this.$router.push('/personal')
    }
  },
  data () {
    return {
      open: false,
      musics: [
        {
          name: '死了都要爱'
        },
        {
          name: '离歌'
        },
        {
          name: '火烧的寂寞'
        },
        {
          name: 'OneNight in 北京'
        }
      ]
    }
  },
  components: {
    popupSelect
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
  background-image: url("~assets/images/rule/background.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: local;
  overflow: auto;
  min-height: 1200px;
}
.w-rule-img {
  width: 100%;
}
.w-rule-detail {
  margin: 0 12%;
  box-sizing: border-box;
  width: 590px;
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
.w-virtual-line {
  margin: 0 45px;
  border: 1px dashed #ffffff;
}
.w-input-container {
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
  margin: 15px auto;
  width: 360px;
  height: 90px;
  font-size: 35px;
  margin-top: 20px;
  padding-top: 55px;
  padding-left: 16px;
  text-align: center;
  color: #ffb5ff;
  background-image: url("~assets/images/rule/btn.png");
  background-repeat: no-repeat;
  background-size: cover;
  text-shadow: -5px 0 20px #ad47b2, 0 0 20px #ad47b2, 5px 0 20px #ad47b2, 0 5.5px 20px #ad47b2;
}
</style>
