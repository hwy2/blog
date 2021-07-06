import { createApp } from 'vue'
import App from './App.vue'
import router from '/@/router'
import store from '/@/store'
import axios from 'axios'
import './index.css'

// 基础URL
axios.defaults.baseURL = 'http://localhost:3000'
//post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 10000;

// 挂载到实例
const app = createApp(App)
app.config.globalProperties.$axios = axios

// 实例挂载
app
    .use(store)
    .use(router)
    .mount('#app')
