import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '/@/store'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('/@/views/Home.vue'),
        // meta: {
        //     // 页面标题title
        //     title: '首页'
        // }
        redirect: {
            name: 'Index'
        },
        children:[
            {
                path: '/index',
                name: 'Index',
                component: () => import('/@/views/index/index.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) {
//         if (store.state.token) {
//             next()
//         } else {
//             next({
//                 path: '/login',
//                 query: { redirect: to.fullPath }
//             })
//         }
//     } else {
//         next()
//     }
// })


export default router