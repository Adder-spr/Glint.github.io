<template>
  <div style="display: flex;width: 100%;">
    <div style="width: 50%;border-right: 1px solid rgba(105,97,97,0.34)">
      <div style="height: 50px;text-align: center;"></div>
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
        <el-input v-model="sendNotice_content" type="textarea" placeholder="发送的内容..."/>
      </div>
    </div>
    <div style="width: 50%;">
      <div style="height: 50px;text-align: center;"></div>
      <el-input v-model="search_us">
        <template #prepend>
          <el-button :icon="Search" @click="search"/>
        </template>
      </el-input>
      <div style="justify-content: center;display:flex;flex-direction: column;">
        <el-table :data="showUs" height="350" style="width: 100%">
          <el-table-column prop="account" label="账号"/>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script setup>
import {Position, Promotion} from '@element-plus/icons-vue';</script>
<script>
import axios from "axios";
import {ElNotification} from "element-plus";

export default {
  name: "LWSA_sendNotice",
  data() {
    return {
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
        title: 'Name获取失败',
        message: '检查网络是否正常!',
        type: 'info'
      })
    })
  },
  methods: {
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
    search() {
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
    }
  }
}
</script>

<style scoped>

</style>