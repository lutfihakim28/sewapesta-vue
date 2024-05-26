import { Breadcrumb } from '@/constants/breadcrumbs';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBreadcrumStore = defineStore('breadcrumb', () => {
  const breadcrumbs = ref<Breadcrumb[]>()

  function setBreadcrumbs(_breadcrumbs: Breadcrumb[]) {
    breadcrumbs.value = _breadcrumbs;
  }
  return { breadcrumbs, setBreadcrumbs }
})