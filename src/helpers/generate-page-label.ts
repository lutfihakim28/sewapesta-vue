import { ROUTE_NAMES, type RouteName } from '@/router/constants';

export type PageLabel = {
  [key in RouteName]?: string
}

/**
 * @description locales key in /src/locales/en.json and id.json must be equal to ROUTE_NAMES value for specific page
 */
export function generatePageLabel(t: (value: string) => string): PageLabel {
  return Object.values(ROUTE_NAMES).reduce((result, routeName) => {
    result[routeName] = t(routeName)
    return result;
  }, {} as PageLabel)
}
