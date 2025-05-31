import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from "@nuxt/ui/vue-plugin"
import { PiniaColada } from '@pinia/colada'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})
app.use(i18n)
app.use(router)
app.use(PerfectScrollbarPlugin)
app.use(ui)

app.mount('#app')
