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
            <el-menu-item index="pes">
              <span>查看个人信息</span>
              <el-icon size="13" style="color: #409EFF;">
                <Avatar/>
              </el-icon>
            </el-menu-item>
            <el-menu-item index="PChangeInfo" @click="toChangeInfo">
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
      <el-main>
        <el-tabs type="border-card">
          <!--          基础信息-->
          <el-tab-pane label="基础信息">
            <el-card
                class="box-card"
                style="margin: 0;width: 100%;background: rgba(225,227,140,0.6);"
            >
              <!--              头像-->
              <div class="baseInfo_headImage">
                <p class="text">头像：</p>
                <el-avatar :size="60" :src="headImage" alt="头像"/>
                <div style="height: 50px;line-height: 50px;margin-left: 15px;">
                  <el-upload
                      action="lw/superAdmin/uploadHeadImage.com"
                      :data="{ account:admin_name }"
                      :on-error="error_headImage"
                      :on-success="getHeadImage"
                      :auto-upload="true"
                      :show-file-list="false"
                      accept=".jpg,.jpeg,.png"
                      :before-upload="beforeUpload"
                  >
                    <template #trigger>
                      <el-link :underline="false">
                        <sup>点击上传头像</sup>
                      </el-link>
                    </template>
                  </el-upload>
                </div>
              </div>
              <!--              账号-->
              <div class="baseInfo">
                <p>账号：</p>
                <p>{{ selfInfo.account }}</p>
              </div>
              <!--              性别-->
              <div class="baseInfo">
                <p>性别：</p>
                <p>{{ selfInfo.sex }}</p>
              </div>
              <!--              年龄-->
              <div class="baseInfo">
                <p>年龄：</p>
                <p>{{ selfInfo.age }}</p>
              </div>
            </el-card>
          </el-tab-pane>
          <!--          邮箱-->
          <el-tab-pane label="邮箱">
            <el-card
                class="box-card"
                style="margin: 0;width: 100%;background: rgba(225,227,140,0.6);"
            >
              <div class="baseInfo">
                <p>邮箱：</p>
                <p>{{ selfInfo.email }}</p>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="联系方式">
            <el-card
                class="box-card"
                style="margin: 0;width: 100%;background: rgba(225,227,140,0.6);"
            >
              <div class="baseInfo">
                <p>联系方式：</p>
                <p>{{ selfInfo.tel }}</p>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="现居住地">
            <el-card
                class="box-card"
                style="margin: 0px;width: 100%;background: rgba(225,227,140,0.6);"
            >
              <div class="baseInfo">
                <p>现居住地：</p>
                <p>{{ selfInfo.location }}</p>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>

    </el-container>
  </div>
</template>

<script>
import router from "@/router/router";
import axios from "axios";
import {ElNotification} from "element-plus";

export default {
  name: "personal_lw",
  data() {
    return {
      selfInfo: {},
      headImage: null,
      admin_name: sessionStorage.getItem("admin"),
    }
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {//防止直接输入地址进入
      this.exit();
    } else {
      this.getInfo();
      this.outTime();
      this.getHeadImage();
    }
  },
  methods: {
    error_headImage() {
      ElNotification({
        title: '失败',
        message: '请再次上传!',
        type: 'error'
      })
    },
    beforeUpload(file) {
      let fileName_back = file.name.substring(file.name.lastIndexOf('.') + 1)
      const Name1 = fileName_back === 'jpg'
      const Name2 = fileName_back === 'jpeg'
      const Name3 = fileName_back === 'png'
      if (Name1 || Name2 || Name3) {
        return true;
      } else {
        ElNotification({
          title: '失败',
          message: '文件类型不支持!',
          type: 'error'
        })
        return false;
      }
    },
    getHeadImage() {
      axios({
        url: '/lw/superAdmin/headImage.com',
        method: 'post',
        params: {
          account: sessionStorage.getItem("admin")
        },
        responseType: 'blob',
      }).then((res) => {
        // console.log(res.data)
        this.headImage = window.URL.createObjectURL(res.data);
      })
    },
    getInfo() {
      axios({
        url: '/lw/selfInfo',
        method: 'post',
        params: {
          account: sessionStorage.getItem("admin")
        }
      }).then((res) => {
        this.selfInfo = res.data[0];
      })
    },
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
    toChangeInfo() {
      router.push({
        path: '/personal_change'
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

.baseInfo {
  display: flex;
  flex-direction: row;
}

.baseInfo :nth-child(1) {
  font-size: 20px;
  height: 25px;
  line-height: 25px;
  font-family: 楷体, serif;
  font-weight: 600;
}

.baseInfo :nth-child(2) {
  font-size: 20px;
  height: 25px;
  line-height: 25px;
}

.baseInfo_headImage {
  display: flex;
  flex-direction: row;
}

.baseInfo_headImage .text {
  font-size: 20px;
  height: 25px;
  line-height: 25px;
  font-family: 楷体, serif;
  font-weight: 600;
}

</style>