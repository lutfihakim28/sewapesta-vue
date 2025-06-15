<script setup lang="ts">
import { generatePageLabel, type PageLabel } from '@/helpers/generate-page-label';
import { ROUTE_NAMES } from '@/router/constants'
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const {
  collapsed = false,
} = defineProps<{
  collapsed?: boolean
}>()

const { t } = useI18n();

const menuLabel = computed<PageLabel>(() => {
  return generatePageLabel(t);
})

const route = useRoute();

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: menuLabel.value[ROUTE_NAMES.DASHBOARD],
      icon: 'i-lucide-layout-dashboard',
      active: route.name === ROUTE_NAMES.DASHBOARD,
      to: route.name === ROUTE_NAMES.DASHBOARD ? undefined : { name: ROUTE_NAMES.DASHBOARD },
    },
  ],
  [
    {
      label: 'Order & Schedule',
      type: 'label'
    },
  ],
  [
    {
      label: 'Item Management',
      type: 'label'
    },
    {
      label: menuLabel.value[ROUTE_NAMES.ITEM],
      icon: 'i-lucide-box',
      active: route.name === ROUTE_NAMES.ITEM,
      to: route.name === ROUTE_NAMES.ITEM ? undefined : { name: ROUTE_NAMES.ITEM },
    },
    {
      label: 'Equipment',
      icon: 'i-lucide-speaker'
    },
    {
      label: 'Inventory',
      icon: 'i-lucide-fork-knife'
    },
    {
      label: menuLabel.value[ROUTE_NAMES.PACKAGE],
      icon: 'i-lucide-package',
      active: route.name === ROUTE_NAMES.PACKAGE,
      to: route.name === ROUTE_NAMES.PACKAGE ? undefined : { name: ROUTE_NAMES.PACKAGE },
    },
  ],
  [
    {
      label: 'Master Data',
      type: 'label'
    },
    {
      label: menuLabel.value[ROUTE_NAMES.CATEGROY],
      icon: 'i-lucide-shapes',
      active: route.name === ROUTE_NAMES.CATEGROY,
      to: route.name === ROUTE_NAMES.CATEGROY ? undefined : { name: ROUTE_NAMES.CATEGROY },
    },
    {
      label: menuLabel.value[ROUTE_NAMES.UNIT],
      icon: 'i-lucide-ruler',
      active: route.name === ROUTE_NAMES.UNIT,
      to: route.name === ROUTE_NAMES.UNIT ? undefined : { name: ROUTE_NAMES.UNIT },
    },
    {
      label: menuLabel.value[ROUTE_NAMES.PRODUCT],
      icon: 'i-lucide-box',
      active: route.name === ROUTE_NAMES.PRODUCT,
      to: route.name === ROUTE_NAMES.PRODUCT ? undefined : { name: ROUTE_NAMES.PRODUCT },
    },
  ],
  [
    {
      label: 'User Management',
      type: 'label'
    },
    {
      label: menuLabel.value[ROUTE_NAMES.ADMIN],
      icon: 'i-lucide-users-round',
      active: route.name === ROUTE_NAMES.ADMIN,
      to: route.name === ROUTE_NAMES.ADMIN ? undefined : { name: ROUTE_NAMES.ADMIN },
    },
    {
      label: menuLabel.value[ROUTE_NAMES.OWNER],
      icon: 'i-lucide-users-round',
      active: route.name === ROUTE_NAMES.OWNER,
      to: route.name === ROUTE_NAMES.OWNER ? undefined : { name: ROUTE_NAMES.OWNER },
    },
    {
      label: menuLabel.value[ROUTE_NAMES.EMPLOYEE],
      icon: 'i-lucide-users-round',
      active: route.name === ROUTE_NAMES.EMPLOYEE,
      to: route.name === ROUTE_NAMES.EMPLOYEE ? undefined : { name: ROUTE_NAMES.EMPLOYEE },
    }
  ],
  [
    {
      label: 'Customer & Agent',
      type: 'label'
    },
    {
      label: 'Customer',
      icon: 'i-lucide-users-round'
    },
    {
      label: 'Agent',
      icon: 'i-lucide-users-round'
    },
  ],
  [
    {
      label: 'Finance',
      type: 'label'
    },
  ],
  [
    {
      label: 'Accounting',
      type: 'label'
    },
  ],
  [
    {
      label: 'Setting',
      type: 'label'
    },
  ],
]))

defineExpose({
  menuItems: items,
  MENU_LABEL: menuLabel,
})
</script>

<template>
  <UNavigationMenu
    variant="pill"
    highlight
    orientation="vertical"
    :collapsed="collapsed"
    :items="items"
    :ui="{
      root: 'row-span-11',
      link: 'py-4 hover:before:bg-primary-400/20 data-active:before:bg-primary-400/20',
      item: 'px-2'
    }"
  />
</template>
