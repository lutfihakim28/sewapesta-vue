import type { RouteRecordRaw } from 'vue-router';

export const desktopRoutes: readonly RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: { name: 'Login' },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/desktop/LoginView.vue')
      }
    ],
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/desktop/HomeView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/desktop/AboutView.vue'),
  },
];
