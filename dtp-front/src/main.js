import Vue from 'vue'
import App from './App.vue'
import router from './router'

require('@/network/connection.js')

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')