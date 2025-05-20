<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
const mode = useColorMode();
function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
}
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
        <USwitch
          unchecked-icon="i-lucide-sun-medium"
          checked-icon="i-lucide-moon"
          size="xl"
          :default-value="mode === 'dark'"
          @change="toggleMode"
        />
        <UButton icon="i-lucide-log-out" variant="outline" color="error" @click="() => {}" />
      </section>
    </section>

    <!-- Content -->
    <main class="row-span-11">
      <slot />
    </main>
  </section>
</template>