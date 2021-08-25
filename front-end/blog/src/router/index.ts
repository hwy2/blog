import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'
import { ElLoading } from 'element-plus';
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'app',
        component: () => import('/@/App.vue'),
        redirect: {
            name: 'home'
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('/@/views/Home.vue'),
                redirect: {
                    name: 'index'
                },
                children: [
                    {
                        path: '/home/index',
                        name: 'index',
                        component: () => import('../views/foreground/index.vue'),
                    },
                    {
                        path: '/home/article/:uuid',
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
                redirect: {
                    name: 'outline'
                },
                children: [
                    {
                        path: '/backstage/outline',
                        name: 'outline',
                        component: () => import('../views/backstage/outline/index.vue'),
                    },
                    {
                        path: '/backstage/profile',
                        name: 'profile',
                        component: () => import('../views/backstage/profile/index.vue'),
                    },
                ]
            },

        ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {// 一旦找不到链接即跳转404
        next('/404');
    } else {
        if (/backstage/.test(to.path)) {// 检查是否登录
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