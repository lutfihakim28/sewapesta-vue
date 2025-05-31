import DesktopLayout from '@/components/layouts/DesktopLayout.vue';
import MobileLayout from '@/components/layouts/MobileLayout.vue';
import TabletLayout from '@/components/layouts/TabletLayout.vue';
import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

const views = import.meta.glob('/src/views/*/*.vue')

const screenSize = document.body.getBoundingClientRect().width;

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

export const DEFAULT_PATH = ''

export const ROUTE_NAMES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  CATEGORIES: 'Categories',
  ITEMS: 'Items',
  ITEM_CREATE: 'ItemCreate',
} as const

export type RouteName = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES]

export const routes: readonly RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: { name: ROUTE_NAMES.LOGIN },
    children: [
      {
        path: 'login',
        name: ROUTE_NAMES.LOGIN,
        component: importView(layoutType, 'LoginView')
      }
    ],
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: DEFAULT_PATH,
        name: ROUTE_NAMES.DASHBOARD,
        component: importView(layoutType, 'DashboardView'),
      },
      {
        path: 'categories',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.CATEGORIES,
            component: importView(layoutType, 'CategoryView'),
          }
        ],

      },
      {
        path: 'items',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.ITEMS,
            component: importView(layoutType, 'ItemView'),
          },
          {
            path: 'create',
            name: ROUTE_NAMES.ITEM_CREATE,
            component: importView(layoutType, 'ItemCreateView'),
          },
        ],
      },
    ],
    meta: {
      requiresAuth: true,
    }
  },
] as const

export const routesName = routes
  .flatMap((route) => route.name)
  .filter((name) => !!name)

function importView(layout: LayoutType, view: string) {
  const path = `/src/views/${layout}/${view}.vue`;
  const loader = views[path];
  if (!loader) {
    const underConstructionPath = `/src/views/${layout}/UnderConstructionView.vue`;
    const underConstructionLoader = views[underConstructionPath];
    return underConstructionLoader;
  }
  return loader;
}

type LayoutType = 'desktop' | 'tablet' | 'mobile';
