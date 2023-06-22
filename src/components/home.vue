<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding: 0;height: 59px;">
        <el-menu
            :default-active="'home'"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <el-menu-item index="home" style="width: 150px;font-size: 14px;">
            <el-icon size="17">
              <location/>
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <div class="flex-grow"/>
          <el-menu-item index="about" @click="About" style="width: 150px;font-size: 14px;">
            <span>关于</span>
            <el-icon size="13" style="color: #409EFF;">
              <InfoFilled/>
            </el-icon>
          </el-menu-item>
          <el-sub-menu index="message">
            <template #title>管理员</template>
            <el-menu-item index="register_A_0" @click="registerNew_Admin">注册管理员</el-menu-item>
            <el-menu-item index="cal_Super_admin">
              <span>联系超级管理员</span>
              <el-icon size="13">
                <Phone/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="personal">
            <template #title>个人中心</template>
            <el-menu-item index="watchPer" @click="WatchPerInfo">
              <span>查看个人信息</span>
              <el-icon size="13" style="color: #409EFF;">
                <Avatar/>
              </el-icon>
            </el-menu-item>
            <el-menu-item index="Change_per" @click="toChangeInfo">
              <span>修改个人信息</span>
              <el-icon size="13">
                <Edit/>
              </el-icon>
            </el-menu-item>
            <el-menu-item index="exit" @click="Exit">
              <span>安全退出</span>
              <el-icon size="13" style="color: #F56C6C;">
                <SwitchButton/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container class="el-container">
        <el-aside style="width: 30%;background: #6b778c;">
          <el-card class="box-card" style="width: 99%;">
            <template #header>
              <div class="card-header">
                <span>Time</span>
                <el-button class="button">Detail Time</el-button>
              </div>
            </template>
            <div>{{ now }}</div>
          </el-card>
          <el-descriptions
              title="Thanks To The Creators"
              direction="vertical"
              :column="4"
              :size="'small'"
              border
          >
            <el-descriptions-item label="姓名">李虹呈</el-descriptions-item>
            <el-descriptions-item label="联系方式">15828949858</el-descriptions-item>
            <el-descriptions-item label="居住地" :span="2">Suzhou</el-descriptions-item>
            <el-descriptions-item label="标签">
              <el-tag size="small" type="success" class="ml-2">Vue</el-tag>
              <el-tag size="small" style="position: relative;left: 8px;">Java</el-tag>
              <el-tag type="danger" class="ml-2" size="small" style="margin-top: 5px;">Spring</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="简介"
            >Proficient in various platform language development, especially Springboot.
            </el-descriptions-item>
          </el-descriptions>
        </el-aside>
        <el-main style="background: #acb7ce;width: 100%;">
          <el-table :data="tableData" style="width: 100%;" max-height="811">
            <el-table-column fixed prop="account" label="账号" width="120px"/>
            <el-table-column prop="age" label="年龄" width="80px"/>
            <el-table-column prop="location" label="居住地"/>
            <el-table-column prop="email" label="电子邮箱"/>
            <el-table-column prop="tel" label="联系方式"/>
            <el-table-column prop="sex" label="性别" width="80px"/>
            <el-table-column fixed="right" label="操作" width="180px">
              <template #default="admin">
                <el-tag v-if="tableData[admin.$index].admin === 1">管理员</el-tag>
                <el-tag class="ml-2" type="danger" style="margin-left: 5px;"
                        v-if="tableData[admin.$index].admin === 1">Only Read
                </el-tag>
                <el-button
                    v-if="tableData[admin.$index].admin === 0"
                    type="primary"
                    plain
                    size="small"
                    @click="showInfo"
                >查看信息
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <el-button class="mt-4" style="width: 100%" @click="onAddItem"-->
          <!--          >Add Item</el-button-->
          <!--          >-->
        </el-main>
      </el-container>
    </el-container>
  </div>
  <el-drawer v-model="look_info" title="I am the title" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script>
import axios from "axios";
import router from "@/router/router";
import {ElNotification} from "element-plus";

export default {
  name: "home_F",
  data() {
    return {
      tableData: [],
      now: "",
      look_info: false,
    }
  },
  created() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {
      router.replace({
        path: '/'
      })
    } else {
      this.getAccount();
      this.outTime();
      this.NowDetailData();
    }
  },
  methods: {
    showInfo() {
      this.look_info = true;
    },
    changeStatu(e) {
      console.log(e)
    },
    registerNew_Admin() {
      router.push({
        path: '/register'
      })
    },
    WatchPerInfo() {
      router.push({
        path: '/personal'
      })
    },
    toChangeInfo() {
      router.push({
        path: '/personal_change'
      })
    },
    About() {
      router.push({
        path: '/about'
      })
    },
    Exit() {
      router.replace({
        path: '/'
      })
    },
    getAccount() {
      axios({
        url: '/lw/getAccount',
        method: 'post',
        params: {
          account: sessionStorage.getItem("admin")
        },
        headers: {
          'token': sessionStorage.getItem("token")
        },
      }).then((res) => {
        if (res.data.msg != null) {
          alert(res.data.msg)
          this.Exit();
        } else {
          this.tableData = res.data;
        }
      });
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
          this.Exit();
          clearInterval(wheClear);
        }
        times++;
      }, 1000);
    },
    NowDetailData() {
      setInterval(() => {
        let a = new Date().getTime(); //获取到当前时间戳
        let b = new Date(a); //创建一个指定的日期对象
        let year = b.getFullYear(); //年份
        let month = (b.getMonth() + 1) > 9 ? (b.getMonth() + 1) : "0" + (b.getMonth() + 1); //月份（0-11）
        let date = b.getDate() > 9 ? b.getDate() : "0" + b.getDate(); //天数（1到31）
        let hours = b.getHours() > 9 ? b.getHours() : "0" + b.getHours(); //小时（1到24）;
        let minutes = b.getMinutes() > 9 ? b.getMinutes() : "0" + b.getMinutes(); //分钟(1-60)
        let second = b.getSeconds() > 9 ? b.getSeconds() : "0" + b.getSeconds(); //秒钟(1-60)
        let data = year + "-" + month + "-" + date + ": " + hours + "-" + minutes + "-" + second
        this.now = data;
      }, 1000)
    },
    whe_iphone() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
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

.is-selected {
  color: #ba19fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}

.box-card {
  margin-left: 0;
  width: 448px;
  height: 138px;
  background: #6b778c;
  color: blanchedalmond;
}
</style>