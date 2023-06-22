<template>
  <div style="display: flex;width: 100%;height: 100%;">
    <div>
      <el-menu default-active="1" style="width: 130px;">
        <el-menu-item index="0" @click="toSendNotice">发送通知</el-menu-item>
        <el-menu-item index="1">修改通知</el-menu-item>
        <el-menu-item index="2" @click="toReviewReq">审核请求</el-menu-item>
        <el-menu-item index="3">用户管理</el-menu-item>
      </el-menu>
    </div>
    <div style="margin-top: 5px;margin-left: 12px;margin-right: 12px;width: 100%;">
      <el-table :data="copyNoticeTableData" :row-class-name="notice_s" style="width: 100%">
        <el-table-column label="Id" prop="id" width="100px"/>
        <el-table-column label="状态" width="100px">
          <template #default="scope">
            <el-tag v-if="scope.row.status === '1'" type="success">有效</el-tag>
            <el-tag v-else-if="scope.row.status === '0'" type="info">无效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="account" width="100px"/>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="创建时间" prop="time" sortable width="180px"/>
        <el-table-column label="查看" width="100px">
          <template #default="scope">
            <el-tag v-if="scope.row.whe_looked === '1'" type="success">已查看</el-tag>
            <el-tag v-else-if="scope.row.whe_looked === '0'" type="info">未查看</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通知" width="80px">
          <template #default="scope">
            <el-tag v-if="scope.row.whe_notice === '1'" type="warning">是</el-tag>
            <el-tag v-else-if="scope.row.whe_notice === '0'">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" width="250px">
          <template #header>
            <el-input v-model="Notice_Search" size="default" placeholder="Search By Account">
              <template #append>
                <el-button :icon="Search" @click="Up_NoticeList"/>
              </template>
            </el-input>
          </template>
          <template #default="scope">
            <el-button
                size="small"
                @click="ChangeNotice_status(scope.$index,scope.row.id)"
                style="margin-right: 40px;"
            >
              设置状态
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="NoticeDelete(scope.$index,scope.row.id)"
                style="margin-right: 30px;"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-drawer v-model="whe_changeNotice" size="35%">
        <template #header>
          <div style="display: flex;justify-content: start;">
            <span>修改信息</span>
            <el-tooltip
                effect="dark"
                content="切勿随意修改！"
                placement="right"
            >
              <el-icon size="17" style="margin-top: 2px;color: rgba(72,144,229,0.56)">
                <Warning/>
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <sup style="color: red;font-size: 14px;">*</sup>
        <span style="color: rgba(190,93,137,0.7);font-size: 16px;">数字<i> 1 </i>代表有效,数字<i> 0 </i>代表无效</span>
        <el-input
            v-model="Notice_status"
            maxlength="1"
            show-word-limit
        >
          <template #prefix>
            <div>状态：</div>
          </template>
        </el-input>
        <h3></h3>
        <span style="font-size: 15px;">内容：</span>
        <el-input v-model="Notice_Content" type="textarea" maxlength="200" show-word-limit></el-input>
        <el-button v-loading="sureChange_load" style="margin-top: 5px;" @click="sureChange">提交修改</el-button>
      </el-drawer>
      <el-pagination
          v-model:current-page="pages"
          v-model:page-size="page_size"
          :page-sizes="[30, 50, 100, 300, 300, 500, 1000, 5000, 10000]"
          :disabled="false"
          :small="false"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="changeSize"
          @current-change="changePage"
          style="width: 100%;"
          :hide-on-single-page="true"
      />
    </div>
    <el-backtop :right="220" :bottom="80"/>
  </div>
</template>

<script setup>
import {Search, Warning} from '@element-plus/icons-vue';</script>
<script>
import axios from "axios";
import {ElNotification} from "element-plus";
import router from "@/router/router";

