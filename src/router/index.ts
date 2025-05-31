import { useAuthStore } from '@/stores/auth';
import { useLastRouteStore } from '@/stores/last-route';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, _, next) => {
  const tokenStore = useAuthStore()

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

export default router



