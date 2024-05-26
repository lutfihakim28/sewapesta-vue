<script setup lang="ts">
import menus from '@/constants/menus'
import SideMenuItem from './SideMenuItem.vue';
</script>

<template>
  <section class="flex flex-col gap-y-6">
    <section v-for="menu in menus" :key="menu.key">
      <section v-if="menu.children" class="flex flex-col">
        <p class="px-4 text-xs font-semibold text-foreground/60 mb-1">{{ menu.label }}</p>
        <SideMenuItem v-for="child in menu.children" :key="child.key" :menu="child" />
      </section>
      <SideMenuItem v-else :menu="menu" />
    </section>
  </section>
</template>