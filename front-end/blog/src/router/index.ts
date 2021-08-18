import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'
import { ElLoading } from 'element-plus';
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
                component: () => import('../views/foreground/index.vue'),
            },
            {
                path: '/article/:uuid',
                name: 'article',
                component: () => import('/@/views/foreground/article/index.vue'),
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
        children: []
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/404');
    } else {
        if (/backstage/.test(to.path) ) {
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            if (Cookies.get('accessToken')) {
                loading.close();
                next();
            } else {
                loading.close();
                next('/login')
            }
        } else {
            next();
        }

    }
})


export default router