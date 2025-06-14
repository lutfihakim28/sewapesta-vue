import './assets/main.css'

import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import ui from "@nuxt/ui/vue-plugin"
import { PiniaColada } from '@pinia/colada'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

import App from './App.vue'
import { i18n } from './i18n/i18n'
import { initRouter } from './router/router'
import { useRouter } from 'vue-router'
import { apiFetch } from './plugins/api-fetch'

window.addEventListener('load', async () => {
  const appElement = document.createElement('div');
  appElement.classList.add('w-full', 'h-dvh')

  const app = createApp(App)

  const router = await initRouter()

  app.use(createPinia())
  app.use(PiniaColada, {})
  app.use(i18n)
  app.use(router)
  app.use(PerfectScrollbarPlugin)
  app.use(ui)
  app.use(apiFetch, { router })

  app.mount(appElement)

  await app.runWithContext(async () => {
    const router = useRouter();

    await Promise.all([
      nextTick(),
      router.isReady(),
    ]);

    document.body.appendChild(appElement);

    const splashScreenEl = document.getElementById('app-splash-screen');
    if (splashScreenEl instanceof HTMLElement) {
      splashScreenEl.classList.add('app-splash-screen-exit');
    }
  });
})

