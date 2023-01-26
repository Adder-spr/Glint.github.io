<template>
  <div style="height: 100%;background: black;min-height: 150px;" v-loading="AdminLoginLead">
    <div style="color: aqua;width: 100%;text-align: center;padding-top: 20px;"> 欢迎您! SuperAdmin </div>
    <Terminal welcomeMessage="welcome to back !"  :prompt="lead" style="padding-left: 15px;padding-top: 15px;font-size: 18px;background: #000000;color: rgba(255,255,255,0.63);height: 85%;" />
  </div>

</template>

<script setup>
import Terminal from 'primevue/terminal';
</script>
<script>
import TerminalService from 'primevue/terminalservice';
import {all_login} from "@/router/For_Terminal_Admin";
export default {
  name: "SuperAdmin_Login",
  data(){
    return {
      lead:' user > ',
      AdminLoginLead: false,

    }
  },
  methods:{
    commandHandler: function (text) {
      let response;
      let argsIndex = text.indexOf(' ');
      let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;
      let AdminLo;

      switch (command) {
        case "user":
          response = 'welcome to back !';
          this.lead = ' user > ';
          break;
        case "admin":
          response = 'we need your detail information !';
          this.lead = ' admin > ';
          break;
        case "exit":
          this.lead = ' user > ';
          break;
        case "help/?":
          response = " login | cd | redirect | net | about | contribute | more ";
          break;
        case "login/?":
          response = "login [ user | admin | superAdmin ] xxx [ psd | password ] xxx";
          break
        default:
          if(this.lead === ' user > '){
            response = all_login(text.split(' '));
          }else if(this.lead === ' admin > '){
            this.AdminLoginLead = true;
            AdminLo = setInterval(() => {
              clearInterval(AdminLo);
              this.AdminLoginLead = false;
            }, 1000);
            response = all_login(text.split(' '))
          }

      }

      TerminalService.emit('response', response);
    }
  },
  mounted() {
    TerminalService.on('command', this.commandHandler);
  },
  beforeUnmount() {
    TerminalService.off('command', this.commandHandler);
  }
}
</script>

<style scoped>

</style>