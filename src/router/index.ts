import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes'
import breadcrumb, { RouteName } from '@/constants/breadcrumbs';
import { useBreadcrumStore } from '@/stores/breadcrumbStore';

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const breadcrumbs = to.name ? breadcrumb[to.name as RouteName] : [];
  const breadcrumbStore = useBreadcrumStore();
  breadcrumbStore.setBreadcrumbs(breadcrumbs)

  next();
})

export default router;