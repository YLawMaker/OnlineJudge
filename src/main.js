import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts'
axios.defaults.baseURL = 'http://localhost:8181'
Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
