import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts'
// import Docxtemplater from 'docxtemplater'
// import PizZip from 'pizzip'
// import JSZipUtils from 'jszip-utils'
// import { saveAs } from 'file-saver'
axios.defaults.baseURL = 'http://47.93.218.77:8888'
Vue.config.productionTip = false
//前端跨域
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
