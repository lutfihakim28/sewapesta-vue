<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ref } from 'vue';

const keyword = useRouteQuery<string | undefined>('keyword', undefined )

const _keyword = ref<string>();

function clear() {
  _keyword.value = undefined;
}

watchDebounced(_keyword, () => {
  if ((_keyword.value?.length || 0) < 3) {
    keyword.value = undefined
  }
  if ((_keyword.value?.length || 0) === 0 || (_keyword.value?.length || 0) >= 3) {
    keyword.value = _keyword.value
  }
}, { debounce: 500 })
</script>

<template>
  <UInput v-model="_keyword" placeholder="Search..." icon="i-lucide-search">
    <template v-if="_keyword" #trailing>
      <UButton icon="i-lucide-x" variant="ghost" size="xs" color="neutral" @click.stop="clear" />
    </template>
  </UInput>
</template>
