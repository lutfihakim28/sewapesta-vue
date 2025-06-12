<script setup lang="ts">
import { Category } from '@/dto/Category';
import { computed, nextTick, onMounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateCategoryRequestSchema, type CategoryRequest } from '@/schemas/category-request';
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import { reactive } from 'vue';
import { watch } from 'vue';
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { useApiFetch } from '@/plugins/api-fetch';

const { category } = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  close: [result?: Category[]]
}>()

defineShortcuts({
  'enter': {
    handler: () => {
      if (!category) {
        addField()
      } else {
        submit()
      }
    },
    usingInput: true,
  },
  'meta_backspace': {
    handler: () => {
      if (!category && categoryRequest.names.length > 1) {
        removeField(0)
      }
    },
    usingInput: true,
  },
  'meta_s': {
    handler: submit,
    usingInput: true,
  },
  'arrowUp': {
    handler: () => moveFocus(-1),
    usingInput: true,
  },
  'arrowDown': {
    handler: () => moveFocus(1),
    usingInput: true,
  },
  'delete': {
    handler: deleteFocused,
    usingInput: true,
  },
})

const { t, locale } = useI18n()
const apiFetch = useApiFetch()
const toast = useToast()

const CategoryRequestSchema = ref<ReturnType<typeof generateCategoryRequestSchema>>(generateCategoryRequestSchema(t));

const categoryForm = useTemplateRef<ComponentExposed<typeof UForm>>('category-form');
const input = useTemplateRef<ComponentExposed<typeof UInput>[]>('input');

const categoryRequest = reactive<CategoryRequest>({
  names: [''],
})

const title = computed(() => {
  if (category) {
    return t('Edit-category')
  }
  return t('New-category', categoryRequest.names.length)
})

onMounted(async () => {
  if (category) {
    categoryRequest.names = [category.name]
  }
  await nextTick()
  focusInput()
})

function cancel() {
  emit('close')
}

async function submit() {
  if (categoryRequest.names.every((category) => !category) || categoryRequest.names[0] === category?.name) {
    emit('close')
    return;
  }

  if (categoryRequest.names.length === 1) {
    const { data } = await apiFetch<boolean>(`private/categories/check-uniques?unique=${categoryRequest.names[0]}`).get();

    if (!data.value) {
      toast.add({
        description: t('validation.unavailable-name', {
          data: t('Category'),
          name: categoryRequest.names[0],
        }),
        color: 'error'
      })
      await nextTick()
      focusInput()
      return
    }
  }

  emit('close', categoryRequest.names
    .filter((_category) => !!_category)
    .map((_category) => new Category({
      name: _category,
      itemCount: 0,
      id: category?.id || 0,
    })))
}

watch(locale, () => {
  CategoryRequestSchema.value = generateCategoryRequestSchema(t)
  categoryForm.value?.clear();
}, { immediate: true })

async function addField() {
  if (categoryRequest.names[0].length > 0) {
    categoryRequest.names.unshift('')
  }
  await nextTick();
  focusInput()
}

async function removeField(index: number) {
  categoryRequest.names.splice(index, 1)
  await nextTick();
  focusInput(index)
}

function focusInput(index = 0) {
  const inputElement = input.value?.[index].inputRef
  if (inputElement && !inputElement.disabled) {
    inputElement.focus()
  } else {
    setTimeout(focusInput, 50)
  }
}

function moveFocus(direction: number) {
  if (!input.value) return;

  const currentFocusIndex = input.value.findIndex((input) => document.activeElement === input.inputRef);
  
  if (currentFocusIndex === undefined) return;
  
  const nextFocusIndex = currentFocusIndex + direction
  
  if (nextFocusIndex < 0 || nextFocusIndex >= input.value.length) return;
  
  input.value[nextFocusIndex].inputRef?.focus()
}

function deleteFocused() {
  if (!input.value) return;
  const currentFocusIndex = input.value.findIndex((input) => document.activeElement === input.inputRef);
  if (currentFocusIndex === 0) return;
  removeField(currentFocusIndex)
}
</script>

<template>
  <UModal :close="{ onClick: cancel }" :title="title" :ui="{ footer: 'justify-end', body: 'sm:p-0 overflow-y-hidden' }">
    <template #body>
      <UForm ref="category-form" id="category-form" :schema="CategoryRequestSchema" :state="categoryRequest" @submit.prevent="submit">
        <div :class="[
          'flex flex-col gap-y-2 p-6 overflow-y-auto',
          { 'h-64': !category }
        ]">
          <UFormField v-for="(name, index) in categoryRequest.names" :key="`name-${index}`" :name="`names.${index}`">
            <UButtonGroup class="w-full">
              <UInput ref="input" v-model="categoryRequest.names[index]" :placeholder="t('field.Name')" :ui="{ root: 'w-full' }" />
              <UButton v-if="index === 0 && !category" icon="i-lucide-plus" variant="subtle" @click="addField" />
              <UButton v-else-if="!category" icon="i-lucide-minus" variant="subtle" color="neutral" @click="() => removeField(index)" />
            </UButtonGroup>
          </UFormField>
          <div v-if="!category" class="border border-info bg-info/10 text-info rounded px-2 py-1 text-sm text-center italic mt-4">
            {{ t('Duplication-info', { data: t('category', 2) }) }}
          </div>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton type="submit" form="category-form" variant="solid" color="primary" class="capitalize">{{ t('save') }}</UButton>
    </template>
  </UModal>
</template>