<script setup lang="ts" generic="T extends { id?: number, name: string }, P extends { names: string[] }">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import { reactive } from 'vue';
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { useApiFetch } from '@/plugins/api-fetch';
import type { SimpleRequestSchema } from '@/types/schema';

const { entity, entityName, schema, checkUniquePath, constructor } = defineProps<{
  entity?: T,
  entityName: string,
  schema: SimpleRequestSchema,
  checkUniquePath: string,
  constructor: new (data: T) => T,
}>()

const emit = defineEmits<{
  close: [result?: T[]]
}>()

defineShortcuts({
  'enter': {
    handler: () => {
      if (!entity) {
        addField()
      } else {
        submit()
      }
    },
    usingInput: true,
  },
  'meta_backspace': {
    handler: () => {
      if (!entity && payload.names.length > 1) {
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

const { t } = useI18n()
const apiFetch = useApiFetch()
const toast = useToast()


const form = useTemplateRef<ComponentExposed<typeof UForm>>('form');
const input = useTemplateRef<ComponentExposed<typeof UInput>[]>('input');

const payload = reactive<P>({
  names: ['']
} as P)

const title = computed(() => {
  if (entity) {
    return t('Edit-entity', {
      entity: t(entityName)
    })
  }
  return t('New-entity', {
      entity: t(entityName, payload.names.length)
    })
})

onMounted(async () => {
  if (entity) {
    payload.names = [entity.name]
  }
  await nextTick()
  focusInput()
})

function cancel() {
  emit('close')
}

async function submit() {
  if (payload.names.every((name) => !name) || payload.names[0] === entity?.name) {
    emit('close')
    return;
  }

  if (payload.names.length === 1) {
    const { data } = await apiFetch<boolean>(`${checkUniquePath}?unique=${payload.names[0]}`).get();

    if (!data.value) {
      toast.add({
        description: t('validation.unavailable-name', {
          data: t(entityName),
          name: payload.names[0],
        }),
        color: 'error'
      })
      await nextTick()
      focusInput()
      return
    }
  }

  emit('close', payload.names
    .filter((name) => !!name)
    .map((name) => new constructor({
      name,
      itemCount: 0,
      id: entity?.id || 0,
    } as unknown as T)))
}

// watch(locale, () => {
//   form.value?.clear();
// }, { immediate: true })

async function addField() {
  if (payload.names[0].length > 0) {
    payload.names.unshift('')
  }
  await nextTick();
  focusInput()
}

async function removeField(index: number) {
  payload.names.splice(index, 1)
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
      <UForm ref="form" id="form" :schema="schema" :state="payload" @submit.prevent="submit">
        <div :class="[
          'flex flex-col gap-y-2 p-6 overflow-y-auto',
          { 'h-64': !entity }
        ]">
          <UFormField v-for="(name, index) in payload.names" :key="`name-${index}`" :name="`names.${index}`">
            <UButtonGroup class="w-full">
              <UInput ref="input" v-model="payload.names[index]" :placeholder="t('field.Name')" :ui="{ root: 'w-full' }" />
              <UButton v-if="index === 0 && !entity" icon="i-lucide-plus" variant="subtle" @click="addField" />
              <UButton v-else-if="!entity" icon="i-lucide-minus" variant="subtle" color="neutral" @click="() => removeField(index)" />
            </UButtonGroup>
          </UFormField>
          <div v-if="!entity" class="border border-info bg-info/10 text-info rounded px-2 py-1 text-sm text-center italic mt-4">
            {{ t('Duplication-info', { data: t(entityName.toLowerCase(), 2) }) }}
          </div>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton variant="outline" color="neutral" class="capitalize" @click="cancel">{{ t('cancel') }}</UButton>
      <UButton type="submit" form="form" variant="solid" color="primary" class="capitalize">{{ t('save') }}</UButton>
    </template>
  </UModal>
</template>