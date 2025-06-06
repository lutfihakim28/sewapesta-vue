import type { RouteLocationAsRelativeGeneric, RouteLocationRaw } from 'vue-router'

export const DEFAULT_PATH = ''

export const ROUTE_NAMES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  CATEGORIES: 'Categories',
  ITEM: 'Item',
  ITEM_CREATE: 'ItemCreate',
  ADMIN: 'Admin',
} as const

export type RouteName = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES]

export type RouteNameParam = {
  Login: never;
  Dashboard: never;
  Categories: never;
  Item: never;
  ItemCreate: never;
  Admin: never;
}

export type RouteParams<T extends keyof RouteNameParam | RouteName> = RouteNameParam[T] extends never ? undefined : RouteNameParam[T]

export type Route<T extends keyof RouteNameParam | RouteName> = RouteLocationRaw & {
  name: T;
  params?: RouteParams<T>;
}

