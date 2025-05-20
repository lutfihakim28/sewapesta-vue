import DesktopLayout from '@/components/layouts/DesktopLayout.vue';
import MobileLayout from '@/components/layouts/MobileLayout.vue';
import TabletLayout from '@/components/layouts/TabletLayout.vue';
import { useAuthStore } from '@/stores/auth';
import type { Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const views = import.meta.glob('/src/views/*/*.vue')

export default function router(screenSize: number) {
  let layoutType: LayoutType = 'mobile';
  let layout: Component = MobileLayout;

  if (screenSize < 768) {
    layoutType = 'mobile'
    layout = MobileLayout;
  };
  if (screenSize >= 768) {
    layoutType = 'tablet'
    layout = TabletLayout;
  };
  if (screenSize >= 1024) {
    layoutType = 'desktop'
    layout = DesktopLayout;
  };

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
            component: importView(layoutType, 'LoginView')
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
            component: importView(layoutType, 'HomeView'),
          },
          {
            path: 'about/:id',
            name: 'about',
            component: importView(layoutType, 'AboutView'),

          },
        ],
        meta: {
          requiresAuth: true,
          layout,
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