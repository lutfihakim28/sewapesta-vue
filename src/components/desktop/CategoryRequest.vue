<script setup lang="ts">
import { Category } from '@/dto/Category';
import { useI18n } from 'vue-i18n';
import { generateCategoryRequestSchema } from '@/schemas/category-request';
import { ref } from 'vue';
import { watch } from 'vue';
import SimpleRequest from './SimpleRequest.vue';
import type { SimpleRequestSchema } from '@/types/schema';

const { category = undefined } = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  close: [result?: Category[]]
}>()

const { t, locale } = useI18n()
const CategoryRequestSchema = ref(generateCategoryRequestSchema(t));

watch(locale, () => {
  CategoryRequestSchema.value = generateCategoryRequestSchema(t)
}, { immediate: true })

function close(categories?: Category[]) {
  emit('close', categories)
}
</script>

<template>
  <SimpleRequest
    :constructor="Category"
    :entity="category"
    entity-name="Category"
    :entity-name-singular="t('Category')"
    :entity-name-plural="t('Categories')"
    check-unique-path="private/categories/check-uniques"
    @close="close"
    :schema="CategoryRequestSchema as SimpleRequestSchema"
  />
</template>
