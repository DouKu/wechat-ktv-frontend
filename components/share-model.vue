<template>
  <div class="w-popup-select" v-show="show" @click="handleChoose">
    <div class="w-popup-container">
      <h1>点击右上角 “···”</h1>
      <h2>发送给好友或分享到朋友圈</h2>
    </div>
    <div class="w-to-share"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  watch: {
    value (val) {
      this.show = val
    }
  },
  methods: {
    scroll () {
      console.log('scroll')
    },
    handleChoose (item) {
      this.show = false
      this.$emit('input', this.show)
    }
  },
  data () {
    return {
      show: this.value
    }
  }
}
</script>

<style scoped>
.w-popup-select {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .8);
  width: 100%;
  height: 100%;
}
.w-popup-container {
  margin-top: 150px;
  text-align: center;
  color: #e0d6fe;
  width: 100%;
  font-weight: lighter;
  text-shadow: -5px 0 30px #313777, 0 0 30px #313777, 10px 0 30px #313777, 0 5.5px 30px #313777;
}
.w-popup-container > h1 {
  margin: 0 50px 8px 0;
  font-size: 45px;
}
.w-popup-container > h2 {
  margin: 0;
  font-size: 40px;
}
.w-to-share {
  position: absolute;
  top: 40px;
  right: 40px;
  width: 192px;
  height: 192px;
  background-image: url("~assets/images/personal/share.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>