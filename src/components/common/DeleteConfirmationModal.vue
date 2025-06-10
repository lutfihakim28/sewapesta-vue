<script setup lang="ts">
import { useI18n } from 'vue-i18n';


const { data, value } = defineProps<{
  data: string,
  value: string | number
}>()

const emit = defineEmits<{
  close: [result?: boolean]
}>()

const { t } = useI18n()

function cancel() {
  emit('close')
}

function confirm() {
  emit('close', true)
}
</script>

<template>
  <UModal :close="{ onClick: cancel }" title="Are you sure?" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p>Are you sure want to delete {{ data }} "{{ value }}"</p>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton target="category-form" variant="solid" color="primary" class="capitalize" @click="confirm">{{ t('confirm') }}</UButton>
    </template>
  </UModal>
</template>