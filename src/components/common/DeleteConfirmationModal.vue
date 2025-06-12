<script setup lang="ts">
import { useI18n } from 'vue-i18n';


const { data, value } = defineProps<{
  data: string,
  value: string | number
}>()

const emit = defineEmits<{
  close: [result?: boolean]
}>()

defineShortcuts({
  'enter': {
    handler: confirm,
    usingInput: true,
  },
})

const { t } = useI18n()

function cancel() {
  emit('close')
}

function confirm() {
  emit('close', true)
}
</script>

<template>
  <UModal :close="{ onClick: cancel }" :title="t('Are-you-sure')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p>{{ t('delete-confirmation', { data, value }) }}</p>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton target="category-form" variant="solid" color="error" class="capitalize" @click="confirm">{{ t('confirm') }}</UButton>
    </template>
  </UModal>
</template>