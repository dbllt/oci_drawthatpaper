import Vue from 'vue'
import App from './App.vue'
import router from './router'

require('@/network/connection.js')

Vue.config.productionTip = false

new Vue({
  created() {
    window.addEventListener('beforeunload', this.handler)
  },
  methods: {
    handler: function handler() {
      this.$connection.$emit(this.$network_actions.Logout)
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')