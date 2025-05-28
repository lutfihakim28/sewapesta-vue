<script setup lang="ts">
  import type { Meta } from '@/utils/dtos/Meta';
  import type { SelectItem } from '@nuxt/ui'
  import { useRouteQuery } from '@vueuse/router'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router';

  const { meta, disabled } = defineProps<{
    meta?: Meta,
    disabled?: boolean
  }>()

  const route = useRoute();

  const page = useRouteQuery('page', undefined, { transform: Number })
  const pageSize = useRouteQuery('pageSize', undefined, { transform: Number })

  const availableSize = ref<SelectItem[]>([
    5,
    10,
    20,
    25,
    50,
    100,
  ])
  const totalData = ref<number>()

  const dataRange = computed<number[]>(() => {
    if (!meta) return [0, 0]
    const start = ((meta.page - 1) * meta.pageSize) + 1;
    const end = meta.page * meta.pageSize > meta.totalData ? meta.totalData : meta.page * meta.pageSize;
    return [start, end]
  })

  onMounted(() => {
    page.value = 1
    pageSize.value = 10
  })

watch(() => route.query, (value, oldValue) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page: pageValue, ...restValue } = value;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page: pageOldValue, ...restOldValue } = oldValue;

  const otherChanged = Object.keys(restValue).some(
    key => restValue[key] !== restOldValue[key]
  )

  if (otherChanged) {
    page.value = 1
  }

}, { deep: true })

watch(() => meta, () => {
  if (meta) {
    totalData.value = meta.totalData
  }
})
</script>

<template>
  <section class="p-4 flex justify-between items-center border-t border-default pt-4">
    <p>
      <span v-if="dataRange.length" class="text-muted">
        Showing
        <span class="text-highlighted">{{ dataRange[0] }}</span>
          -
        <span class="text-highlighted">{{ dataRange[1] }}</span>
          of
        <span class="text-highlighted">{{ meta?.totalData }}</span>
          items
      </span>
    </p>
    <section class="flex items-center gap-x-4">
      <USelect v-model="pageSize" :items="availableSize" />
      <UPagination
        v-model:page="page"
        :total="totalData"
        :items-per-page="pageSize"
        :disabled="disabled"
        show-edges
      />
    </section>
  </section>
</template>
