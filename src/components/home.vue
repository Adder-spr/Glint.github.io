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
      <el-container class="el-container">
        <el-aside  style="width: 450px;background: #6b778c;">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>Time</span>
                <el-button class="button">Detail Time</el-button>
              </div>
            </template>
            <div>{{ now }}</div>
          </el-card>
          <el-config-provider :locale="locale">
            <el-calendar style="background: #6b778c">
              <template #date-cell="{ data }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                  {{ data.day.split('-').slice(1).join('-') }}
                  {{ data.isSelected ? '✔️' : '' }}
                </p>
              </template>
            </el-calendar>
          </el-config-provider>
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
          <el-carousel :interval="4000" type="card" height="390px">
            <el-carousel-item v-for="item in 3" :key="item">
            </el-carousel-item>
          </el-carousel>
          <el-table :data="tableData" style="width: 100%;" max-height="411">
            <el-table-column fixed prop="account" label="账号" style="width: 20%;"/>
            <el-table-column prop="birthday" label="出生日期" style="width: 18%;"/>
            <el-table-column prop="email" label="电子邮箱" style="width: 22%;"/>
            <el-table-column prop="location" label="居住地" style="width: 30%;"/>
            <el-table-column fixed="right" prop="sex" label="性别" style="width: 10%;"/>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router/router";
import {computed} from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

export default {
  name: "home_F",
  data() {
    return {
      activeIndex: 'Home',
      isCollapse: true,
      tableData: [],
      now: "",
      language: 'en',
      locale: computed(() => (this.language === 'zh-cn' ? zhCn : en)),

    }
  },
  created() {
    axios.post('/lw/getAccount').then((res)=>{
      this.tableData = res.data;
    });
    this.NowDetailData();
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
      }else if (key === "Home") {
        this.ToHome();
        console.log("Home Coming!");
      } else if (key === "Chinese_Simplified") {
        this.language = 'zh-cn';
        console.log('zh-cn')
      } else if (key === "English") {
        this.language = 'en';
        console.log('en')
      }
    },
    NowDetailData(){
      setInterval(()=>{
      let a = new Date().getTime(); //获取到当前时间戳
      let b = new Date(a); //创建一个指定的日期对象
      let year = b.getFullYear(); //年份
      let month = (b.getMonth() + 1)>9?(b.getMonth() + 1):"0"+(b.getMonth() + 1); //月份（0-11）
      let date = b.getDate()>9?b.getDate():"0"+b.getDate(); //天数（1到31）
      let hours = b.getHours()>9?b.getHours():"0"+b.getHours(); //小时（1到24）;
      let minutes = b.getMinutes()>9?b.getMinutes():"0"+b.getMinutes(); //分钟(1-60)
      let second = b.getSeconds()>9?b.getSeconds():"0"+b.getSeconds(); //秒钟(1-60)
      let data =  year + "-" + month + "-" + date + ": " + hours + "-" + minutes + "-" + second
      this.now = data;
    },1000)},

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

.el-carousel__item:nth-child(2n) {
  background-image: url("https://desk-fd.zol-img.com.cn/t_s960x600c5/g2/M00/0F/04/Cg-4WVVtECyIIrmqABCqFyoOCYkAAEg5wDCLrsAEKov842.jpg");
  background-size: 100% 100%;
}

.el-carousel__item:nth-child(2n+1) {
  background: url("http://img1.xcar.com.cn/exp/3367/3368/3428/20110302131444622238.jpg");
  background-size: 100% 100%;
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