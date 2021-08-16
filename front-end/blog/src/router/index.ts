import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '/@/store';
const routes: RouteRecordRaw[] = [
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
            },
            {
                path: '/404',
                name: '404',
                component: () => import('/@/views/notFind/index.vue'),
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('/@/views/login/index.vue'),
    },
    {
        path: '/backstage',
        name: 'backstage',
        component: () => import('/@/views/backstage/index.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/404')
    } else {
        next();
    }
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