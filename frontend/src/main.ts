import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { VueQueryPlugin, QueryClient} from '@tanstack/vue-query'
import ui from '@nuxt/ui/vue-plugin'
import { createHead } from '@vueuse/head'
import Toast  from 'vue-toastification'
import 'vue-toastification/dist/index.css';

const queryClient = new QueryClient()

const app = createApp(App)
const head = createHead();
app.use(head); // Only once!

app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(ui)
app.use(Toast, {position: 'top-right', timeout: 3000, toastClassName: 'custom-toast'})

app.mount('#app')
