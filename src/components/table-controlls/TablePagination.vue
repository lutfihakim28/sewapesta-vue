<script setup lang="ts">
  import type { Meta } from '@/utils/dtos/Meta';
  import type { SelectItem } from '@nuxt/ui'
  import { useRouteQuery } from '@vueuse/router'
  import { computed, onMounted, ref } from 'vue'

  const { meta = {
    page: 1,
    pageCount: 1,
    pageSize: 5,
    totalData: 0,
  } } = defineProps<{
    meta?: Meta
  }>()

  const page = useRouteQuery('page', undefined, { transform: Number, mode: 'push' })
  const pageSize = useRouteQuery('pageSize', undefined, { transform: Number, mode: 'push' })

  const availableSize = ref<SelectItem[]>([
    5,
    10,
    20,
    25,
    50,
    100,
  ])

  const dataRange = computed<number[]>(() => {
    const start = ((meta.page - 1) * meta.pageSize) + 1;
    const end = meta.page * meta.pageSize > meta.totalData ? meta.totalData : meta.page * meta.pageSize;
    return [start, end]
  })

  onMounted(() => {
    page.value = 1
    pageSize.value = 10
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
        :total="meta.totalData"
        :items-per-page="pageSize"
        show-edges
      />
    </section>
  </section>
</template>