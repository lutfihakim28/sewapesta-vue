import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const views = import.meta.glob('/src/views/*/*.vue')

export default function router(screenSize: number) {
  let layout: LayoutType = 'mobile';

  if (screenSize < 768) layout = 'mobile';
  if (screenSize >= 768) layout = 'tablet';
  if (screenSize >= 1024) layout = 'desktop';

  const _router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/auth',
        redirect: { name: 'Login' },
        children: [
          {
            path: 'login',
            name: 'Login',
            component: importView(layout, 'LoginView')
          }
        ],
      },
      {
        path: '/',
        redirect: { name: 'Home' },
        children: [
          {
            path: '',
            name: 'Home',
            component: importView(layout, 'HomeView'),
          },
          {
            path: 'about/:id',
            name: 'about',
            component: importView(layout, 'AboutView'),

          },
        ],
        meta: {
          requiresAuth: true,
        }
      },
    ],
  })

  _router.beforeEach((to, _, next) => {
    const tokenStore = useAuthStore()
    const lastRouteStore = useLastRouteStore();
    if (tokenStore.token && to.meta.requiresAuth) next()
    else if (!tokenStore.token && !to.meta.requiresAuth) next()
    else if (tokenStore.token && !to.meta.requiresAuth) {
      lastRouteStore.$reset();
      next({ name: 'Home' });
    }
    else if (!tokenStore.token && to.meta.requiresAuth) {
      lastRouteStore.setRoute(to);
      next({ name: 'Login' })
    }
    else next()
  })

  return _router
}


function importView(layout: LayoutType, view: string) {
  const path = `/src/views/${layout}/${view}.vue`;
  const loader = views[path];
  if (!loader) {
    throw new Error(`LoginView not found for layout: ${layout}`);
  }
  return loader;
}

type LayoutType = 'desktop' | 'tablet' | 'mobile';