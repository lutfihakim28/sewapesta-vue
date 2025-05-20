<script setup lang="ts">
const isMenuCollapsed = ref(false);

function toggleMenu() {
  isMenuCollapsed.value = !isMenuCollapsed.value;
}
</script>

<template>
  <section :class="[
    'w-full p-4 h-dvh grid grid-rows-12 gap-4 transition-all',
    {
      'grid-cols-[4px_auto]': isMenuCollapsed,
      'grid-cols-[25%_auto] xl:grid-cols-[18%_auto]': !isMenuCollapsed,
    }
  ]">
    <!-- Side Menu -->
    <section class="row-span-12 rounded-md bg-elevated/50 ring ring-default"></section>

    <!-- Header -->
    <section class="row-span-1 flex items-center justify-between">
      <UButton icon="i-lucide-menu" variant="outline" color="neutral" @click="toggleMenu" />
      <section class="flex items-center gap-x-4">
        <ThemeSwitch />
        <LogoutButton />
      </section>
    </section>

    <!-- Content -->
    <main class="row-span-11">
      <slot />
    </main>
  </section>
</template>