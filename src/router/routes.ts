import { RouterOptions } from 'vue-router';

export const routes: RouterOptions["routes"] = [
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
    name: 'DashboardPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Dashboard',
      title: 'Beranda'
    }
  },
  {
    path: '/rentals',
    name: 'RentalPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Rentals',
      title: 'Daftar Sewa'
    }
  },
  {
    path: '/schedules',
    name: 'SchedulePage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Schedule',
      title: 'Jadwal'
    }
  },
  {
    path: '/employees',
    name: 'EmployeePage',
    component: () => import('@/pages/EmployeePage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Employee',
      title: 'Karyawan'
    }
  },
  {
    path: '/assets',
    name: 'AssetPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Asset',
      title: 'Aset'
    }
  },
  {
    path: '/vehicles',
    name: 'VehiclePage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Vehicle',
      title: 'Kendaraan'
    }
  },
  {
    path: '/asset-owners',
    name: 'AssetOwnerPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'AssetOwner',
      title: 'Kendaraan'
    }
  },
  {
    path: '/partners',
    name: 'PartnerPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Partner',
      title: 'Partner'
    }
  },
  {
    path: '/accounts',
    name: 'AccountPage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Account',
      title: 'Akun'
    }
  },
  {
    path: '/incomes',
    name: 'IncomePage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Income',
      title: 'Pemasukan'
    }
  },
  {
    path: '/expenses',
    name: 'ExpensePage',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      menuKey: 'Expense',
      title: 'Pengeluaran'
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
        component: () => import('@/pages/DashboardPage.vue'),
        meta: {
          requiresAuth: true,
          menuKey: 'SettingUserAdmin',
          title: 'Admin Pengguna'
        }
      },
      {
        path: 'income-ratios',
        name: 'SettingIncomeRatioPage',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: {
          requiresAuth: true,
          menuKey: 'SettingIncomeRatio',
          title: 'Pembagian Hasil'
        }
      },
    ],
  },
]