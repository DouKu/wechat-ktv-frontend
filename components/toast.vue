<template>
  <div class="c-toast" v-show="show">{{text}}</div>
</template>

<script>
export default {
  props: {
    text: String,
    show: Boolean
  }
}
</script>

<style scoped>
.c-toast {
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  text-align: center;
  line-height: 60px;
  margin: auto;
  width: 200px;
  height: 60px;
  font-size: 26px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}
</style>

