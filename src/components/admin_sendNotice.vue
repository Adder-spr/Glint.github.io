<template>
  <div style="display: flex;">
    <div>
      <el-menu default-active="0" style="width: 130px;height: 100%;">
        <el-menu-item index="0">发送通知</el-menu-item>
        <el-menu-item index="1" @click="toChangeNotice">修改通知</el-menu-item>
        <el-menu-item index="2" @click="toReviewReq">审核请求</el-menu-item>
        <el-menu-item index="3">用户管理</el-menu-item>

      </el-menu>
    </div>
    <div style="margin-top: 5px;margin-left: 12px;margin-right: 12px;width: 100%;">
      <div style="display: flex;width: 100%;">
        <div style="width: 45%;margin-left: 3%;">
          <div v-loading="sendLoad">
            <el-input placeholder="输入发送通知的对象" v-model="sendNotice_us">
              <template #prepend>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="点击这里发送！"
                    placement="top-start"
                >
                  <el-button :icon="Position" @click="OneSend"></el-button>
                </el-tooltip>
              </template>
              <template #append>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="当然，你也可以点击这里来全部发送！"
                    placement="top-end"
                >
                  <el-button :icon="Promotion" @click="allSend"></el-button>
                </el-tooltip>
              </template>
            </el-input>
            <el-input v-model="sendNotice_content" type="textarea" style="margin-top: 12px;"
                      placeholder="发送的内容..."/>
          </div>
        </div>
        <div style="width: 4%;"></div>
        <div style="width: 45%;margin-right: 3%;">
          <el-input v-model="search_us" placeholder="查找用户">
            <template #prepend>
              <el-button :icon="Search" @click="search_user"/>
            </template>
          </el-input>
          <div style="justify-content: center;display:flex;flex-direction: column;">
            <el-table :data="showUs" height="850" style="width: 100%">
              <el-table-column prop="account" label="账号"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Position, Promotion, Search} from '@element-plus/icons-vue';</script>
<script>
import axios from "axios";
import {ElNotification} from "element-plus";
import router from "@/router/router";

export default {
  name: "LWSA_sendNotice",
  data() {
    return {
      //发送通知部分
      search_us: '',
      allUs: [],
      allUs_removeAccount: [],
      showUs: [],
      sendNotice_us: '',
      sendNotice_content: '',
      sendLoad: false,

    }
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("Admin") === null || sessionStorage.getItem("Admin") === '') {
      router.replace({
        path: '/'
      })
    } else {
      this.getSend_us();
      this.outTime();
    }
  },
  methods: {
    toChangeNotice() {
      router.push({
        path: '/admin_changeNotice'
      })
    },
    toReviewReq() {
      router.push({
        path: '/admin_review_req'
      })
    },
    getSend_us() {
      axios({
        url: '/lw/superAdmin/getName',
        method: 'post',
      }).then((res) => {
        this.allUs = res.data;
        this.showUs = res.data;
        this.allUs.forEach((v) => {
          this.allUs_removeAccount.push(v.account);
        })
      }).catch(() => {
        ElNotification({
          title: '信息获取失败',
          message: '检查网络是否正常!',
          type: 'info'
        })
      })
    },
    OneSend() {
      let whe_have_US = false;
      this.allUs.forEach((v) => {
        if (v.account === this.sendNotice_us) {
          whe_have_US = true;
        }
      })
      if (whe_have_US) {
        axios({
          url: '/lw/superAdmin/addNoticeOne',
          method: 'post',
          params: {
            name: this.sendNotice_us,
            content: this.sendNotice_content
          }
        }).then((res) => {
          if (res.data.whe) {
            ElNotification({
              title: 'Success',
              message: 'Send OK !',
              type: 'success'
            })
            this.sendNotice_us = '';//清空输入的发送人,准备第二次发送
            this.sendNotice_content = '';//....
          } else {
            ElNotification({
              title: '失败',
              message: '发送失败！',
              type: 'info'
            })
          }
        })
      } else {
        ElNotification({
          title: '失败',
          message: '该用户不存在!',
          type: 'warning'
        })
      }
    },
    allSend() {
      this.sendLoad = true;//开始发送,等待发送完毕
      let sended = 0;
      let sendContent = this.sendNotice_content;
      let wheSucc = true;
      let times = setInterval(() => {
        if (sended >= this.allUs_removeAccount.length) {
          clearInterval(times);
        } else {
          axios({
            url: '/lw/superAdmin/addNoticeAll',
            method: 'post',
            params: {
              allUse: this.allUs_removeAccount[sended++],
              content: sendContent
            }
          }).then((res) => {
            if (!res.data.whe) {//如果有发送失败则停止发送
              this.sendLoad = false;//失败则不再等待
              ElNotification({
                title: '失败',
                message: '发送失败！',
                type: 'info'
              })
              wheSucc = false;
              clearInterval(times);
            }
          }).catch(() => {
            this.sendLoad = false;//有异常则不再等待
            wheSucc = false;
            clearInterval(times);
          })
        }
      }, 50);//五十毫秒发送一次
      if (wheSucc) {//如果成功发送全部
        this.sendLoad = false;//成功
        this.sendNotice_content = '';//清空发送内容,准备下一次发送
        ElNotification({
          title: '成功！',
          message: '全部发送成功！',
          type: 'success'
        })
      }
    },
    search_user() {//实现发送通知模块的用户查找显示
      this.showUs = [];
      if (this.search_us === '') {
        this.showUs = this.allUs;
      } else {
        this.allUs.forEach((v) => {
          if (v.account.indexOf(this.search_us) > -1) {
            this.showUs.push(v);
          }
        })
      }
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
          router.replace({
            path: '/'
          });
          clearInterval(wheClear);
        }
        times++;
      }, 1000);
    },
    whe_iphone() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
  }
}
</script>

<style>

</style>