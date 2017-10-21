<template>
  <div class="w-popup-select" v-show="show">
    <div class="w-popup-container">
      <h1>请选择以下曲目</h1>
      <div v-for="(item, index) in musics" :key="index" :class="['w-select-item', { 'w-select-item-small-font': item.name.length > 5 }]" @click="handleChoose(item)">{{item.name}}</div>
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
    },
    musics: Array
  },
  watch: {
    value (val) {
      console.log(val, 'val')
      this.show = val
    }
  },
  methods: {
    handleChoose (item) {
      setTimeout(() => {
        this.show = false
        this.$emit('input', this.show)
        this.$emit('selectSong', item)
      }, 400)
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
  z-index: 10;
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
  margin: 0;
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