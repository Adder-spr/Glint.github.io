<template>
  <div class="common-layout">
    <el-container>
      <el-header style="text-align: center;padding-top:15px;">
        <span style="font-family: 楷体;font-size:18px;color: darkgoldenrod;">欢迎</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体;font-size:18px;color: #acb7ce;" @click="SuperAdmin_Login">登录</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体;font-size:18px;color: darkturquoise;">LW</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体;font-size:18px;color: burlywood;">SHOPPING</span>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
            <el-card class="box-card">
              <div class="text item">
                <span
                    style="font-size: 20px;font-family:楷体;font-weight: 600;flex-wrap: wrap;">Admin 登录须知：</span><br>
                <el-link style="margin-left: 25px;margin-top: 5px;color: aqua;" v-for="(v,i) in login_must_know"
                         :key="i" :href="v.src">
                  <span>{{ v.info }}</span>
                  <el-icon size="13" style="margin-left: 2px;">
                    <Link/>
                  </el-icon>
                </el-link>
              </div>
            </el-card>
            <div style="width: 100%;min-width: 600px;min-height: 400px;margin-top: 250px;">
              <Chart type="bar" :data="chartData" :options="chartOptions"/>
            </div>
          </el-main>
        </el-container>
        <el-aside width="45%" style="background: #ffffff;">
          <div
              v-loading="login"
              element-loading-text="Login..."
              style="position: relative;margin-top: 38%;margin-left: 38%;justify-content: center;width: 230px;z-index: 1;">
            <el-input v-model="account" clearable>
              <template #prepend>账号</template>
            </el-input>
            <el-input v-model="psd" type="password" show-password style="margin-top: 15px;" clearable>
              <template #prepend>密码</template>
            </el-input>
            <el-input v-model="code" clearable style="margin-top: 15px;">
              <template #prepend>验证码</template>
            </el-input>
            <div style="margin-top: 15px;display: flex;flex-direction: row;">
              <el-skeleton style="width: 240px" :loading="haveCode" animated>
                <template #template>
                  <el-skeleton-item style="width: 100%;height: 28px;"/>
                </template>
                <input v-model="NewCode" disabled class="code_center" onpaste="return false" oncopy="return false"
                       oncut="return false" maxlength="11"/>
              </el-skeleton>
              <el-button type="success" style="margin-left: 5%;" @click="getCode">点击刷新</el-button>
            </div>
            <el-button type="primary" plain @click="showInfo" style="margin-top: 15px;width: 230px;">登录</el-button>
            <el-button round style="margin-top: 15px;width: 230px;position: relative;right: 12px;" type="warning"
                       @click="register">去注册
            </el-button>
          </div>
        </el-aside>
      </el-container>
    </el-container>
    <el-affix position="bottom" :offset="20">

    </el-affix>
  </div>

</template>

<script setup>
import Chart from "primevue/chart";</script>
<script>
import axios from "axios";
import router from "../router/router";
import {ElNotification} from "element-plus";

export default {
  name: "login_F",
  created() {
    this.getCode();
    this.getMustKnow();
  },
  data() {
    return {
      account: "",
      psd: "",
      code: "",
      NewCode: "",
      login_must_know: [],
      haveCode: true,
      login: false,
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          type: 'line',
          label: '浏览人数占比',
          borderColor: '#42A5F5',
          borderWidth: 2,
          fill: false,
          data: [48, 27, 45, 51, 48, 46, 55]
        }, {
          type: 'bar',
          label: '总收入',
          backgroundColor: '#66BB6A',
          data: [21, 74, 24, 45, 77, 45, 34],
          borderColor: 'white',
          borderWidth: 2
        }, {
          type: 'bar',
          label: '支出',
          backgroundColor: '#FFA726',
          data: [47, 52, 74, 61, 54, 51, 55]
        }]
      },
      chartOptions: {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          },
          y: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          }
        }
      },

    }
  },
  methods: {
    showInfo() {
      this.login = true;
      let canSe = (this.account.indexOf('"') + this.account.indexOf("'") + this.account.indexOf('`') + this.psd.indexOf('"') + this.psd.indexOf("'") + this.psd.indexOf('`')) > -6;
      let times = setInterval(()=>{
        if (canSe) {
          this.getCode();
          ElNotification({
            title: '警告',
            message: '请规范输入!',
            type: 'warning',
          })
        } else if(this.account === '' || this.psd === ''){
          ElNotification({
            title: '提示',
            message: '请输入完整的登录信息!',
            type:'warning'
          })
        } else if(this.NewCode === this.code) {
          axios({
            url: '/lw/user/login',
            method: "post",
            headers: {'Content-Type': "multipart/form-data, charset=UTF-8"},
            params: {
              account: this.account,
              psd: this.psd
            },
            data: JSON,
          }).then((res) => {
            this.getCode();
            if (res.data.msg === true) {
              clearInterval(times);
              this.login = false;
              router.replace({
                path: '/home',
                // query:{
                //   name:this.account,
                // }
              });
            } else if (res.data.msg === false) {
              ElNotification({
                title: '错误',
                message: '账号或密码错误!',
                type: 'error',
              })
            }
          }).catch(() => {
            ElNotification({
              title: '提示',
              message: '升级期间不可登陆!',
              type: 'info',
            })
          })
        } else {
          ElNotification({
            title: '提示',
            message: '验证码错误!',
            type: 'info',
          })
        }
        clearInterval(times);
        this.login = false;
      },1200)

    },
    getCode() {
      this.haveCode = true;
      axios.get('/lw/user/newCode').then((res) => {
        this.NewCode = res.data;
      });
      const time = setInterval(() => {
        this.haveCode = false;
        clearInterval(time)
      }, 1100);
    },
    getMustKnow() {
      axios.post('/lw/user/mustKnow').then((res) => {
        this.login_must_know = res.data;
      })
    },
    SuperAdmin_Login() {
      router.replace({
        path: '/SuperAdmin_Login'
      })
    },
    register() {
      router.push({
        path: '/register'
      })
    },

  }
}
</script>

<style>
.common-layout {
  width: 100%;
  height: 100%;
}

.el-container {
  height: 100%;
}

.box-card {
  margin-left: 10%;
  width: 80%;
  min-width: 120px;
  color: #409EFF;
  background: #6b778c;
}

.code_center {
  width: 65%;
  text-align: center;
  background: rgba(224, 236, 255, 0.62);
  border: 1px solid rgba(143, 151, 152, 0.47);
  opacity: 0.65;
  border-radius: 5px;
}

</style>