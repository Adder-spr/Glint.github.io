<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding: 0;height: 59px;">
        <el-menu
            :default-active="'pes'"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <el-menu-item style="width: 150px;font-size: 14px;" @click="ToHome">
            <el-icon size="17">
              <location/>
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <div class="flex-grow"/>
          <el-menu-item style="width: 150px;font-size: 14px;" @click="About">
            <span>关于</span>
            <el-icon size="13" style="color: #409EFF;">
              <InfoFilled/>
            </el-icon>
          </el-menu-item>
          <el-sub-menu>
            <template #title>管理员</template>
            <el-menu-item @click="to_register">注册管理员</el-menu-item>
            <el-menu-item>
              <span>联系超级管理员</span>
              <el-icon size="13">
                <Phone/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="Personal">
            <template #title>个人中心</template>
            <el-menu-item index="pes">
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
            <el-menu-item @click="exit">
              <span>安全退出</span>
              <el-icon size="13" style="color: #F56C6C;">
                <SwitchButton/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>

    </el-container>
  </div>
</template>

<script>
import router from "@/router/router";

export default {
  name: "personal_lw",
  data() {
    return {}
  },
  mounted() {
    sessionStorage.clear();
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {//防止直接输入地址进入
      this.exit();
    }
  },
  methods: {
    whe_iphone() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    ToHome() {
      router.push({
        path: '/justtaCK'
      })
    },
    WatchPerInfo() {
      router.push({
        path: '/personal'
      })
    },
    About() {
      router.push({
        path: '/about'
      })
    },
    exit() {
      router.replace({
        path: '/'
      })
    },
    to_register() {
      router.push({
        path: '/register'
      })
    },
  }
}
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100%;
}

.el-container {
  height: 100%;
}

.flex-grow {
  flex-grow: 1;
}
</style>