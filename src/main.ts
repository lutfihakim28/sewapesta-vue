import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from "@nuxt/ui/vue-plugin"
import { PiniaColada } from '@pinia/colada'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

const screenSize = document.body.getBoundingClientRect().width;

app.use(createPinia())
app.use(PiniaColada, {})
app.use(router(screenSize))
app.use(PerfectScrollbarPlugin)
app.use(ui)

app.mount('#app')
