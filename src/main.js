import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import 'echarts'
import VueEcharts from 'vue-echarts'

// axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('v-chart', VueEcharts)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
