<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

const mode = useColorMode();

const icon = computed(() => mode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun-medium')
const color = computed(() => mode.value === 'dark' ? 'primary' : 'warning')

function toggleMode() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <UButton variant="ghost" :ui="{ base: 'rounded-full' }" :icon="icon" :color="color" @click="toggleMode" />
</template>
