<script setup lang="ts">
import { Unit } from '@/dto/Unit';
import { useI18n } from 'vue-i18n';
import { generateUnitRequestSchema } from '@/schemas/unit-request';
import { ref } from 'vue';
import { watch } from 'vue';
import SimpleRequest from './SimpleRequest.vue';
import type { SimpleRequestSchema } from '@/types/schema';

const { unit = undefined } = defineProps<{
  unit?: Unit
}>()

const emit = defineEmits<{
  close: [result?: Unit[]]
}>()

const { t, locale } = useI18n()
const UnitRequestSchema = ref(generateUnitRequestSchema(t));

watch(locale, () => {
  UnitRequestSchema.value = generateUnitRequestSchema(t)
}, { immediate: true })

function close(units?: Unit[]) {
  emit('close', units)
}
</script>

<template>
  <SimpleRequest
    :constructor="Unit"
    :entity="unit"
    entity-name="Unit"
    :entity-name-singular="t('Unit')"
    :entity-name-plural="t('Units')"
    check-unique-path="private/units/check-uniques"
    @close="close"
    :schema="UnitRequestSchema as SimpleRequestSchema"
  />
</template>
