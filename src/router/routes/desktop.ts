import type { RouteRecordRaw } from 'vue-router';
import { DEFAULT_PATH, ROUTE_NAMES } from '../constants';
import LoginPage from '@/pages/desktop/LoginPage.vue';
import DesktopLayout from '@/components/layouts/DesktopLayout.vue';
import DashboardPage from '@/pages/desktop/DashboardPage.vue';
import CategoryPage from '@/pages/desktop/CategoryPage.vue';
import UnitPage from '@/pages/desktop/UnitPage.vue';
import ProductPage from '@/pages/desktop/ProductPage.vue';
import ItemPage from '@/pages/desktop/ItemPage.vue';
import ItemCreatePage from '@/pages/desktop/ItemCreatePage.vue';
import PackagePage from '@/pages/desktop/PackagePage.vue';
import AdminPage from '@/pages/desktop/AdminPage.vue';
import OwnerPage from '@/pages/desktop/OwnerPage.vue';
import EmployeePage from '@/pages/desktop/EmployeePage.vue';

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
    component: DesktopLayout,
    children: [
      {
        path: DEFAULT_PATH,
        name: ROUTE_NAMES.DASHBOARD,
        component: DashboardPage,
      },
      {
        path: 'categories',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.CATEGROY,
            component: CategoryPage,
          }
        ],
      },
      {
        path: 'units',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.UNIT,
            component: UnitPage,
          }
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.PRODUCT,
            component: ProductPage,
          }
        ],
      },
      {
        path: 'items',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.ITEM,
            component: ItemPage,
          },
          {
            path: 'create',
            name: ROUTE_NAMES.ITEM_CREATE,
            component: ItemCreatePage,
          },
        ],
      },
      {
        path: 'packages',
        children: [
          {
            path: DEFAULT_PATH,
            name: ROUTE_NAMES.PACKAGE,
            component: PackagePage,
          },
        ],
      },
      {
        path: 'admins',
        name: ROUTE_NAMES.ADMIN,
        component: AdminPage,
      },
      {
        path: 'owners',
        name: ROUTE_NAMES.OWNER,
        component: OwnerPage,
      },
      {
        path: 'employees',
        name: ROUTE_NAMES.EMPLOYEE,
        component: EmployeePage,
      },
    ],
    meta: {
      requiresAuth: true,
    }
  },
] as const

export default routes;
