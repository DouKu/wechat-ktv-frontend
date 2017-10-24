<template>
  <div class="w-popup-select" v-show="show" @click="handleChoose">
    <div class="w-popup-container">
      <h1>轻触屏幕播放您的好友歌声</h1>
    </div>
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
    handleChoose (item) {
      this.show = false
      this.$emit('input', this.show)
      this.$emit('selectSong')
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
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .6);
  width: 100%;
  height: 100%;
}
.w-popup-container {
  display: flex;
  align-items: center;
  width: 550px;
  height: 544px;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 12px;
  background-image: url("~assets/images/popup/background.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
}
h1 {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 35px;
}
.w-select-item {
  width: 224px;
  height: 80px;
  box-sizing: border-box;
  text-align: center;
  font-weight: bold;
  margin: 10px 10px;
  font-size: 33px;
  line-height: 80px;
  background-image: url("~assets/images/popup/btn.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.w-select-item:active {
  transform: scale(1.1);
}
.w-select-item-small-font {
  font-size: 25px;
}
</style>