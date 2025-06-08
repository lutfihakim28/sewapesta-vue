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

  function go(delta: number) {
    return router.go(delta);
  }

  function replace<T extends keyof RouteNameParam | RouteName>(route: Route<T>) {
    return router.replace(route);
  }

  return {
    back,
    go,
    push,
    replace,
  }
}

