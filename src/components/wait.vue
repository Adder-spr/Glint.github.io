<template>
  <div>
    <div style="display: flex;flex-direction: row;" id="body">
      <div style="width: 65%;">
        <el-scrollbar id="look_left">
          <el-collapse accordion>
            <el-collapse-item name="waiteLook">
              <template #title>
                <div style="margin-left: 10px; display: flex;">
                  <span style="font-size: 16px;color: #c28989;">待查看</span>
                  <div style="position: relative;top: 2px;margin-left: 8px;color: #ad7777;">
                    <el-icon size="15">
                      <Bell/>
                    </el-icon>
                    <el-badge :is-dot="haveData_waitLook.length > 0" class="item"></el-badge>
                  </div>
                </div>
              </template>
              <div>
                <el-empty :description="waitLook_descript" v-if="haveData_waitLook.length === 0"/>
                <el-card style="margin-left: 7px;margin-top: 15px;" v-else-if="haveData_waitLook.length > 0"
                         v-for="(waitLook_data,i) in haveData_waitLook" :key="i">
                  <el-header>
                    <div>{{ waitLook_data.content }}</div>
                    <div style="justify-content: space-between;display: flex;margin-top: 20px;">
                      <el-link @click="looked(haveData_waitLook[i].id)">确认已查看</el-link>
                      <span>{{ waitLook_data.time }}</span>
                    </div>
                  </el-header>
                </el-card>
              </div>
            </el-collapse-item>
            <el-collapse accordion>
              <el-collapse-item name="Looked">
                <template #title>
                  <div style="margin-left: 10px; display: flex;">
                    <span style="font-size: 16px;color: #4c92d7;">已查看</span>
                  </div>
                </template>
                <div style="opacity: 0.7;">
                  <el-empty :description="Looked_descript" v-if="haveData_Looked.length === 0"/>
                  <el-card style="margin-left: 7px;margin-top: 15px;" v-else-if="haveData_Looked.length > 0"
                           v-for="(looked,i) in haveData_Looked" :key="i">
                    <el-header>
                      <div style="color: #4c92d7;">{{ looked.content }}</div>
                      <div style="justify-content: right;display: flex;color: #4c92d7;">{{ looked.time }}</div>
                    </el-header>
                  </el-card>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div>
        <el-divider direction="vertical" style="height: 100%;"/>
      </div>
      <div style="width: 45%;">
        <el-collapse accordion>
          <el-collapse-item name="NeedNotice">
            <template #title>
              <div style="margin-left: 10px; display: flex;">
                <span style="font-size: 16px;color: rgba(27,47,39,0.85);">通知</span>
                <div style="position: relative;top: 2px;margin-left: 8px;">
                  <el-icon size="15">
                    <Bell/>
                  </el-icon>
                  <el-badge :is-dot="haveNewNotice" class="item"></el-badge>
                </div>
              </div>
            </template>
            <div>
              <el-empty :description="Looked_descript" v-if="haveData_nedNotice.length === 0"/>
              <el-card style="margin-right: 7px;margin-top: 15px;" v-else-if="haveData_nedNotice.length > 0"
                       v-for="(nedNotice,i) in haveData_nedNotice" :key="i">
                <el-header>
                  <div>{{ nedNotice.content }}</div>
                  <div style="justify-content: space-between;display: flex;margin-top: 20px;">
                    <el-link v-if="haveNewNotice" @click="looked(haveData_nedNotice[i].id)">确认已查看
                    </el-link>
                    <span>{{ nedNotice.time }}</span>
                  </div>
                </el-header>
              </el-card>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script setup>
import {Bell} from '@element-plus/icons-vue'</script>
<script>
import axios from "axios";
import {ElNotification} from "element-plus";
import router from "@/router/router";

export default {
  name: "wait_pass",
  data() {
    return {
      name: sessionStorage.getItem("register_admin"),
      //等待查看的数据
      haveData_waitLook: [],
      waitLook_descript: '无数据',
      //已查看的数据
      haveData_Looked: [],
      Looked_descript: '无数据',
      //通知的数据
      haveData_nedNotice: [],
      haveNewNotice: false,
      nedNotice_descript: '无数据',
    }
  },
  mounted() {
    if (sessionStorage.getItem("register_admin") === null) {
      this.exit();
    } else {
      this.getWaitLook();
      this.getNotice();
      this.getLooked();
    }
    window.onresize = () => {
      let allHei = document.documentElement.clientHeight;
      document.getElementById("look_left").setAttribute("height", allHei + "px");
    }
  },
  methods: {
    looked(i) {
      axios({
        url: '/lw/notice/sureLooked',
        method: 'post',
        params: {
          id: i
        }
      }).then((res) => {
        if (!res.data.whileLook) {
          ElNotification({
            title: '异常',
            message: '确认失败！',
            type: 'warning'
          })
        } else {
          this.getWaitLook();
          this.getNotice();
          this.getLooked();
        }
      }).catch(() => {
        ElNotification({
          title: '错误',
          message: '出错啦！',
          type: 'error'
        })
      })
    },
    wheHaveNewNotice() {
      this.haveNewNotice = false;
      if (this.haveData_nedNotice.length > 0) {
        for (let i = 0; i < this.haveData_nedNotice.length; i++) {
          if (this.haveData_nedNotice[i].whe_looked === '0') {
            this.haveNewNotice = true;
            break;
          }
        }
      }
    },
    getWaitLook() {
      axios({
        url: '/lw/notice/waitLook',
        method: 'post',
        params: {
          account: this.name
        }
      }).then((res) => {
        this.haveData_waitLook = res.data;
      }).catch((e) => {
        console.log(e)
      })
    },
    getLooked() {
      axios({
        url: '/lw/notice/Looked',
        method: 'post',
        params: {
          account: this.name
        }
      }).then((res) => {
        this.haveData_Looked = res.data;
      }).catch((e) => {
        console.log(e)
      })
    },
    getNotice() {
      axios({
        url: '/lw/notice/notice',
        method: 'post',
        params: {
          account: this.name
        }
      }).then((res) => {
        this.haveData_nedNotice = res.data;
        this.wheHaveNewNotice();
      }).catch((e) => {
        console.log(e)
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
.item {
  position: relative;
  top: -2px;
  right: 8px;
}
</style>