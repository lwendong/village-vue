import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            meta: { requireLogin: false },
            components: {
                main: () => import('pages/Login.vue')
            }
        },
        {
            path: '/home',
            name: 'home',
            meta: { requireLogin: true },
            components: {
                main: () => import('pages/Home.vue')
            },
            children: [
                {
                    path: 'note',
                    name: 'note',
                    meta: { requireLogin: true },
                    components: {
                        home: () => import('pages/Note.vue')
                    }
                },
                {
                    path: 'emo',
                    name: 'emo',
                    meta: { requireLogin: true },
                    components: {
                        home: () => import('pages/Emo.vue')
                    }
                },
                {
                    path: 'remind',
                    name: 'remind',
                    meta: { requireLogin: true },
                    components: {
                        home: () => import('pages/Remind.vue')
                    }
                },
                {
                    path: 'chat',
                    name: 'chat',
                    meta: { requireLogin: true },
                    components: {
                        home: () => import('pages/Chat.vue')
                    }
                }
            ]
        },
        {
            path: '/account',
            name: 'account',
            meta: { requireLogin: true },
            components: {
                main: () => import('pages/Account.vue')
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    NProgress.start()
    const { requireLogin } = to.meta
    if (requireLogin) {
        const token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            next({ name: 'login' })
        }
    } else {
        next()
    }
})
router.afterEach(() => {
    NProgress.done()
})

export default router
