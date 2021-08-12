import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '/@/store';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('/@/views/Home.vue'),
        redirect: {
            name: 'index'
        },
        children: [
            {
                path: '/index',
                name: 'index',
                component: () => import('/@/views/index/index.vue'),
            },
            {
                path: '/article/:uuid',
                name: 'article',
                component: () => import('/@/views/article/index.vue'),
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    next();
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
})


export default router