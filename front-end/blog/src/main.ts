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
import Cookies from 'js-cookie'

// 挂载到实例
const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.config.globalProperties.getAricleList = pubfunt.getAricleList;
app.config.globalProperties.getWebConfigInfo = pubfunt.getWebConfigInfo;
app.config.globalProperties.$Cookies = Cookies;
// 分环境处理
if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
        // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
        (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
    (app.config as any).devtools = true
}
// 实例挂载
app.use(store)
    .use(router)
    .use(ElementPlus)
    .mount('#app')


