<template>
  <div class="common-layout">
    <el-container>
      <el-header style="text-align: center;padding-top:15px;" id="head">
        <span style="font-family: 楷体,serif;font-size:18px;color: darkgoldenrod;">欢迎</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体,serif;font-size:18px;color: #acb7ce;cursor: pointer;" @click="SuperAdmin_Login">登录</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体,serif;font-size:18px;color: darkturquoise;">LW</span>
        <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
        <span style="font-family: 楷体,serif;font-size:18px;color: burlywood;">管理员系统</span>
      </el-header>
      <el-container>
        <div style="width: 50%;">
          <el-card class="box-card">
            <div class="text item">
                <span
                    style="font-size: 20px;font-family:楷体,serif;font-weight: 600;flex-wrap: wrap;">Admin 须知条款：</span><br>
              <el-link style="margin-left: 25px;margin-top: 5px;color: aqua;" v-for="(v,i) in login_must_know"
                       :key="i" :href="v.src">
                <span>{{ v.info }}</span>
                <el-icon size="13" style="margin-left: 2px;">
                  <Link/>
                </el-icon>
              </el-link>
            </div>
          </el-card>
        </div>
        <div style="width: 50%;display: flex;justify-content: center;">
          <div
              v-loading="login"
              element-loading-text="Login..."
              style="width: 230px;height: 330px;position: relative;" ref="login_bod">
            <el-input v-model="account" clearable :prefix-icon="User" placeholder="账号"></el-input>
            <el-input v-model="psd" type="password" show-password style="margin-top: 15px;" :prefix-icon="Lock"
                      clearable placeholder="密码"></el-input>
            <div style="margin-top: 15px;display: flex;flex-direction: row;">
              <el-input v-model="code" :prefix-icon="Check" style="margin-right: 20px;" placeholder="验证码"></el-input>
              <el-image v-loading="haveCode" style="width: 150px;border: 1px solid black;" :src="codeImage" alt="验证码"
                        :fit="'scale-down'" @click="Code"></el-image>
            </div>
            <div style="display: flex;flex-direction: row;height: 15px;margin-bottom: 10px;">
              <el-checkbox v-model="agree" size="default" style="margin-top: 1px;"></el-checkbox>
              <span style="font-size: 10px;line-height: 35px;height: 15px;">我已阅读，并同意</span>
              <el-link style="font-size: 7px;height: 15px;margin-top: 10px;margin-left: 3px;" :underline="false">Admin
                须知条款
              </el-link>
            </div>
            <el-button type="primary" plain @click="log_in" style="margin-top: 15px;width: 230px;">登录</el-button>
            <el-link href="/register" style="position:relative;left:78%;top: 5px;width: 37px;">
              <span style="font-size: 10px;">注册</span>
              <el-icon size="13">
                <Right/>
              </el-icon>
            </el-link>
            <el-divider content-position="left">
              <el-icon size="15" style="color: deepskyblue;">
                <Key/>
              </el-icon>
            </el-divider>
            <div style="display:flex;justify-content: space-around;">
              <el-link>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="#50c8fd"
                        d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29 0 2.239.425 6.287.687 6.287 0 0-.688-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"
                        fill-rule="evenodd"></path>
                </svg>
              </el-link>
              <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
              <el-link>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="#60c84d"
                        d="M2.224 21.667s4.24-1.825 4.788-2.056C15.029 23.141 22 17.714 22 11.898 22 6.984 17.523 3 12 3S2 6.984 2 11.898c0 1.86.64 3.585 1.737 5.013-.274.833-1.513 4.756-1.513 4.756zm5.943-9.707c.69 0 1.25-.569 1.25-1.271a1.26 1.26 0 0 0-1.25-1.271c-.69 0-1.25.569-1.25 1.27 0 .703.56 1.272 1.25 1.272zm7.583 0c.69 0 1.25-.569 1.25-1.271a1.26 1.26 0 0 0-1.25-1.271c-.69 0-1.25.569-1.25 1.27 0 .703.56 1.272 1.25 1.272z"
                        fill-rule="evenodd"></path>
                </svg>
              </el-link>
              <el-divider direction="vertical" border-style="dashed" style="height: 30px;"/>
              <el-link>
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <path fill="#FB6622"
                        d="M15.518 3.06c8.834-.854 7.395 7.732 7.394 7.731-.625 1.439-1.673.309-1.673.309.596-7.519-5.692-6.329-5.692-6.329-.898-1.067-.029-1.711-.029-1.711zm4.131 6.985c-.661 1.01-1.377.126-1.376.126.205-3.179-2.396-2.598-2.396-2.598-.719-.765-.091-1.346-.091-1.346 4.882-.551 3.863 3.818 3.863 3.818zM5.317 7.519s4.615-3.86 6.443-1.328c0 0 .662 1.08-.111 2.797.003-.003 3.723-1.96 5.408.159 0 0 .848 1.095-.191 2.649 0 0 2.918-.099 2.918 2.715 0 2.811-4.104 6.44-9.315 6.44-5.214 0-8.026-2.092-8.596-3.102 0 0-3.475-4.495 3.444-10.33zm10.448 7.792s.232-4.411-5.71-4.207c-6.652.231-6.579 4.654-6.579 4.654.021.39.097 3.713 5.842 3.713 5.98 0 6.447-4.16 6.447-4.16zm-9.882.86s-.059-3.632 3.804-3.561c3.412.06 3.206 3.165 3.206 3.165s-.026 2.979-3.684 2.979c-3.288 0-3.326-2.583-3.326-2.583zm2.528 1.037c.672 0 1.212-.447 1.212-.998 0-.551-.543-.998-1.212-.998-.672 0-1.215.447-1.215.998 0 .551.546.998 1.215.998z"
                        fill-rule="evenodd"></path>
                </svg>
              </el-link>
            </div>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {Check, Key, Lock, Right, User} from "@element-plus/icons-vue"</script>

