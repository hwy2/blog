import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Cookies from 'js-cookie'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { updateAccessToken } from '@/public';
import store from '@/store'
import Layout from '@/views/backstage/layout.vue'
export const backstageRouteRe: RouteRecordRaw[] = [
    {
        path: '/backstage/consoles',
        name: 'consoles',
        component: Layout,
        meta: {
            role: [1, 2],
            title: '控制台'
        },
        children: [
            {
                path: '/backstage/consoles/outline',
                name: 'outline',
                component: () => import('../views/backstage/outline/index.vue'),
                meta: {
                    role: [1, 2],
                    title: '概要'
                }
            },
            {
                path: '/backstage/consoles/profile',
                name: 'profile',
                component: () => import('../views/backstage/profile/index.vue'),
                meta: {
                    role: [1, 2],
                    title: '个人设置'
                }
            },
        ]
    },
    {
        path: '/backstage/write',
        name: 'write',
        component: Layout,
        meta: {
            role: [1, 2],
            title: '撰写'
        },
        children: [
            {
                path: '/backstage/write/writingArticles',
                name: 'writingArticles',
                component: () => import('../views/backstage/writingArticles/index.vue'),
                meta: {
                    role: [1, 2],
                    title: '撰写文章'
                }
            },
            {
                path: '/backstage/write/createPage',
                name: 'createPage',
                component: () => import('../views/backstage/createPage/index.vue'),
                meta: {
                    role: [1],
                    title: '创建页面'
                }
            },
        ]
    },
    {
        path: '/backstage/manage',
        name: 'manage',
        component: Layout,
        meta: {
            role: [1, 2],
            title: '管理'
        },
        children: [
            {
                path: '/backstage/manage/articleList',
                name: 'articleList',
                component: () => import('../views/backstage/articleList/index.vue'),
                meta: {
                    role: [1, 2],
                    title: '文章'
                }
            },
            {
                path: '/backstage/manage/commentList',
                name: 'commentList',
                component: () => import('../views/backstage/commentList/index.vue'),
                meta: {
                    role: [1, 2],
                    title: '评论'
                }
            },
            {
                path: '/backstage/manage/pageList',
                name: 'pageList',
                component: () => import('../views/backstage/pageList/index.vue'),
                meta: {
                    role: [1],
                    title: '页面'
                }
            },
            {
                path: '/backstage/manage/categoryList',
                name: 'categoryList',
                component: () => import('../views/backstage/categoryList/index.vue'),
                meta: {
                    role: [1],
                    title: '类别'
                }
            },
            {
                path: '/backstage/manage/fileList',
                name: 'fileList',
                component: () => import('../views/backstage/fileList/index.vue'),
                meta: {
                    role: [1],
                    title: '文件'
                }
            },
            {
                path: '/backstage/manage/userList',
                name: 'userList',
                component: () => import('../views/backstage/userList/index.vue'),
                meta: {
                    role: [1],
                    title: '用户'
                }
            },
            {
                path: '/backstage/manage/linkList',
                name: 'linkList',
                component: () => import('../views/backstage/linkList/index.vue'),
                meta: {
                    role: [1],
                    title: '链接'
                }
            },
        ]
    },
    {
        path: '/backstage/setting',
        name: 'setting',
        component: Layout,
        meta: {
            role: [1],
            title: '设置'
        },
        children: [
            {
                path: '/backstage/setting/basicSettings',
                name: 'basicSettings',
                component: () => import('../views/backstage/basicSettings/index.vue'),
                meta: {
                    role: [1],
                    title: '基本设置'
                }
            },
        ]
    }
]
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'app',
        component: () => import('@/App.vue'),
        redirect: {
            name: 'home'
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/foreground/layout/index.vue'),
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
                        component: () => import('@/views/foreground/article/index.vue'),
                    },
                    {
                        path: '/404',
                        name: '404',
                        component: () => import('@/views/notFind/index.vue'),
                    },
                    {
                        path: '/home/archiveArticles',
                        name: 'archiveArticles',
                        component: () => import('@/views/foreground/archiveArticles/index.vue'),
                    },
                    {
                        path: '/home/friendlyLink',
                        name: 'friendlyLink',
                        component: () => import('@/views/foreground/friendlyLink/index.vue'),
                    },
                    {
                        path: '/home/normalPage/:uuid',
                        name: 'normalPage',
                        component: () => import('@/views/foreground/normalPage/index.vue'),
                    },
                ]
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('@/views/login/index.vue'),
            },
            {
                path: '/backstage',
                name: 'backstage',
                component: () => import('@/App.vue'),
                redirect: {
                    name: 'outline'
                },
                children: [
                    ...backstageRouteRe
                ]
            },

        ]
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.matched.length === 0) {// 一旦找不到链接即跳转404
        next('/404');
        NProgress.done()
    } else {
        if (/backstage/.test(to.path)) {// 检查是否登录
            updateAccessToken();
            if (Cookies.get('accessToken')) {
                NProgress.done()
                next();
                console.log(to.path);
                store.commit("backstage/setActiveIndex", to.path);
            } else {
                NProgress.done()
                next('/login')
            }
        } else {
            if (from.name === 'article' && to.name === 'index') {
                document.documentElement.classList.add('back')
                const vt = (document as any).startViewTransition(() => {
                    next();
                });

                vt.finished.finally(() => {
                    document.documentElement.classList.remove('back')
                })
            } else {
                next();
            }
            NProgress.done()
        }

    }

})


export default router