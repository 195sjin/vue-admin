import { createRouter, createWebHistory } from 'vue-router';
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue';
import ArticleManageVue from '@/views/article/ArticleManage.vue';
import ArticleAdviceAllVue from '@/views/article/ArticleAdviceAll.vue';
import AdminInfoVue from '@/views/admin/AdminInfo.vue';
import AdminAvatarVUe from '@/views/admin/AdminAvatar.vue';
import AdminResetPasswordVue from '@/views/admin/AdminResetPassword.vue';

const routes = [
    { path: '/login', component: LoginVue },
    { path: '/', component: LayoutVue, redirect: '/article/manage',
        children: [
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/article/adviceAll', component: ArticleAdviceAllVue },
            { path: '/admin/info', component: AdminInfoVue },
            { path: '/admin/avatar', component: AdminAvatarVUe },
            { path: '/admin/resetPassword', component: AdminResetPasswordVue,
                meta: { requiresAuth: true, title: '更新密码' }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;