<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';

const keyword = useRouteQuery<string | undefined>('keyword', undefined, { mode: 'push' })

const _keyword = ref<string>();

watchDebounced(_keyword, () => {
  if ((_keyword.value?.length || 0) === 0 || (_keyword.value?.length || 0) >= 3) {
    keyword.value = _keyword.value || undefined
  }
}, { debounce: 500 })
</script>

<template>
  <UInput v-model="_keyword" placeholder="Search..." icon="i-lucide-search" />
</template>