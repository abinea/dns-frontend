import App from './App.vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import '@/style/index.less'
import { router } from './router'
import './router/permission'
import svgIcon from './components/svg-icon.vue'
import 'virtual:svg-icons-register'

const app = createApp(App)

app
  .use(TDesign)
  .use(router)
  .use(createPinia())
  .component('svg-icon', svgIcon)
  .mount('#app')
