import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'
import { ElLoading } from 'element-plus';
import pubfunt from '/@/public';
import store from '/@/store'
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
                    },
                    {
                        path: '/home/archiveArticles',
                        name: 'archiveArticles',
                        component: () => import('/@/views/foreground/archiveArticles/index.vue'),
                    },
                    {
                        path: '/home/friendlyLink',
                        name: 'friendlyLink',
                        component: () => import('/@/views/foreground/friendlyLink/index.vue'),
                    },
                    {
                        path: '/home/privacyPolicy',
                        name: 'privacyPolicy',
                        component: () => import('/@/views/foreground/privacyPolicy/index.vue'),
                    },
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
                    {
                        path: '/backstage/writingArticles',
                        name: 'writingArticles',
                        component: () => import('../views/backstage/writingArticles/index.vue'),
                    },
                    {
                        path: '/backstage/basicSettings',
                        name: 'basicSettings',
                        component: () => import('../views/backstage/basicSettings/index.vue'),
                    },
                    {
                        path: '/backstage/articleList',
                        name: 'articleList',
                        component: () => import('../views/backstage/articleList/index.vue'),
                    },
                    {
                        path: '/backstage/commentList',
                        name: 'commentList',
                        component: () => import('../views/backstage/commentList/index.vue'),
                    },
                    {
                        path: '/backstage/pageList',
                        name: 'pageList',
                        component: () => import('../views/backstage/pageList/index.vue'),
                    },
                    {
                        path: '/backstage/categoryList',
                        name: 'categoryList',
                        component: () => import('../views/backstage/categoryList/index.vue'),
                    },
                    {
                        path: '/backstage/fileList',
                        name: 'fileList',
                        component: () => import('../views/backstage/fileList/index.vue'),
                    },
                    {
                        path: '/backstage/userList',
                        name: 'userList',
                        component: () => import('../views/backstage/userList/index.vue'),
                    },
                    {
                        path: '/backstage/linkList',
                        name: 'linkList',
                        component: () => import('../views/backstage/linkList/index.vue'),
                    },
                    {
                        path: '/backstage/createPage',
                        name: 'createPage',
                        component: () => import('../views/backstage/createPage/index.vue'),
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
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
        });
        if (/backstage/.test(to.path)) {// 检查是否登录
            pubfunt.updateAccessToken();
            if (Cookies.get('accessToken')) {
                loading.close();
                next();
                store.commit("backstage/setActiveIndex", to.path);
            } else {
                loading.close();
                next('/login')
            }
        } else {
            setTimeout(() => {
                next();
            }, 500);
            loading.close();
        }

    }
})


export default router