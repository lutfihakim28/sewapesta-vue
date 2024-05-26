<script setup lang="ts">
import { type Menu } from '@/constants/menus'
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';

defineProps<{
  menu: Menu
}>()

const route = useRoute();
</script>

<template>
  <RouterLink :to="menu.path!" class="p-4 rounded-e flex items-center gap-x-2 hover:bg-card dark:hover:bg-secondary"
    :class="{ 'bg-card dark:bg-secondary cursor-auto': route.meta.menuKey === menu.key }">
    <Icon :icon="menu.icon!" />
    <p>{{ menu.label }}</p>
  </RouterLink>
</template>