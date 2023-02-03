import {createRouter, createWebHistory} from "vue-router";
import home from "@/components/home";
import login from "@/components/login_lw";
import about from "@/components/about";
import personal from "@/components/personal_lw";
import register_lw from "@/components/register_lw";
import Terminal from "@/components/backFace";
import wait from '@/components/wait';
import sendNotice from '@/components/LWSA_sendNotice';
import iphone_face from '@/components/iphone_face';

const routes = [
    {
        path: '/',
        name: 'login',
        component: login,
    },
    {
        path: '/wait',
        name: 'wait',
        component: wait,
    },
    {
        path: '/justtaCK',
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
        path: '/Terminal',
        name: 'Terminal',
        component: Terminal
    },
    {
        path: '/register',
        name: 'register',
        component: register_lw
    },
    {
        path: '/superSendNotice',
        name: 'sendNotice',
        component: sendNotice
    },
    {
        path: '/phone',
        name: 'phone_login',
        component: iphone_face
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;