import { createRouter, createWebHistory } from 'vue-router';
import { RouteName, breadcrumb } from './constants/breadcrumbs';
import { useBreadcrumStore } from './stores/breadcrumbStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/',
      name: 'HomePage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Home'
      }
    },
    {
      path: '/orders',
      name: 'OrderPage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Order',
      }
    },
    {
      path: '/schedules',
      name: 'SchedulePage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Schedule',
      }
    },
    {
      path: '/employees',
      name: 'EmployeePage',
      component: () => import('@/pages/EmployeePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Employee',
      }
    },
    {
      path: '/assets',
      name: 'AssetPage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Asset',
      }
    },
    {
      path: '/vehicles',
      name: 'VehiclePage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Vehicle',
      }
    },
    {
      path: '/asset-owners',
      name: 'AssetOwnerPage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'AssetOwner',
      }
    },
    {
      path: '/accounts',
      name: 'AccountPage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Account',
      }
    },
    {
      path: '/incomes',
      name: 'IncomePage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Income',
      }
    },
    {
      path: '/expenses',
      name: 'ExpensePage',
      component: () => import('@/pages/HomePage.vue'),
      meta: {
        requiresAuth: true,
        menuKey: 'Expense',
      }
    },
    {
      path: '/settings',
      name: 'SettingPage',
      redirect: { name: 'SettingUserAdminPage' },
      children: [
        {
          path: 'user-admins',
          name: 'SettingUserAdminPage',
          component: () => import('@/pages/HomePage.vue'),
          meta: {
            requiresAuth: true,
            menuKey: 'SettingUserAdmin',
          }
        },
        {
          path: 'income-ratios',
          name: 'SettingIncomeRatioPage',
          component: () => import('@/pages/HomePage.vue'),
          meta: {
            requiresAuth: true,
            menuKey: 'SettingIncomeRatio',
          }
        },
      ],
    },
  ],
})

router.beforeEach((to, _, next) => {
  const breadcrumbs = to.name ? breadcrumb[to.name as RouteName] : [];
  const breadcrumbStore = useBreadcrumStore();
  breadcrumbStore.setBreadcrumbs(breadcrumbs)

  const token = localStorage.getItem('sewapesta-token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'LoginPage' });
  }

  next();
})

export default router