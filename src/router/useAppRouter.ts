import { useRouter } from 'vue-router';
import type { Route, RouteName, RouteNameParam } from './constants';

export function useAppRouter() {
  const router = useRouter();

  function push<T extends keyof RouteNameParam | RouteName>(route: Route<T>) {
    return router.push(route);
  }

  function back() {
    return router.back();
  }

  function replace<T extends keyof RouteNameParam | RouteName>(route: Route<T>) {
    return router.replace(route);
  }

  return {
    push,
    back,
    replace,
  }
}

