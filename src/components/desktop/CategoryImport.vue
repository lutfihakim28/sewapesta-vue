<script setup lang="ts">
import { Category } from '@/dto/Category';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';


const emit = defineEmits<{
  close: [result?: Category]
}>()

const { t, locale } = useI18n()


function cancel() {
  emit('close')
}

async function submit() {
  // if (isExist.value) {
  //   emit('close')
  //   return;
  // }
  // if (categoryRequest.name) {
  //   emit('close', new Category({
  //     id: category?.id || 0,
  //     name: categoryRequest.name,
  //     itemCount: 0,
  //   }))
  //   return
  // }
}

watch(locale, () => {
}, { immediate: true })
</script>

<template>
  <UModal :close="{ onClick: cancel }" :title="t('Import-category')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-3">
        <p>We only accept CSV files. Please <UButton label="download the example file" variant="link" class="p-0 text-base" />.</p>
        <FileInput />
      </div>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton type="submit" variant="solid" color="primary" class="capitalize" @click="submit" >{{ t('upload') }}</UButton>
    </template>
  </UModal>
</template>