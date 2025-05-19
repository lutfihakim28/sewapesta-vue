import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from "@nuxt/ui/vue-plugin"

import App from './App.vue'
import router from './router'

const app = createApp(App)

const screenSize = document.body.getBoundingClientRect().width;

app.use(createPinia())
app.use(router(screenSize))
app.use(ui)

app.mount('#app')
