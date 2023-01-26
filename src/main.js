import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import * as icon from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(icon)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(VueAxios,axios)
app.mount('#app')