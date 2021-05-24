import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import request from './utils/request';
import store from './store'
import './router' // 引入路由

Vue.component('cu-custom',cuCustom)

Vue.prototype.backendUrl = 'http://119.96.238.125:8082'
Vue.prototype.$request = request;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