export default {
  name: "admin_changeNotice",
  data() {
    return {
      //修改通知部分
      Notice_Search: '',
      NoticeTableData: [],
      copyNoticeTableData: [],
      whe_changeNotice: false,//弹出修改信息的弹出层
      Notice_status_before: '',//存储修改信息前的状态
      Notice_status: '',//存储修改的状态
      Notice_Content_before: '',//存储修改内容前的内容
      Notice_Content: '',//存储修改的内容
      sureChange_load: false,//修改等待
      changeNotice_id: '',//改变信息的在数据库中的id
      total: 0,
      pages: 1,
      page_size: 30,

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
      this.getNotice();
      this.getCountNotice();
      this.outTime();
    }
  },
  methods: {
    changePage() {
      this.getNotice();
    },
    changeSize() {
      this.getNotice();
    },
    sureChange() {
      this.sureChange_load = true;//等待提交
      if ((this.Notice_status === '0' || this.Notice_status === '1') && (this.Notice_status !== this.Notice_status_before || this.Notice_Content !== this.Notice_Content_before) && this.Notice_Content !== '') {
        axios({
          url: '/lw/notice/changeNotice',
          method: 'post',
          params: {
            id: this.changeNotice_id,
            newStatus: this.Notice_status,
            newContent: this.Notice_Content
          }
        }).then((res) => {
          if (res.data.up) {
            ElNotification({
              title: '成功',
              message: '修改成功!',
              type: 'success'
            })
            this.getAll_Notice();
            this.whe_changeNotice = false;
            this.sureChange_load = false;
          } else {
            ElNotification({
              title: '失败',
              message: '修改失败!',
              type: 'info'
            })
            this.sureChange_load = false;
          }
        }).catch(() => {
          ElNotification({
            title: '异常',
            message: '修改异常!',
            type: 'error'
          })
          this.sureChange_load = false;//放外面会先执行,多线程
        })
      } else if (this.Notice_status !== '0' && this.Notice_status !== '1') {
        ElNotification({
          title: '提示',
          message: '状态格式输入错误!',
          type: 'info'
        })
        this.sureChange_load = false;
      } else if (this.Notice_Content === '') {
        ElNotification({
          title: '错误',
          message: '信息不可为空!',
          type: 'error'
        })
        this.sureChange_load = false;
      } else {
        ElNotification({
          title: '提示',
          message: '未修改信息!',
          type: 'info'
        })
        this.sureChange_load = false;
      }
    },
    notice_s(a) {
      if (a.row.status === '0') {
        return 'warning-row'
      }
      return ''
    },
    getNotice() {
      axios({//获取每一页的数据
        url: '/lw/superAdmin/getNotice',
        method: 'post',
        params: {
          startPages: this.pages,
          num: this.page_size
        }
      }).then((res) => {
        this.NoticeTableData = res.data;
        this.copyNoticeTableData = res.data;
      }).catch();
    },
    getCountNotice() {
      //获取总数
      axios({
        url: '/lw/superAdmin/getNoticeCount',
        method: 'post'
      }).then((res) => {
        this.total = res.data[0].notice_all;
      }).catch();
    },
    Up_NoticeList() {
      this.copyNoticeTableData = [];
      if (this.Notice_Search === '') {
        this.copyNoticeTableData = this.NoticeTableData;
      } else {
        this.NoticeTableData.forEach((v) => {
          if (v.account.indexOf(this.Notice_Search) > -1) {
            this.copyNoticeTableData.push(v);
          }
        })
      }
    },
    ChangeNotice_status(table_index, Notice_id) {
      let searchFi = false;
      for (let i = 0; i < this.NoticeTableData.length; i++) {
        if (this.NoticeTableData[i].id === Notice_id) {
          this.Notice_status_before = this.NoticeTableData[i].status;
          this.Notice_status = this.NoticeTableData[i].status;
          this.Notice_Content_before = this.NoticeTableData[i].content;
          this.Notice_Content = this.NoticeTableData[i].content;
          searchFi = true;
        }
        if (searchFi) {//找到就退出
          this.whe_changeNotice = true;
          break;
        }
      }
      this.changeNotice_id = Notice_id;
    },
    NoticeDelete(table_index, Notice_id) {//删除通知
      console.log(table_index, Notice_id)
    },
    toSendNotice() {
      router.push({
        path: '/admin_sendNotice'
      })
    },
    toReviewReq() {
      router.push({
        path: '/admin_review_req'
      })
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

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>