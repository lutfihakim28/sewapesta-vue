import { defineStore } from 'pinia';
import { ref } from 'vue';
import { RouteRecordNameGeneric } from 'vue-router';

export const useRouteNameStore = defineStore('routeName', () => {
  const routeName = ref<RouteRecordNameGeneric>()

  function setRouteName(name: RouteRecordNameGeneric) {
    routeName.value = name;
  }

  return {
    routeName,
    setRouteName,
  }
})