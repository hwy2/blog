import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import axios from '@/axios'
import './index.scss'
// import '@/assets/js/localStorage'
import * as publicMethods from '@/public'
import Cookies from 'js-cookie'
import VueLazyload from 'vue3-lazy' // vue-lazyload
import moment from 'moment'

// 挂载到实例
const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$Cookies = Cookies;
app.config.globalProperties.$moment = moment;
// 分环境处理
// if (process.env.NODE_ENV === 'development') {
//     if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
//         // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
//         (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
//     }
//     (app.config as any).devtools = true
// }
// 实例挂载
app.use(VueLazyload, { loading: '@/assets/images/photo_default.jpg', error: './assets/img/gif_404.gif' })
    .mixin({
        methods: { ...publicMethods }
    })
    .use(store)
    .use(router)
    .mount('#app')


