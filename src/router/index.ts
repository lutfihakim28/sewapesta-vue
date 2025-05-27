import DesktopLayout from '@/components/layouts/DesktopLayout.vue';
import MobileLayout from '@/components/layouts/MobileLayout.vue';
import TabletLayout from '@/components/layouts/TabletLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { useLastRouteStore } from '@/stores/last-route';
import type { Component } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const views = import.meta.glob('/src/views/*/*.vue')

function router(screenSize: number) {
  let layoutType: LayoutType = 'mobile';
  let Layout: Component = MobileLayout;

  if (screenSize < 768) {
    layoutType = 'mobile'
    Layout = MobileLayout;
  };
  if (screenSize >= 768) {
    layoutType = 'tablet'
    Layout = TabletLayout;
  };
  if (screenSize >= 1024) {
    layoutType = 'desktop'
    Layout = DesktopLayout;
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
        redirect: { name: 'Dashboard' },
        component: Layout,
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: importView(layoutType, 'DashboardView'),
          },
          {
            path: 'categories',
            name: 'Category',
            component: importView(layoutType, 'CategoryView'),

          },
          {
            path: 'items',
            name: 'Item',
            component: importView(layoutType, 'ItemView'),

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

    if (tokenStore.token && to.meta.requiresAuth) next()
    else if (!tokenStore.token && !to.meta.requiresAuth) next()
    else if (tokenStore.token && !to.meta.requiresAuth) next({ name: 'Dashboard' })
    else if (!tokenStore.token && to.meta.requiresAuth) next({ name: 'Login' })
    else next()
  })

  _router.afterEach((to, from) => {
    const lastRouteStore = useLastRouteStore();

    if (to.name === 'Login' && from.meta.requiresAuth) {
      lastRouteStore.setRoute(from)
    }

    if (to.meta.requiresAuth && from.name === 'Login') {
      lastRouteStore.reset()
    }
  })

  return _router
}

export default router(document.body.getBoundingClientRect().width)


function importView(layout: LayoutType, view: string) {
  const path = `/src/views/${layout}/${view}.vue`;
  const loader = views[path];
  if (!loader) {
    throw new Error(`${view} not found for layout: ${layout}`);
  }
  return loader;
}

type LayoutType = 'desktop' | 'tablet' | 'mobile';
