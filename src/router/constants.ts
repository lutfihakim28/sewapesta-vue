import type { RouteLocationRaw } from 'vue-router'

export const DEFAULT_PATH = ''

export const ROUTE_NAMES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  CATEGROY: 'Category',
  ITEM: 'Item',
  ADMIN: 'Admin',
  OWNER: 'Owner',
  EMPLOYEE: 'Employee',
  UNIT: 'Unit',
  PRODUCT: 'Product',
  PACKAGE: 'Package',
} as const

export type RouteName = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES]

export type RouteNameParam = {
  Login: never;
  Dashboard: never;
  Category: never;
  Item: never;
  Admin: never;
  Owner: never;
  Employee: never;
  Unit: never;
  Product: never;
  Package: never;
}

export type RouteParams<T extends keyof RouteNameParam | RouteName> = RouteNameParam[T] extends never ? undefined : RouteNameParam[T]

export type Route<T extends keyof RouteNameParam | RouteName> = RouteLocationRaw & {
  name: T;
  params?: RouteParams<T>;
}

