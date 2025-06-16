<script setup lang="ts">
import { ItemTypeEnum } from '@/enums/item-type';
import { generateItemRequestSchema, type ItemRequest } from '@/schemas/item-request';
import { useCategoryOptionStore } from '@/stores/useCategoryOptionStore';
import { useUnitOptionStore } from '@/stores/useUnitOptionStore';
import type { AppSelectItem } from '@/types/select-item';
import { reactive, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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

const schema = shallowRef(generateItemRequestSchema(t))
const payload = reactive<ItemRequest>({})

watch(locale, () => {
  schema.value = generateItemRequestSchema(t)
})
</script>

<template>
  <UForm
    :schema="schema"
    :state="payload"
  >
    <UFormField
      :label="t('field.Name')"
      name="name"
    >
      <UInput v-model="payload.name" />
    </UFormField>

    <UFormField
      :label="t('field.Type')"
      name="type"
    >
      <USelect
        v-model="payload.type"
        :placeholder="t('select-entity', { entity: t('type') })"
        :items="TYPE_OPTIONS"
      />
    </UFormField>

    <UFormField
      :label="t('field.entity-ID', { entity: t('Category') })"
      name="category"
    >
      <USelect
        v-model="payload.categoryId"
        :placeholder="t('select-entity', { entity: t('category') })"
        :items="categoryOptions.options"
        :loading="categoryOptions.loading"
      />
    </UFormField>

    <UFormField
      :label="t('field.entity-ID', { entity: t('Unit') })"
      name="unit"
    >
      <USelect
        v-model="payload.unitId"
        :placeholder="t('select-entity', { entity: t('unit') })"
        :items="unitOptions.options"
        :loading="unitOptions.loading"
      />
    </UFormField>
    <pre>{{ payload }}</pre>
  </UForm>
</template>
