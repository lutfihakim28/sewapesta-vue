<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import { reactive } from 'vue';
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { Item } from '@/dto/Item';
import { generateItemRequestSchema, type ItemRequest } from '@/schemas/item-request';
import { useCategoryOptionStore } from '@/stores/useCategoryOptionStore';
import { useUnitOptionStore } from '@/stores/useUnitOptionStore';
import { ItemTypeEnum } from '@/enums/item-type';
import { Category } from '@/dto/Category';
import { Unit } from '@/dto/Unit';
import type { AppSelectItem } from '@/types/select-item';
import { getLabel } from '@/helpers/select-item';

const { item = undefined } = defineProps<{
  item?: Item
}>()

const emit = defineEmits<{
  close: [result?: Item]
}>()

const form = useTemplateRef('form');

defineShortcuts({
  'meta_s': {
    handler: async () => await form.value?.submit(),
    usingInput: true,
  },
})

const { t, locale } = useI18n()
const categoryOptions = useCategoryOptionStore()
const unitOptions = useUnitOptionStore()

const TYPE_OPTIONS: AppSelectItem[] = [
  {
    label: t(ItemTypeEnum.Equipment),
    value: ItemTypeEnum.Equipment
  },
  {
    label: t(ItemTypeEnum.Inventory),
    value: ItemTypeEnum.Inventory
  },
]

const checkUniqueLoading = ref(false)

const schema = ref(generateItemRequestSchema(t))
const payload = reactive<ItemRequest>({})

const title = computed(() => {
  if (item) {
    return t('Edit-entity', {
      entity: t('item')
    })
  }
  return t('New-entity', {
      entity: t('item')
    })
})

onMounted(() => {
  if (item) {
    payload.categoryId = item.category.id
    payload.type = item.type
    payload.unitId = item.unit.id
    payload.name = item.name
  }
})

function cancel() {
  emit('close')
}

async function submit() {
  // const valid = await form.value?.validate()
  // if (!valid) return
  emit('close', new Item({
    category: new Category({
      id: payload.categoryId!,
      name: getLabel(categoryOptions.options, payload.categoryId!),
    }),
    unit: new Unit({
      id: payload.unitId!,
      name: getLabel(unitOptions.options, payload.unitId!)
    }),
    name: payload.name!,
    type: payload.type!,
    id: item?.id || 0,
    loading: true,
  }))
}

// async function addField() {
//   if (payload.names[0].length > 0) {
//     payload.names.unshift('')
//   }
//   await nextTick();
//   focusInput()
// }

// async function removeField(index: number) {
//   payload.names.splice(index, 1)
//   await nextTick();
//   focusInput(index)
// }

// function focusInput(index = 0) {
//   const inputElement = input.value?.[index].inputRef
//   if (inputElement && !inputElement.disabled) {
//     inputElement.focus()
//   } else {
//     setTimeout(focusInput, 50)
//   }
// }

// function moveFocus(direction: number) {
//   if (!input.value) return;

//   const currentFocusIndex = input.value.findIndex((input) => document.activeElement === input.inputRef);

//   if (currentFocusIndex === undefined) return;

//   const nextFocusIndex = currentFocusIndex + direction

//   if (nextFocusIndex < 0 || nextFocusIndex >= input.value.length) return;

//   input.value[nextFocusIndex].inputRef?.focus()
// }

// async function deleteFocused() {
//   if (!input.value) return;
//   const currentFocusIndex = input.value.findIndex((input) => document.activeElement === input.inputRef);
//   if (currentFocusIndex === 0) return;
//   await removeField(currentFocusIndex)
// }

watch(locale, async () => {
  schema.value = generateItemRequestSchema(t)
})
</script>

<template>
  <UModal
    :close="{ onClick: cancel }"
    :title="title"
    :ui="{ footer: 'justify-end', body: 'sm:p-0 overflow-y-hidden' }"
  >
    <template #body>
      <UForm
        ref="form"
        id="form"
        class="p-6 flex flex-col gap-4"
        :schema="schema"
        :state="payload"
        @submit.prevent="submit"
      >
        <UFormField
          :label="t('field.Name')"
          name="name"
        >
          <UInput
            v-model="payload.name"
            class="w-full"
            variant="subtle"
            :placeholder="t('Entity-name', { entity: t('item') })"
            autofocus
          />
        </UFormField>

        <UFormField
          :label="t('field.Type')"
          name="type"
        >
          <USelect
            v-model="payload.type"
            class="w-full"
            variant="subtle"
            :placeholder="t('select-entity', { entity: t('type') })"
            :items="TYPE_OPTIONS"
          />
        </UFormField>

        <UFormField
          :label="t('field.entity-ID', { entity: t('Category') })"
          name="categoryId"
        >
          <USelect
            v-model="payload.categoryId"
            class="w-full"
            variant="subtle"
            :placeholder="t('select-entity', { entity: t('category') })"
            :items="categoryOptions.options"
            :loading="categoryOptions.loading"
          />
        </UFormField>

        <UFormField
          :label="t('field.entity-ID', { entity: t('Unit') })"
          name="unitId"
        >
          <USelect
            v-model="payload.unitId"
            class="w-full"
            variant="subtle"
            :placeholder="t('select-entity', { entity: t('unit') })"
            :items="unitOptions.options"
            :loading="unitOptions.loading"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        class="capitalize"
        :disabled="checkUniqueLoading"
        @click="cancel"
      >
        {{ t('cancel') }}
      </UButton>
      <UButton
        type="submit"
        form="form"
        variant="solid"
        color="primary"
        class="capitalize"
        :loading="checkUniqueLoading"
      >
        {{ t('save') }}
      </UButton>
    </template>
  </UModal>
</template>
