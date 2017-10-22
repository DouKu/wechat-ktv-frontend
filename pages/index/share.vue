<template>
  <div>
    完成页面   chorusId: {{chorusId}}
    chorus {{chorus.toString()}}
  </div>  
</template>

<script>
import axios from 'axios'
import config from '../config'
export default {
  async mounted () {
    if (!this.$route.query.chorusId) {
      this.$router.push('/rule')
      return
    }
    this.chorusId = this.$route.query.chorusId
    const res = await axios.request({
      url: `${config.baseUrl}/api/auth/chorus/${this.chorusId}`,
      method: 'get'
    })
    console.log(res.data.data)
    this.chorus = res.data.data
  },
  data () {
    return {
      chorusId: '',
      chorus: {}
    }
  }
}
</script>
