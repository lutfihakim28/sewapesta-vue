<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const keyword = useRouteQuery<string | undefined>('keyword', undefined)
const { t } = useI18n()

defineShortcuts({
  'meta_k': {
    handler: () => {
      if (searchInput.value) {
        searchInput.value.inputRef?.focus()
      }
    },
    usingInput: true
  },
})

const _keyword = ref<string | undefined>(keyword.value);
const searchInput = useTemplateRef('search-input')

function clear() {
  _keyword.value = undefined;
}

watchDebounced(_keyword, () => {
  if ((_keyword.value?.length || 0) < 3) {
    keyword.value = undefined
  }
  if ((_keyword.value?.length || 0) >= 3) {
    keyword.value = _keyword.value
  }
}, { debounce: 500 })
</script>

<template>
  <UInput
    ref="search-input"
    v-model="_keyword"
    :placeholder="`${t('Search')}...`"
    icon="i-lucide-search"
  >
    <template #trailing>
      <UButton
        v-if="_keyword"
        icon="i-lucide-x"
        variant="ghost"
        size="xs"
        color="neutral"
        @click.stop="clear"
      />
      <UKbd
        v-else
        value="Ctrl K"
        class="pointer-events-none"
      />
    </template>
  </UInput>
</template>
