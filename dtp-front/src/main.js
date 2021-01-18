import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

Vue.config.productionTip = false

Vue.prototype.$network = {
  ReceiveMsg: "receiveMessage",
  SendMsg: "sendMessage",
}
export const  bus = new Vue();

const socket = io('http://localhost:3000');
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')