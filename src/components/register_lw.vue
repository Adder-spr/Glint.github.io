<template>
  <div>
    <el-steps :space="200" :active="step_num" simple :finish-status="finish_status">
      <el-step title="基本信息" :icon="User"/>
      <el-step title="实名认证" :icon="UserFilled"/>
      <el-step title="绑定邮箱" :icon="Message"/>
    </el-steps>
  </div>
  <div
      v-loading="check_info"
      element-loading-text="加载中. . . "
  >
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ step_info[step_num] }}</span>
          <div style="width: 30%;justify-content: space-around;">
            <el-button class="button" @click="back" text :disabled="back_st">上一步</el-button>
            <el-button class="button" @click="next" text>{{ next_st }}</el-button>
          </div>
        </div>
      </template>
      <div v-if="this.step_num === 0">
        <el-tooltip
            class="box-item"
            effect="dark"
            content="账号由 3-10 位非特殊字符组成！"
            placement="top-end"
        >
          <el-input
              v-model="register_name"
              :prefix-icon="Avatar"
              maxlength="10"
              show-word-limit
              placeholder="账号"
              :formatter="(user_name) => `${user_name}`"
              :parser="(user_name) => user_name.replace(check_name, '')"
          ></el-input>
        </el-tooltip>
        <h6></h6>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="密码由 6-18 位数字、大小写字母组成！"
            placement="top-end"
        >
          <el-input
              v-model="register_psd"
              :prefix-icon="Lock"
              maxlength="18"
              show-password
              type="password"
              placeholder="密码"
              :formatter="(user_psd) => `${user_psd}`"
              :parser="(user_psd) => user_psd.replace(check_psd, '')"
          ></el-input>
        </el-tooltip>
        <h6></h6>
        <div style="justify-content: space-around;">
          <el-date-picker
              v-model="birthday"
              type="date"
              placeholder="出生日期"
              :disabled-date="disabledDate"
              size="default"
              style="width: 42%;"
          />
          <el-cascader
              v-model="location_value"
              :options="options"
              :props="props"
              placeholder="现居住地"
              style="width: 42%;margin-left: 16%;"
          />
        </div>
      </div>
      <div v-if="this.step_num === 1">
        <el-upload
            class="upload-demo"
            drag
            action="/lw/user/uploadIDCard"
            multiple
            :show-file-list="false"
            :on-error="upload_ID_CardErr"
            :on-success="upload_ID_CardSuc"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将证件照拖放到此处 或 <em>单击以上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip" style="display:flex;justify-content: space-around;">
              <span style="margin-top: 15px;">上传身份证 正、反面 ,每次不得大于 10 MB</span>
              <el-button :disabled="NotLookFile" style="margin-top: 10px;" @click="wheShowCard">
                剩余 {{ look_IDCard_safeTime }} 秒查看时间
              </el-button>
            </div>
          </template>
        </el-upload>
        <el-scrollbar height="200px" v-show="this.upload_file.length > 0">
          <div style="height: 200px;line-height: 200px;width: 100%;text-align:center;" v-show="!wheShow_fileInfo">
            展示区
          </div>
          <el-button @click="this.wheShow_fileInfo = false" v-show="wheShow_fileInfo">收起</el-button>
          <el-card class="box-card" v-for="(s,i) in upload_file" style="margin-top: 10px;" :key="i"
                   v-show="wheShow_fileInfo">
            <div style="height: 20px;line-height: 20px;">{{ s }}</div>
          </el-card>
        </el-scrollbar>
      </div>
      <div v-if="this.step_num === 2">
        <div class="mt-4">
          <el-input
              v-model="email_body"
              placeholder="Please input email"
              class="input-with-select"
              :formatter="(Email) => `${Email}`"
              :parser="(Email) => Email.replace(check_Email, '')"
          >
            <template #append>
              <el-select v-model="email_suffix" placeholder="@xxx.xxx" style="width: 115px;">
                <el-option label="@qq.com" value="@qq.com"/>
                <el-option label="@outlook.com" value="@outlook.com"/>
                <el-option label="@other" value="@other"/>
              </el-select>
            </template>
          </el-input>
        </div>
        <el-button type="primary" :loading-icon="Eleme" :loading="email_whe_loading" style="margin-top: 15px;"
                   :disabled="email_check_again"
                   @click="checkEmail">{{ email_btn_checkInfo }}
        </el-button>
        <el-input
            placeholder="请输入邮箱验证码"
            v-model="email_input_code"
            style="margin-top: 5px;"
        ></el-input>

      </div>
    </el-card>
  </div>
