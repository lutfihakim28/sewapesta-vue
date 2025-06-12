<script setup lang="ts">
const emit = defineEmits(['click'])

const { postButtonLabel } = defineProps<{
  postButtonLabel: string
}>()

defineShortcuts({
  'n': {
    handler: addRecord,
    usingInput: true,
  },
})

function addRecord() {
  emit('click')
}
</script>

<template>
  <UButton :label="postButtonLabel" icon="i-lucide-plus" @click="addRecord" />
</template>