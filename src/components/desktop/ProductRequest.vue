<script setup lang="ts">
import { Product } from '@/dto/Product';
import { useI18n } from 'vue-i18n';
import { generateProductRequestSchema } from '@/schemas/product-request';
import { ref } from 'vue';
import { watch } from 'vue';
import SimpleRequest from './SimpleRequest.vue';
import type { SimpleRequestSchema } from '@/types/schema';

const { product = undefined } = defineProps<{
  product?: Product
}>()

const emit = defineEmits<{
  close: [result?: Product[]]
}>()

const { t, locale } = useI18n()
const ProductRequestSchema = ref(generateProductRequestSchema(t));

watch(locale, () => {
  ProductRequestSchema.value = generateProductRequestSchema(t)
}, { immediate: true })

function close(products?: Product[]) {
  emit('close', products)
}
</script>

<template>
  <SimpleRequest
    :constructor="Product"
    :entity="product"
    entity-name="Product"
    :entity-name-singular="t('Product')"
    check-unique-path="private/products/check-uniques"
    @close="close"
    :schema="ProductRequestSchema as SimpleRequestSchema"
  />
</template>
