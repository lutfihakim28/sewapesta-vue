import { useAuthStore } from '@/stores/useAuthStore';
import { useLastRouteStore } from '@/stores/useLastRouteStore';
import { createRouter, createWebHistory } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { STORAGE_LOCALE_KEY } from '@/constants/locales';
import { i18n, loadLocaleMessages } from '@/i18n';
import { importRoutes } from './routes/routes';

const screenSize = document.body.getBoundingClientRect().width;

let layoutType: LayoutType = 'desktop';

if (screenSize < 768) {
  layoutType = 'mobile'
};
if (screenSize >= 768) {
  layoutType = 'tablet'
};
if (screenSize >= 1024) {
  layoutType = 'desktop'
};

export async function initRouter() {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: await importRoutes(layoutType),
  })

  router.beforeEach(async (to, _, next) => {
    const tokenStore = useAuthStore()
    const storageLocale = useStorage(STORAGE_LOCALE_KEY, 'en')

    await loadLocaleMessages(i18n, storageLocale.value)

    if (tokenStore.token && to.meta.requiresAuth) next()
    else if (!tokenStore.token && !to.meta.requiresAuth) next()
    else if (tokenStore.token && !to.meta.requiresAuth) next({ name: 'Dashboard' })
    else if (!tokenStore.token && to.meta.requiresAuth) next({ name: 'Login' })
    else next()
  })

  router.afterEach((to, from) => {
    const lastRouteStore = useLastRouteStore();

    if (to.name === 'Login' && from.meta.requiresAuth) {
      lastRouteStore.setRoute(from)
    }

    if (to.meta.requiresAuth && from.name === 'Login') {
      lastRouteStore.reset()
    }
  })

  return router;
}

type LayoutType = 'desktop' | 'tablet' | 'mobile';



