import { createApp } from 'vue'
import App from './App.vue'
import router from '/@/router'
import store from '/@/store'
import axios from '/@/axios'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './index.css'
import '/@/assets/js/localStorage'
import pubfunt from '/@/public'

// 挂载到实例
const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.config.globalProperties.getAricleList = pubfunt.getAricleList;
// 实例挂载
app.use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')

