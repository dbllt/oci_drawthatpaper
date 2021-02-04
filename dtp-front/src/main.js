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

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')