<script setup lang="ts">
import { ref } from 'vue';

const isMenuCollapsed = ref(false);

function toggleMenu() {
  isMenuCollapsed.value = !isMenuCollapsed.value;
}
</script>

<template>
  <section :class="[
    'w-full p-4 h-dvh grid grid-rows-12 gap-4',
    {
      'grid-cols-[max-content_auto]': isMenuCollapsed,
      'grid-cols-[minmax(0,_min(25%,_240px))_auto] xl:grid-cols-[minmax(0,_min(18%,_320px))_auto]': !isMenuCollapsed,
    }
  ]">
    <!-- Side Menu -->
    <section class="row-span-12 rounded-md bg-elevated/50 ring ring-default grid grid-rows-subgrid overflow-y-auto overflow-x-hidden">
      <section class="flex items-center font-black text-2xl sticky top-0 bg-(--ui-bg) z-10 before:absolute before:inset-0 before:bg-elevated/50 before:-z-10 border-b border-b-primary-900/70">
        <div v-if="isMenuCollapsed" class="flex flex-col items-center w-full">
          <span class="text-primary-500">S</span>
          <span class="text-neutral-400">P</span>
        </div>
        <div v-else class="px-2.5 text-3xl">
          <span class="text-primary-500">Sewa</span>
          <span class="text-neutral-400">Pesta</span>
        </div>
      </section>
      <SideMenu :collapsed="isMenuCollapsed" />
    </section>

    <!-- Header -->
    <section class="row-span-1 flex items-center justify-between bg-elevated/50 rounded-md ring ring-default px-4">
      <UButton icon="i-lucide-menu" variant="outline" color="neutral" @click="toggleMenu" />
      <section class="flex items-center gap-x-4">
        <ThemeSwitch />
        <LogoutButton />
      </section>
    </section>

    <!-- Content -->
    <main class="row-span-11 rounded-md bg-elevated/50 ring ring-default [&>*]:h-full [&>*]:p-4 [&>*]:overflow-y-auto">
      <slot />
    </main>
  </section>
</template>