<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const {
  collapsed = false,
} = defineProps<{
  collapsed?: boolean
}>()

const route = useRoute();

const items = computed<NavigationMenuItem[][]>(() => ([
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      active: route.name === 'Dashboard',
      to: { name: 'Dashboard' }
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
      label: 'Item',
      icon: 'i-lucide-box',
      active: route.name === 'Item',
      to: { name: 'Item' }
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
      label: 'Category',
      icon: 'i-lucide-shapes',
      active: route.name === 'Category',
      to: { name: 'Category' }
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

</script>

<template>
  <UNavigationMenu variant="pill" highlight orientation="vertical" :collapsed="collapsed" :items="items" :ui="{
    root: 'row-span-11',
    link: 'py-4 hover:before:bg-primary-400/20 data-active:before:bg-primary-400/20',
    item: 'px-2'
  }" />
</template>