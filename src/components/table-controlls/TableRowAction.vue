<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [],
  delete: [],
  detail: [],
}>()

const instance = getCurrentInstance()

function hasListener(eventName: string) {
  return instance?.vnode.props?.[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`] !== undefined
}

function onEdit() {
  emit('edit')
}

function onDelete() {
  emit('delete')
}

function onDetail() {
  emit('detail')
}
</script>

<template>
  <div class="flex gap-x-1 justify-center">
    <UButton
      icon="i-lucide-eye"
      variant="ghost"
      color="info"
      :disabled="loading"
      @click="onDetail"
    />
    <UButton
      icon="i-lucide-pencil"
      variant="ghost"
      color="warning"
      :disabled="loading"
      @click="onEdit"
    />
    <UButton
      icon="i-lucide-trash"
      variant="ghost"
      color="error"
      :disabled="loading"
      @click="onDelete"
    />
  </div>
</template>
