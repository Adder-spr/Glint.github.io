// import axios from "axios";

import axios from "axios";
import {ElNotification} from "element-plus";
import router from "@/router/router";

export function all_login(IMinfo){
    // noinspection UnreachableCodeJS
    if(IMinfo.length > 0){
        switch (IMinfo[0]){
            case ("login"):
                if(IMinfo[1] !== '' && IMinfo.length > 1) {
                    switch (IMinfo[1]){
                        case "superAdmin":
                        case "sp":
                        case "admin":
                        case "user":
                            if(IMinfo[2] !== '' && IMinfo[3] !== '' && IMinfo.length > 2 && (IMinfo[2].indexOf("'")+IMinfo[2].indexOf('"')+IMinfo[2].indexOf('`') === -3)){
                                switch (IMinfo[3]){
                                    case "psd":
                                    case "password":
                                        if(IMinfo[4] !== '' && IMinfo.length > 4 && (IMinfo[4].indexOf("'")+IMinfo[4].indexOf('"')+IMinfo[4].indexOf('`') === -3)){
                                            if(IMinfo[1] === "admin"){
                                                axios({
                                                    url:'/lw/admin/safeLogin',
                                                    method:"post",
                                                    params: {
                                                        safeAdminAC: IMinfo[2],
                                                        safeAdminPSD: IMinfo[4]
                                                    },
                                                    date:JSON,
                                                }).then((res)=>{
                                                    if(res.data){
                                                        ElNotification({
                                                            title: 'Admin',
                                                            message: '登录成功,即将跳转!',
                                                            type: 'success',
                                                        });
                                                        let admin_t = setInterval(()=>{
                                                            sessionStorage.setItem("Admin", IMinfo[2]);
                                                            router.replace({
                                                                path: '/admin_sendNotice',
                                                            }).then();
                                                            clearInterval(admin_t);
                                                        },1500);
                                                    }else {
                                                        ElNotification({
                                                            title: '警告',
                                                            message: '未授权操作！',
                                                            type: 'warning',
                                                        });
                                                    }
                                                });
                                            }else if(IMinfo[1] === "user"){
                                                axios({
                                                    url:'/lw/user/login',
                                                    method:"post",
                                                    params: {
                                                        account: IMinfo[2],
                                                        psd: IMinfo[4]
                                                    },
                                                    date:JSON,
                                                }).then((res)=>{
                                                    if(res.data){
                                                        ElNotification({
                                                            title: 'User',
                                                            message: '登录成功,即将跳转!',
                                                            type: 'success',
                                                        });
                                                        let admin_t = setInterval(()=>{
                                                            router.replace({
                                                                path: '/',
                                                            }).then();
                                                            clearInterval(admin_t);
                                                        },1500);
                                                    }else {
                                                        ElNotification({
                                                            title: '警告',
                                                            message: '账号或密码错误！',
                                                            type: 'warning',
                                                        });
                                                    }
                                                });
                                            }else if(IMinfo[1] === "superAdmin" || IMinfo[1] === "sp"){
                                                axios({
                                                    url:'/lw/superAdmin/safeLogin',
                                                    method:"post",
                                                    params: {
                                                        safeSuperAdminAC: IMinfo[2],
                                                        safeSuperAdminPSD: IMinfo[4]
                                                    },
                                                    date:JSON,
                                                }).then((res)=>{
                                                    if(res.data.type){
                                                        ElNotification({
                                                            title: 'SuperAdmin',
                                                            message: '登录成功,即将跳转!',
                                                            type: 'success',
                                                        });
                                                        let admin_t = setInterval(()=>{
                                                            router.replace({
                                                                path: '/',
                                                            }).then();
                                                            clearInterval(admin_t);
                                                        },1500);
                                                    }else {
                                                        ElNotification({
                                                            title: '警告',
                                                            message: res.data.msg ,
                                                            type: res.data.extent ,
                                                        });
                                                    }
                                                });
                                            }
                                        }else {
                                            return "密码格式错误!";
                                        }
                                        break;
                                    default:
                                        return "格式错误!";
                                }
                            }else {
                                return "格式错误!";
                            }
                            break;
                        default:
                            return "您可以尝试输入 login/?";
                    }
                }else {
                    return "您可以尝试输入 login/?";
                }
                break;
            default:
                return "您可以尝试输入 help/?";
        }
    }else {
        return "您可以尝试输入 help/?";
    }

}