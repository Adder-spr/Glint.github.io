<template>
  <div>
    <div style="width: 92%;display:flex;justify-content: end;margin-top: 20px;">
      <img src="https://img.tukuppt.com/ad_preview/00/22/48/5c9a446acc798.jpg!/fw/980" alt="uni"
           style="width: 600px;height: 425px;"/>
    </div>
    <div style="width: 92%;margin-top: 50px;margin-left: 20px;">
      <img src="https://www.bobizs.com/uploads/allimg/200608/1-20060QS246.jpg" alt="uni"
           style="width: 600px;height: 395px;"/>
    </div>
    <div :class="{show:true,show_f:show0}" ref="show0_l" style="width: 92%;display:flex;justify-content: end;">
      <img src="https://pic.ntimg.cn/file/20200623/29652875_181128373035_2.jpg" alt="uni"
           style="width: 600px;height: 395px;"/>
    </div>
    <div :class="{show:true,show_f:show1}" ref="show1_l" style="width: 92%;margin-top: 50px;margin-left: 20px;">
      <img src="https://help.zhaobiao.cn/image/help/s_ydyrgkf.png" alt="uni" style="width: 600px;height: 395px;"/>
    </div>
    <div :class="{secound_f:true,secound:show2}" ref="show2_l"
         style="width: 92%;display:flex;justify-content: end;margin-top: 50px;">
      <img src="https://img.zcool.cn/community/01ac5f5d4aa7a5a8012187f4e57fe2.jpg@1280w_1l_2o_100sh.jpg" alt="uni"
           style="width: 650px;height: 395px;"/>
    </div>
    <div :class="{secound_f:true,secound:show3}" ref="show3_l" style="width: 92%;margin-top: 50px;margin-left: 20px;">
      <img src="https://img.zcool.cn/community/01f17e554300770000019ae9d63e2e.jpg@1280w_1l_2o_100sh.jpg" alt="uni"
           style="width: 650px;height: 395px;"/>
    </div>
    <div :class="{show:true,show_f:show4}" ref="show4_l"
         style="width: 92%;display:flex;justify-content: end;margin-top: 50px;">
      <img src="https://img.51miz.com/Photo/2017/06/18/14/P756487_b1b4e7fc58a3d4c7c449ef414d8c814e.jpg" alt="uni"
           style="width: 600px;height: 395px;"/>
    </div>
    <el-affix position="bottom" :offset="30">
      <el-button type="primary" style="position: relative;left: 30px;" @click="back">返回</el-button>
    </el-affix>
  </div>
</template>
<script>

import router from "@/router/router";
import {ElNotification} from "element-plus";

export default {
  name: "about_lw",
  data() {
    return {
      show0: true,
      show1: true,
      show2: true,
      show3: true,
      show4: true,

    }
  },
  mounted() {
    if (this.whe_iphone()) {
      router.replace({
        path: '/phone'
      })
    } else if (sessionStorage.getItem("admin") === null) {
      this.exit();
    } else {
      this.outTime();
      window.addEventListener('scroll', this.handleScroll);
    }

  },
  methods: {
    whe_iphone() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    },
    back() {
      router.back();
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
          this.exit();
          clearInterval(wheClear);
        }
        times++;
      }, 1000);
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

</style>