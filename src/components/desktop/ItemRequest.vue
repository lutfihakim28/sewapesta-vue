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
  emit('close', new Item({
    category: new Category({
      id: payload.categoryId!,
      name: getLabel({
        options: categoryOptions.options,
        value: payload.categoryId!
      }),
    }),
    unit: new Unit({
      id: payload.unitId!,
      name: getLabel({
        options: unitOptions.options,
        value: payload.unitId!
      })
    }),
    name: payload.name!,
    type: payload.type!,
    id: item?.id || 0,
    loading: true,
  }))
}

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
          <USelectMenu
            v-model="payload.categoryId"
            class="w-full"
            variant="subtle"
            value-key="value"
            :placeholder="t('select-entity', { entity: t('category') })"
            :items="categoryOptions.options"
            :loading="categoryOptions.loading"
          />
        </UFormField>

        <UFormField
          :label="t('field.entity-ID', { entity: t('Unit') })"
          name="unitId"
        >
          <USelectMenu
            v-model="payload.unitId"
            class="w-full"
            variant="subtle"
            value-key="value"
            :placeholder="t('select-entity', { entity: t('unit') })"
            :items="unitOptions.options"
            :loading="unitOptions.loading"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        variant="ghost"
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
