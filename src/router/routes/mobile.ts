import type { RouteRecordRaw } from 'vue-router';
import { DEFAULT_PATH, ROUTE_NAMES } from '../constants';
import LoginPage from '@/pages/mobile/LoginPage.vue';
import MobileLayout from '@/components/layouts/MobileLayout.vue';
import DashboardPage from '@/pages/mobile/DashboardPage.vue';
import UnderConstructionPage from '@/pages/mobile/UnderConstructionPage.vue';

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: { name: ROUTE_NAMES.LOGIN },
    children: [
      {
        path: 'login',
        name: ROUTE_NAMES.LOGIN,
        component: LoginPage
      }
    ],
  },
  {
    path: '/',
    component: MobileLayout,
    children: [
      {
        path: DEFAULT_PATH,
        name: ROUTE_NAMES.DASHBOARD,
        component: DashboardPage,
      },
      {
        path: '/:pathMatch(.*)*',
        component: UnderConstructionPage
      }
    ],
    meta: {
      requiresAuth: true,
    }
  },
] as const

export default routes;
