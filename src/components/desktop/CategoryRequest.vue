<script setup lang="ts">
import { Category } from '@/dto/Category';
import { computed, nextTick, onMounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateCategoryRequestSchema } from '../../schemas/category-request';
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { reactive } from 'vue';
import type { SchemaType } from '@/types/schema';
import { watch } from 'vue';


const { category } = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  close: [result?: Category]
}>()

const { t, locale } = useI18n()

const CategoryRequestSchema = ref<ReturnType<typeof generateCategoryRequestSchema>>(generateCategoryRequestSchema(t));

const categoryForm = useTemplateRef<ComponentExposed<typeof UForm>>('category-form');
const nameInput = useTemplateRef<ComponentExposed<typeof UInput>>('name-input');

const categoryRequest = reactive<Partial<SchemaType<typeof CategoryRequestSchema.value>>>({
  name: undefined,
})

onMounted(async () => {
  await nextTick()
  nameInput.value?.inputRef?.focus()
})

const title = computed(() => {
  if (category) {
    return t('Edit-category')
  }
  return t('New-category')
})

function cancel() {
  emit('close')
}

function submit() {
  if (categoryRequest.name) {
    emit('close', new Category({
      id: 0,
      name: categoryRequest.name,
      itemCount: 0,
    }))
    return
  }
}

watch(locale, () => {
  CategoryRequestSchema.value = generateCategoryRequestSchema(t)
  categoryForm.value?.clear();
}, { immediate: true })
</script>

<template>
  <UModal :close="{ onClick: cancel }" :title="title" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UForm ref="category-form" id="category-form" :schema="CategoryRequestSchema" :state="categoryRequest" @submit="submit">
        <UFormField name="name">
          <UInput ref="name-input" v-model="categoryRequest.name" :placeholder="t('field.Name')" :ui="{ root: 'w-full' }" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton type="submit" target="category-form" variant="solid" color="primary" class="capitalize">{{ t('save') }}</UButton>
    </template>
  </UModal>
</template>