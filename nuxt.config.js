module.exports = {
  head: {
    title: '广州美莱周年庆',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'Gy player' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/js/flexible.min.js' },
      { src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js' }
    ]
  },
  loading: '~/components/loading.vue',
  build: {
    vendor: ['axios', 'weixin-js-sdk'],
    ssr: true,
    extractCSS: true,
    cssSourceMap: false,
    postcss: {
      plugins: {
        'autoprefixer': {browsers: 'last 5 version'},
        'postcss-px2rem': {remUnit: 72}
      }
    },
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  cache: {
    max: 1000,
    maxAge: 900000
  }
}
