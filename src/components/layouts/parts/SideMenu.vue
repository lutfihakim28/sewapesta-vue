<script setup lang="ts">
import { ROUTE_NAMES, type RouteName } from '@/router/routes';
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const {
  collapsed = false,
} = defineProps<{
  collapsed?: boolean
}>()

const MENU_LABEL: {
  [key in RouteName]?: string
} = {
  Dashboard: 'Dashboard',
  Categories: 'Category',
  Items: 'Item',
}

const route = useRoute();

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: MENU_LABEL[ROUTE_NAMES.DASHBOARD],
      icon: 'i-lucide-layout-dashboard',
      active: route.name === ROUTE_NAMES.DASHBOARD,
      to: route.name === ROUTE_NAMES.DASHBOARD ? undefined : { name: ROUTE_NAMES.DASHBOARD }
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
      label: MENU_LABEL[ROUTE_NAMES.ITEMS],
      icon: 'i-lucide-box',
      active: route.name === ROUTE_NAMES.ITEMS,
      to: route.name === ROUTE_NAMES.ITEMS ? undefined : { name: ROUTE_NAMES.ITEMS }
    },
    {
      label: 'Package',
      icon: 'i-lucide-package'
    },
    {
      label: 'Equipment',
      icon: 'i-lucide-speaker'
    },
    {
      label: 'Inventory',
      icon: 'i-lucide-fork-knife'
    },
  ],
  [
    {
      label: 'Master Data',
      type: 'label'
    },
    {
      label: MENU_LABEL[ROUTE_NAMES.CATEGORIES],
      icon: 'i-lucide-shapes',
      active: route.name === ROUTE_NAMES.CATEGORIES,
      to: route.name === ROUTE_NAMES.CATEGORIES ? undefined : { name: ROUTE_NAMES.CATEGORIES }
    },
    {
      label: 'Unit',
      icon: 'i-lucide-ruler'
    },
    {
      label: 'Product',
      icon: 'i-lucide-boxes'
    }
  ],
  [
    {
      label: 'User Management',
      type: 'label'
    },
    {
      label: 'Admin',
      icon: 'i-lucide-users-round'
    },
    {
      label: 'Owner',
      icon: 'i-lucide-users-round'
    },
    {
      label: 'Employee',
      icon: 'i-lucide-users-round'
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
  MENU_LABEL,
})
</script>

<template>
  <UNavigationMenu variant="pill" highlight orientation="vertical" :collapsed="collapsed" :items="items" :ui="{
    root: 'row-span-11',
    link: 'py-4 hover:before:bg-primary-400/20 data-active:before:bg-primary-400/20',
    item: 'px-2'
  }" />
</template>
