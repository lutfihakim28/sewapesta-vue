<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

const mode = useColorMode();

function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <USwitch
    unchecked-icon="i-lucide-sun-medium"
    checked-icon="i-lucide-moon"
    size="xl"
    :default-value="mode === 'dark'"
    @change="toggleMode"
  />
</template>