</template>
<script setup>
import {Avatar, Eleme, Lock, Message, UploadFilled, User, UserFilled} from '@element-plus/icons-vue';</script>
<script>
import {ElNotification} from "element-plus";
import region from "@/router/region";
import axios from "axios";
import router from "@/router/router";

export default {
  name: "register_lw",
  data() {
    return {
      step_info: [
        "基本信息",
        "实名认证",
        "绑定邮箱",
        "注册成功"
      ],
      step_num: 0,
      finish_status: "process",
      check_info: false,//是否展示加载中的动画
      register_name: '',
      register_psd: '',
      next_st: '下一步',
      back_st: true,//是否禁止上一步按钮
      check_name: /[\s'"~#$^()_\-+=\\{}:<>?/`*%|;&!@,.“”‘’；：。，？！·、【】￥（）]|(——)|(……)/g,//禁止输入特殊符号
      check_psd: /[\s'"~#$^()_\-+=\\{}:<>?/`*%|;&!@,.“”‘’；：。，？！·、【】￥（）]|[\u4e00-\u9fa5]|(——)|(……)/g,//禁止输入某些特殊字符
      check_Email: /[\s'"~#$^()_\-+=\\{}:<>?/`*%|;&!@,.“”‘’；：。，？！·、【】￥（）]|[\u4e00-\u9fa5]|(——)|(……)/g,//禁止输入特殊字符和汉字
      check_psd_OK: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z]{6,}/g,//先行断言,正则表达式,判断密码包含a-z,A-Z,0-9且至少六位
      location_value: [],
      props: {
        expandTrigger: 'hover',
      },
      options: region,
      birthday: '',
      NotLookFile: true,
      upload_file: [],
      look_IDCard_safeTime: 45,
      wheShow_fileInfo: false,
      safeLookTime_Again: 0,
      email_body: '',
      email_suffix: '',
      email_btn_checkInfo: '获取验证码',
      email_code: '',
      email_code_status: 1,
      email_input_code: '',
      email_check_again: false,
      email_whe_loading: false,


    }
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    }
  },
  methods: {
    whe_iphone() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    wheShowCard() {
      if (!this.NotLookFile) {
        this.wheShow_fileInfo = true;
      }
    },
    checkEmail() {
      if (this.email_body === '') {
        ElNotification({
          title: '提示',
          message: '请输入邮箱!',
          type: 'info'
        })
      } else if (this.email_suffix === '') {
        ElNotification({
          title: '提示',
          message: '请选择邮箱后缀!',
          type: 'info'
        })
      } else {
        this.email_whe_loading = true;
        let sendCode_to_user = setInterval(() => {
          axios({
            url: '/checkEmail/check/Email',
            method: 'post',
            params: {
              email: this.email_body + this.email_suffix,
            }
          }).then((res) => {
            if (res.data.have) {
              axios({
                url: '/checkEmail/check/newCode',
                method: 'post',
                params: {
                  needEmail: this.email_body + this.email_suffix,
                }
              }).then((res) => {
                if (res.data.whe) {
                  this.email_code = res.data.msg;
                  ElNotification({
                    title: '提示',
                    message: '验证码一分钟内有效!',
                    type: 'info'
                  })
                  this.email_code_status = 1;//每次最开始有效
                  let email_check_again_time = 60;//再次获取验证码需等待60秒
                  let needCodeAgain_time = setInterval(() => {
                    if (email_check_again_time === 60) {//进入倒计时前才将其修改样式,放在外面会有延迟一秒
                      this.email_check_again = true;
                      this.email_whe_loading = false;
                    }
                    this.email_btn_checkInfo = email_check_again_time + 's 后重新获取';
                    if (email_check_again_time === 0) {
                      this.email_check_again = false;
                      this.email_code_status = 0;//此验证码无效了
                      this.email_btn_checkInfo = "获取验证码";
                      clearInterval(needCodeAgain_time)
                    }
                    email_check_again_time--;
                  }, 1000)
                } else {
                  ElNotification({
                    title: '错误',
                    message: '验证码获取失败!',
                    type: 'warning'
                  })
                  this.email_whe_loading = false;
                }
              }).catch(() => {
                ElNotification({
                  title: '错误',
                  message: '验证码获取失败!',
                  type: 'warning'
                })
                this.email_whe_loading = false;
              })
            } else {
              ElNotification({
                title: '错误',
                message: '无效的邮箱!',
                type: 'error'
              })
              this.email_whe_loading = false;
            }
          }).catch(() => {
            ElNotification({
              title: '异常',
              message: '验证码获取异常!',
              type: 'error'
            })
            this.email_whe_loading = false;
          });
          clearInterval(sendCode_to_user)
        }, 1500);

      }

    },
    disabledDate(Data) {
      let now = new Date();
      return Data > now;
    },
    upload_ID_CardErr() {
      ElNotification({
        title: '失败!',
        message: '上传异常!',
        type: 'error'
      })
      this.upload_file = [];
    },
    upload_ID_CardSuc(e, f) {
      if (e.result) {
        ElNotification({
          title: '成功!',
          message: f.name.split('.')[0] + '上传成功!',
          type: 'success'
        });
        this.upload_file.push(f.name.split('.')[0]);//为之后查看上传的图片做准备
        this.NotLookFile = false;
        if (this.upload_file.length > 1) {//之后每次上传,修改可查看时间,清除上一个定时器
          this.look_IDCard_safeTime = 45;
          clearInterval(this.safeLookTime_Again);
        }
        this.safeLookTime_Again = setInterval(() => {
          if (this.look_IDCard_safeTime > 0) {
            this.look_IDCard_safeTime--;
          } else {
            this.wheShow_fileInfo = false;//时间到,不可查看内容
            this.NotLookFile = true;
            this.look_IDCard_safeTime = 45;//时间结束返回原来的时间
            clearInterval(this.safeLookTime_Again);
          }
        }, 1000);

      } else if (e.size === "err") {
        ElNotification({
          title: '提示',
          message: f.name.split('.')[0] + '文件大小不符合!',
          type: 'warning'
        })
        this.upload_file = [];
      } else {
        ElNotification({
          title: '失败',
          message: f.name.split('.')[0] + '上传失败!',
          type: 'error'
        })
        this.upload_file = [];
      }

    },
    next() {
      this.step_num++;
      if (this.step_num === 1) {
        this.finish_status = 'process';
        this.back_st = false;
      } else if (this.step_num === 2) {
        this.finish_status = 'process';
        this.next_st = '注册';
        this.back_st = false;
      } else if (this.step_num === 3) {
        this.register();
      }
    },
    back() {
      if (this.step_num === 1) {
        this.finish_status = 'process';
        this.step_num = 1;
        this.step_num--;
        this.back_st = true;
        this.next_st = '下一步';
      } else if (this.step_num === 2) {
        this.finish_status = 'process';
        this.next_st = '下一步';
        this.step_num--;
        this.back_st = false;
      }
    },
    register() {
      if (this.register_name === '') {//账号为空
        ElNotification({
          title: '警告',
          message: '账号为空！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.register_name.length < 3) {//账号昵称长度不够
        ElNotification({
          title: '警告',
          message: '账号至少3位！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.register_psd === '') {//密码为空
        ElNotification({
          title: '警告',
          message: '密码为空！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.register_psd.length < 6 || !(this.check_psd_OK.test(this.register_psd))) {//密码长度不够
        ElNotification({
          title: '警告',
          message: '密码至少6位，且至少包含数字，大小写字母！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.birthday === '') {//生日为空
        ElNotification({
          title: '警告',
          message: '生日为空！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.location_value[0] === undefined) {//居住地为空
        ElNotification({
          title: '警告',
          message: '居住地为空！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.upload_file.length < 2) {
        ElNotification({
          title: '警告',
          message: '请上传身份证正、反面！',
          type: 'warning'
        })
        this.step_num--;
      } else if (this.email_body === '' || this.email_suffix === '') {
        ElNotification({
          title: '警告',
          message: '邮箱为空！',
          type: 'warning'
        })
        this.step_num--;
      } else {//直接判断验证码是否正确,正确则注册,不正确则返回
        if (this.email_code === '' && this.email_code_status === 1) {
          ElNotification({
            title: '提示',
            message: '未获取验证码！',
            type: 'info'
          })
          this.step_num--;
        } else if (this.email_input_code === '') {
          ElNotification({
            title: '提示',
            message: '请输入验证码！',
            type: 'info'
          })
          this.step_num--;
        } else if (this.email_code === this.email_input_code) {
          if (this.email_code_status === 0) {
            ElNotification({
              title: '提示',
              message: '此验证码已过期,请重新获取！',
              type: 'info'
            })
            this.step_num--;
          } else {
            let birthday_data = new Date(this.birthday);
            let birthday_Month = (birthday_data.getMonth() + 1) > 9 ? (birthday_data.getMonth() + 1) : "0" + (birthday_data.getMonth() + 1);
            let birthday_Day = birthday_data.getDay() > 9 ? birthday_data.getDay() : "0" + birthday_data.getDay();
            let birthday_format = birthday_data.getFullYear() + "-" + birthday_Month + "-" + birthday_Day;
            let location = "";
            for (let v in this.location_value) {
              location += (this.location_value[v] + ":");
            }
            axios({
              url: '/lw/gst/regmsrk',
              method: 'post',
              params: {
                account: this.register_name,
                psd: this.register_psd,
                birthday: birthday_format,
                location: location.substring(0, location.length - 1),
                email: this.email_body + this.email_suffix,
              }
            }).then((res) => {
              if (res.data.err) {
                ElNotification({
                  title: '异常',
                  message: '违规操作,再次操作将会封机!',
                  type: 'error'
                })
                this.step_num--;
              } else if (res.data.have) {
                ElNotification({
                  title: '提示',
                  message: '名称已有小伙伴用了哟!',
                  type: 'info'
                })
                this.step_num--;
              } else if (res.data.msr) {
                this.finish_status = 'finish';
                ElNotification({
                  title: '成功',
                  message: '恭喜你！注册成功！即将跳转...',
                  type: 'success'
                })
                this.back_st = true;//已经提交,不可返回上一步
                this.check_info = true;//点击注册后显示加载中
                let time = setInterval(() => {
                  this.check_info = false;//去除加载
                  this.step_num = 0;//返回原来的样式
                  this.next_st = '下一步';
                  this.register_name = '';
                  this.register_psd = '';
                  this.birthday = '';
                  this.location_value = '';
                  this.email_body = '';
                  this.email_suffix = '';
                  this.email_code = '';
                  this.email_input_code = '';
                  router.back()
                  clearInterval(time)
                }, 3000);
              } else {
                ElNotification({
                  title: '错误',
                  message: '注册失败!',
                  type: 'warning'
                })
                this.step_num--;
              }
            }).catch(() => {
              ElNotification({
                title: '提示',
                message: '服务器异常!',
                type: 'info'
              })
              this.step_num--;
            })
          }
        } else {
          ElNotification({
            title: '警告',
            message: '验证码错误！',
            type: 'warning'
          })
          this.step_num--;
        }
      }
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  background: #acb7ce;
}
</style>