<template>
  <div class="loading" v-if="loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span> 
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>    
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: true
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading span {
  display: inline-block;
  width: 8px;
  border-radius: 4px;
  background: plum;
  -webkit-animation: load 1s ease infinite;
}
@-webkit-keyframes load {
  0%,
  100% {
    height: 60px;
    background: paleturquoise;
  }
  20%, 80% {
    height: 80px;
    background: paleturquoise;
  }
  50% {
    height: 120px;
    margin: -15px 10;
    background: #ffb5ff;
  }
}
.loading span:nth-child(1) {
  -webkit-animation-delay: 0s;
}
.loading span:nth-child(2) {
  -webkit-animation-delay: 0.2s;
}
.loading span:nth-child(3) {
  -webkit-animation-delay: 0.4s;
}
.loading span:nth-child(4) {
  -webkit-animation-delay: 0.6s;
}
.loading span:nth-child(5) {
  -webkit-animation-delay: 0.8s;
}
.loading span:nth-child(6) {
  -webkit-animation-delay: 1s;
}
.loading span:nth-child(7) {
  -webkit-animation-delay: 1.2s;
}
.loading span:nth-child(8) {
  -webkit-animation-delay: 1.4s;
}
.loading span:nth-child(9) {
  -webkit-animation-delay: 1.6s;
}
.loading span:nth-child(10) {
  -webkit-animation-delay: 1.8s;
}
.loading span:nth-child(11) {
  -webkit-animation-delay: 2s;
}
.loading span:nth-child(12) {
  -webkit-animation-delay: 2.2s;
}
</style>

