<template>
  <div class="c-toast" v-show="show">
    <div>{{text}}</div>
  </div>
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
  line-height: 70px;
  margin: auto;
  width: 100%;
  height: 70px;
  font-size: 30px;
}
.c-toast > div {
  padding: 18px;
  display: inline;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: #ffffff;
}
</style>

