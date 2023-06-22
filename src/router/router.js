import {createRouter, createWebHistory} from "vue-router";
import home from "@/components/home";
import login from "@/components/login_lw";
import about from "@/components/about";
import personal from "@/components/personal_lw";
import personal_change from '@/components/changePerInfo';
import register_lw from "@/components/register_lw";
import Terminal from "@/components/backFace";
import wait from '@/components/wait';
import admin_sendNotice from '@/components/admin_sendNotice';
import admin_changeNotice from '@/components/admin_changeNotice';
import iphone_face from '@/components/phone_face';
import ipone_main from "@/components/phone_main";
import review_req from "@/components/admin_review_req";
import user_amin from "@/components/user_main";

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
        path: '/changePerInfo',
        name: 'changeInfo',
        component: personal_change
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
        path: '/admin_sendNotice',
        name: 'sendNotice',
        component: admin_sendNotice
    },
    {
        path: '/admin_changeNotice',
        name: 'adminMessageNotice',
        component: admin_changeNotice
    },
    {
        path: '/phone',
        name: 'phone_login',
        component: iphone_face
    },
    {
        path: '/phoneMain',
        name: 'phone_main',
        component: ipone_main
    },
    {
        path: '/admin_review_req',
        name: 'adminReview_req',
        component: review_req
    },
    {
        path: '/user_M',
        name: 'user_main',
        component: user_amin
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router;