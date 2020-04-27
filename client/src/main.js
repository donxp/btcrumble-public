import Vue from 'vue'
import VueWebsocket from 'vue-websocket'
import App from './App.vue'
import router from './router'
import store from './store'

import JQuery from 'jquery'
import JQueryKnob from 'jquery-knob'
window.$ = JQuery;
window.$.knob = JQueryKnob;

Vue.config.productionTip = false

Vue.use(VueWebsocket, "ws://127.0.0.1:3000");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
