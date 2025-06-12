<script setup lang="ts">
const emit = defineEmits<{
  click: [],
}>()

defineShortcuts({
  'meta_r': {
    handler: refreshData,
    usingInput: true,
  },
  'r': {
    handler: refreshData,
    usingInput: true,
  },
})

function refreshData() {
  emit('click')
}
</script>

<template>
  <UButton icon="i-lucide-refresh-cw" variant="ghost" color="warning" @click="refreshData" />
</template>