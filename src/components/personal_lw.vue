<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding: 0;height: 59px;">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            @select="handLead"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <el-menu-item index="Home" style="width: 150px;font-size: 14px;">
            <el-icon size="17"><location /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="About" style="width: 150px;font-size: 14px;">
            <span>关于</span>
            <el-icon size="13" style="color: #409EFF;"><InfoFilled /></el-icon>
          </el-menu-item>
          <el-sub-menu index="Message" >
            <template #title>管理人员</template>
            <el-menu-item index="AddUser" >
              <span>增加用户</span>
            </el-menu-item>
            <el-menu-item index="ChangeUserStatus">修改用户状态</el-menu-item>
            <el-menu-item index="SelectUser">查询用户</el-menu-item>
            <el-sub-menu index="message">
              <template #title>管理员</template>
              <el-menu-item index="AddMessage">注册管理员</el-menu-item>
              <el-menu-item index="TelSuperMessage">
                <span>联系超级管理员</span>
                <el-icon size="13"><Phone /></el-icon>
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="Personal">
            <template #title>个人中心</template>
            <el-menu-item index="PWatchPerInfo">
              <span>查看个人信息</span>
              <el-icon size="13" style="color: #409EFF;"><Avatar /></el-icon>
            </el-menu-item>
            <el-menu-item index="PChangeInfo">
              <span>修改个人信息</span>
              <el-icon size="13"><Edit /></el-icon>
            </el-menu-item>
            <el-menu-item index="POut">
              <span>安全退出</span>
              <el-icon size="13" style="color: #F56C6C;" ><SwitchButton /></el-icon>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="Set">
            <template #title>设置</template>
            <el-menu-item index="SBackColor">
              <span>设置背景颜色</span>
              <el-icon><Avatar /></el-icon>
            </el-menu-item>
            <el-sub-menu index="SPageLanguage">
              <template #title>
                <span>设置语言</span>
                <el-icon size="13"><Setting /></el-icon>
              </template>
              <el-menu-item index="Chinese_Simplified">简体中文</el-menu-item>
              <el-menu-item index="English">English</el-menu-item>
              <el-menu-item index="Russian">Русский</el-menu-item>
            </el-sub-menu>
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
  data(){
    return {
      activeIndex:'PWatchPerInfo',
    }
  },
  methods: {
    ToHome(){
      router.replace({
        path:'/home'
      })
    },
    WatchPerInfo(){
      router.replace({
        path:'/personal'
      })
    },
    About(){
      router.replace({
        path:'/about'
      })
    },
    handLead(key){//参数可以加key的地址, keyPath
      if(key === "PWatchPerInfo") {
        this.WatchPerInfo();
        console.log("Personal Coming");
      }else if(key === "About"){
        this.About();
        console.log("About Coming");
      }else if(key === "Home"){
        this.ToHome();
        console.log("Home Coming!");
      }
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