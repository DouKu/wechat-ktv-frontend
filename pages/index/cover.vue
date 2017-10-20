<template>
  <div class="p-cover">
    <img class="w-show-img" src="~assets/images/cover/main.png"></img>
    <div class="w-start-btn" @click="changeRouter">开始游戏 ▶</div>
  </div>
</template>

<script>
export default {
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
  flex-direction: column;
  align-items: center;
  background-image: url("~assets/images/background.png");
  background-size: 100% 100%;
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
</style>

