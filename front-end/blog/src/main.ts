import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import {request} from '@/axios'
import './index.scss'
// import '@/assets/js/localStorage'
import * as publicMethods from '@/public'
import Cookies from 'js-cookie'
import VueLazyload from 'vue3-lazy' // vue-lazyload

// 挂载到实例
const app = createApp(App)
app.config.globalProperties.$request = request;
app.config.globalProperties.$Cookies = Cookies;
// 分环境处理
// if (process.env.NODE_ENV === 'development') {
//     if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
//         // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
//         (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
//     }
//     (app.config as any).devtools = true
// }
// 实例挂载
app.use(VueLazyload, { loading: '/src/assets/images/photo_default.jpg', error: '/src/assets/img/gif_404.gif' })
    .mixin({
        methods: { ...publicMethods }
    })
    .use(store)
    .use(router)
    .mount('#app')


