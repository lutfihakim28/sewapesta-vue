<script setup lang="ts">
import { Category } from '@/dto/Category';
import { computed, nextTick, onMounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateCategoryRequestSchema, type CategoryRequest } from '@/schemas/category-request';
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { reactive } from 'vue';
import { watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useApiFetch } from '@/plugins/api-fetch';


const { category } = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  close: [result?: Category]
}>()

const apiFetch = useApiFetch();
const { t, locale } = useI18n()

const CategoryRequestSchema = ref<ReturnType<typeof generateCategoryRequestSchema>>(generateCategoryRequestSchema(t));

const categoryForm = useTemplateRef<ComponentExposed<typeof UForm>>('category-form');
const nameInput = useTemplateRef<ComponentExposed<typeof UInput>>('name-input');

const categoryRequest = reactive<Partial<CategoryRequest>>({
  name: category ? category.name : undefined,
})
const isExist = ref(false);

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

async function submit() {
  if (isExist.value) {
    emit('close')
    return;
  }
  if (categoryRequest.name) {
    emit('close', new Category({
      id: category?.id || 0,
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

watchDebounced(() => categoryRequest.name, async (value) => {
  if (value) {
    const { data } = await apiFetch(`private/categories/check-uniques?unique=${value}`).get()

    isExist.value = !data.value;

    if (isExist.value) {
      categoryForm.value?.setErrors([{
        message: t('validation.unavailable-name', {
          data: t('Category'),
          name: value
        }),
        name: 'name'
      }])
    }
  }

  if (!value) {
    isExist.value = false
    categoryForm.value?.validate()
  }
}, { debounce: 500 })
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
      <UButton type="submit" form="category-form" variant="solid" color="primary" class="capitalize">{{ t('save') }}</UButton>
    </template>
  </UModal>
</template>