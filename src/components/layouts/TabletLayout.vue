<script setup lang="ts">
</script>

<template>
  <section class="w-full p-4 h-dvh grid grid-rows-12 gap-4 transition-all">

    <!-- Header -->
    <section class="row-span-1 flex items-center justify-between bg-elevated/50 rounded-md px-4">
      <UDrawer direction="left">
        <UButton icon="i-lucide-menu" variant="outline" color="neutral" />

        <!-- Side Menu -->
        <template #content>
          <section class="w-64"></section>
        </template>
      </UDrawer>
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