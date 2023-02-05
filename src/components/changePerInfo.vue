<template>
  <el-container>
    <el-header style="padding: 0;height: 59px;">
      <el-menu
          :default-active="'PChangeInfo'"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="home" style="width: 150px;font-size: 14px;" @click="ToHome">
          <el-icon size="17">
            <location/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <div class="flex-grow"/>
        <el-menu-item index="about" style="width: 150px;font-size: 14px;" @click="About">
          <span>关于</span>
          <el-icon size="13" style="color: #409EFF;">
            <InfoFilled/>
          </el-icon>
        </el-menu-item>
        <el-sub-menu index="message">
          <template #title>管理员</template>
          <el-menu-item index="register_new_Admin" @click="to_register">注册管理员</el-menu-item>
          <el-menu-item index="tel_SuperAdmin">
            <span>联系超级管理员</span>
            <el-icon size="13">
              <Phone/>
            </el-icon>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="Personal">
          <template #title>个人中心</template>
          <el-menu-item index="pes" @click="LookPer">
            <span>查看个人信息</span>
            <el-icon size="13" style="color: #409EFF;">
              <Avatar/>
            </el-icon>
          </el-menu-item>
          <el-menu-item index="PChangeInfo">
            <span>修改个人信息</span>
            <el-icon size="13">
              <Edit/>
            </el-icon>
          </el-menu-item>
          <el-menu-item index="exit" @click="exit">
            <span>安全退出</span>
            <el-icon size="13" style="color: #F56C6C;">
              <SwitchButton/>
            </el-icon>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-main></el-main>
  </el-container>
</template>

<script>
import router from "@/router/router";
import {ElNotification} from "element-plus";

export default {
  name: "changePerInfo",
  data() {
    return {}
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {//防止直接输入地址进入
      this.exit();
    } else {
      console.log("wait ... ")
      this.outTime();
    }
  },
  methods: {
    whe_iphone() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    },
    outTime() {
      let times = 0;
      let wheClear = setInterval(() => {
        if (times >= 1800) {
          sessionStorage.clear();
          ElNotification({
            title: '提示',
            message: '身份过期,请重新登录！',
            type: 'info',
            duration: 0
          });
          this.exit();
          clearInterval(wheClear);
        }
        times++;
      }, 1000);
    },
    LookPer() {
      router.push({
        path: '/personal'
      })
    },
    ToHome() {
      router.push({
        path: '/justtaCK'
      })
    },
    About() {
      router.push({
        path: '/about'
      })
    },
    to_register() {
      router.push({
        path: '/register'
      })
    },
    exit() {
      router.replace({
        path: '/'
      })
    },
  }
}
</script>

<style scoped>

</style>