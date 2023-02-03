<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding: 0;height: 59px;">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            id="head"
        >
          <el-menu-item index="Home" style="width: 150px;font-size: 14px;" @click="ToHome">
            <el-icon size="17">
              <Location/>
            </el-icon>
            <span>用户信息</span>
          </el-menu-item>
          <div class="flex-grow"/>
          <el-menu-item index="About" style="width: 150px;font-size: 14px;" @click="About">
            <span>关于</span>
            <el-icon size="13" style="color: #409EFF;">
              <InfoFilled/>
            </el-icon>
          </el-menu-item>
          <el-sub-menu index="message">
            <template #title>管理员</template>
            <el-menu-item index="AddMessage">注册管理员</el-menu-item>
            <el-menu-item index="TelSuperMessage">
              <span>联系超级管理员</span>
              <el-icon size="13">
                <Phone/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="Personal">
            <template #title>个人中心</template>
            <el-menu-item index="PWatchPerInfo" @click="WatchPerInfo">
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
            <el-menu-item index="POut" @click="exit">
              <span>安全退出</span>
              <el-icon size="13" style="color: #F56C6C;">
                <SwitchButton/>
              </el-icon>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container class="el-container">
        <div style="width: 23%;background: #6b778c;">
          <el-descriptions
              title="Thanks To The Creators"
              direction="vertical"
              :column="4"
              :size="'small'"
              border
          >
            <el-descriptions-item label="姓名">张强</el-descriptions-item>
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
          <el-card class="box-card" style="width: 100%;">
            <template #header>
              <div class="card-header">
                <span>Time</span>
                <el-button class="button">Detail Time</el-button>
              </div>
            </template>
            <div>{{ now }}</div>
          </el-card>
        </div>
        <div style="background: #acb7ce;width: 77%;justify-content: center;display: flex;">
          <div ref="tableDataF" style="width: 83%;">
            <el-input
                v-model="select"
                placeholder="Input Key"
                class="input-with-select"
                style="margin-top: 10px;"
                clearable
            >
              <template #prepend>
                <el-button :icon="Search" @click="search"/>
              </template>
            </el-input>
            <el-table v-loading="wheSelect" :data="tableData" style="width: 100%;position: relative;margin-top: 5px;"
                      max-height="605" ref="tableData">
              <el-table-column fixed prop="account" label="账号" style="width: 5%;"/>
              <el-table-column prop="birthday" label="出生日期" style="width: 10%;"/>
              <el-table-column prop="email" label="电子邮箱" style="width: 15%;"/>
              <el-table-column prop="location" label="居住地" style="width: 10%;"/>
              <el-table-column prop="sex" label="性别" style="width: 10%;"/>
              <el-table-column prop="admin" label="类型" style="width: 10%;"/>
              <el-table-column fixed="right" label="操作" style="width: 10%;">
                <template #default="scope">
                  <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="changeStatus(scope.$index)"
                      v-if="this.tableData[scope.$index].admin !== '管理员'"
                  >
                    修改状态
                  </el-button>
                  <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="changeInfo(scope.$index)"
                      style="margin-left: 2px;"
                      v-if="this.tableData[scope.$index].admin !== '管理员'"
                  >
                    修改信息
                  </el-button>
                  <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="look(scope.$index)"
                      style="margin-left: 2px;"
                      v-if="this.tableData[scope.$index].admin === '管理员'"
                  >
                    查看信息
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {Edit, InfoFilled, Location, Phone, SwitchButton} from '@element-plus/icons-vue';</script>
<script>
import axios from "axios";
import router from "@/router/router";

export default {
  name: "home_F",
  created() {
    this.wheSelect = true;
    axios.post('/lw/getAccount').then((res) => {
      res.data.forEach((s) => {
        if (s.admin === '0') {
          s.admin = '用户';
        } else {
          s.admin = '管理员';
        }
        this.auto_Date.push(s);
      })
      this.tableData = this.auto_Date;
      this.wheSelect = false;
    }).catch(() => {//用两个false用于等待,放外面会直接被运行
      this.wheSelect = false;
    });
    this.NowDetailData();
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {
      this.exit();
    }
  },
  data() {
    return {
      activeIndex: 'Home',
      isCollapse: true,
      tableData: [],
      tableData_selected: [],
      auto_Date: [],
      now: "",
      select: '',
      wheSelect: false,

    }
  },
  methods: {
    whe_iphone() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    changeStatus(e) {
      console.log(e);
    },
    changeInfo(e) {
      console.log(e)
    },
    look(e) {
      console.log(e)
    },
    exit() {
      sessionStorage.clear();
      router.replace({
        path: '/'
      })
    },
    search() {
      this.wheSelect = true;//开始找,等待
      this.tableData = [];//让展示的为空,就是好看
      this.tableData_selected = [];//防止第二次找不到会残留数据
      if (this.select === '') {//若果未输入,则直接返回服务器发过来的
        this.wheSelect = false;//找完了
        this.tableData = this.auto_Date;
      } else {
        this.auto_Date.forEach((s) => {//一个一个找
          if (s.account.indexOf(this.select) !== -1) {//不等于-1,则说明有,有就加在正在找的数组中
            this.tableData_selected.push(s);
          }
        });
        this.wheSelect = false;//找完了
        this.tableData = this.tableData_selected;//将找出来的一起展示出来
      }
    },
    ToHome() {
      router.replace({
        path: '/home'
      })
    },
    WatchPerInfo() {
      router.replace({
        path: '/personal'
      })
    },
    About() {
      router.replace({
        path: '/about'
      })
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
        this.now = year + "-" + month + "-" + date + ": " + hours + "-" + minutes + "-" + second;
      }, 1000)
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