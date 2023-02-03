import {createRouter, createWebHistory} from "vue-router";
import home from "@/components/home";
import login from "@/components/login_lw";
import about from "@/components/about";
import personal from "@/components/personal_lw";
import register_lw from "@/components/register_lw";
import super_login from "@/components/backFace";

const routes = [
    {
        path: '/',
        name: 'login',
        component: login,
    },
    {
        path: '/home',
        name: 'home',
        component: home,
    },
    {
        path: '/personal',
        name: 'personal',
        component: personal
    },
    {
        path: '/about',
        name: 'about',
        component: about,
    },
    {
        path: '/SuperAdmin_Login',
        name: 'superLogin',
        component: super_login
    },
    {
        path: '/register',
        name: 'register',
        component: register_lw
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;