<script>
import axios from "axios";
import router from "../router/router";
import {ElNotification} from "element-plus";

export default {
  name: "login_F",
  created() {
    this.Code();
    this.getMustKnow();
  },
  data() {
    return {
      account: "",
      psd: "",
      code: "",
      haveCode: true,
      login_must_know: [],
      login: false,
      codeImage: '',
      agree: false,


    }
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else {
      sessionStorage.clear();
    }
    this.Login_adoptScreen();
    window.onresize = () => {
      this.Login_adoptScreen();
    }
  },
  methods: {
    whe_iphone() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    },
    Login_adoptScreen() {
      let allHei = document.documentElement.clientHeight;
      let headHei = document.getElementById("head").clientHeight;
      if (allHei >= (headHei + 330)) {
        let Hei = (allHei - (headHei + 330)) / 2;
        this.$refs.login_bod.style.top = Hei + "px";
      }
    },
    log_in() {
      this.login = true;
      let canSe = (this.account.indexOf('"') + this.account.indexOf("'") + this.account.indexOf('`') + this.psd.indexOf('"') + this.psd.indexOf("'") + this.psd.indexOf('`')) > -6;
      let times = setInterval(() => {
        if (!this.agree) {
          ElNotification({
            title: '提示',
            message: '请勾选服务条款!',
            type: 'info',
          })
        } else if (canSe) {
          ElNotification({
            title: '警告',
            message: '请规范输入!',
            type: 'warning',
          })
          this.Code();
        } else if (this.account === '' || this.psd === '') {
          ElNotification({
            title: '提示',
            message: '请输入完整的登录信息!',
            type: 'warning'
          })
          this.Code();
        } else {
          axios({
            url: '/lw/user/login',
            method: "post",
            params: {
              account: this.account,
              psd: this.psd,
              code: this.code
            },
          }).then((res) => {
            if (res.data.code === undefined) {
              if (res.data.msg) {
                let name = this.account;
                axios({
                  url: '/lw/superAdmin/wheCanUs',
                  method: 'post',
                  params: {
                    account: name,
                    psd: this.psd
                  }
                }).then((resA) => {//可以登录,再查看是否被超级管理员激活
                  if (resA.data.msg) {
                    if (resA.data.can) {
                      this.Code();
                      this.account = '';
                      this.psd = '';
                      this.code = '';
                      this.Code();
                      sessionStorage.setItem("admin", name);
                      router.push({
                        path: '/justtaCK'
                      })
                    } else {
                      this.Code();
                      sessionStorage.setItem("register_admin", name);
                      router.push({
                        path: '/wait'
                      })
                    }
                  } else {
                    ElNotification({
                      title: '警告',
                      message: '账号或密码输入不规范!',
                      type: 'error'
                    });
                    this.Code();
                  }
                });
              } else {
                ElNotification({
                  title: '错误',
                  message: '账号或密码错误!',
                  type: 'error',
                })
                this.Code();
              }
            } else if (res.data.code === "again") {
              ElNotification({
                title: '提示',
                message: '请重新获取验证码!',
                type: 'warning'
              })
            } else if (res.data.code === false) {
              ElNotification({
                title: '提示',
                message: '验证码错误!',
                type: 'warning'
              });
              this.Code();
            }
          }).catch(() => {
            ElNotification({
              title: '提示',
              message: '升级期间不可登陆!',
              type: 'info',
            })
          })
        }
        clearInterval(times);
        this.login = false;
      }, 1200)

    },
    Code() {
      this.haveCode = true;
      axios({
        url: '/lw/user/getAdminCode',
        method: 'post',
        responseType: "blob"
      }).then((res) => {
        this.codeImage = window.URL.createObjectURL(res.data);
      })
      this.haveCode = false;
    },
    getMustKnow() {
      axios.post('/lw/user/mustKnow').then((res) => {
        this.login_must_know = res.data;
      })
    },
    SuperAdmin_Login() {
      router.push({
        path: '/Terminal'
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