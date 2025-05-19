import { routes as desktopRoutes } from './desktop-routes'
import { routes as tabletRoutes } from './tablet-routes'
import { routes as mobileRoutes } from './mobile-routes'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';


export default function router(screenSize: number) {
  let routes: readonly RouteRecordRaw[] = [];

  if (screenSize < 768) routes = mobileRoutes;
  if (screenSize >= 768) routes = tabletRoutes;
  if (screenSize >= 1024) routes = desktopRoutes;

  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
