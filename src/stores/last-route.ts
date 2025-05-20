// State for managing last route before redirected to Login

import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

export const useLastRouteStore = defineStore('last-route', () => {
  const route = shallowRef<RouteLocationNormalizedLoadedGeneric>()

  function setRoute(_route: RouteLocationNormalizedLoadedGeneric) {
    route.value = _route;
  }

  return {
    route,
    setRoute,
  }
})