<script setup lang="ts">
import { useApiFetch } from '@/utils/composables/api-fetch';
  import { ApiResponseList } from '@/utils/dtos/ApiResponse';
  import { Item } from '@/utils/dtos/Item';
  import type { ItemFilter } from '@/utils/schemas/item-filter';
  import { useQuery } from '@pinia/colada';
  import { computed, reactive, ref } from 'vue';

  const filter = reactive<ItemFilter>({
    asc: undefined,
    categoryId: undefined,
    desc: undefined,
    keyword: undefined,
    page: 1,
    pageSize: 5
  })

  const basePath = ref('private/items')

  const path = computed(() => {
    const query = new URLSearchParams()
    Object.entries(filter).forEach(([_key, value]) => {
      const key = _key as keyof ItemFilter;
      if ((key === 'asc' || key === 'desc') && Array.isArray(value)) {
        value.forEach((v) => query.append(key, v))
      }
      if (value) {
        query.append(key, value.toString())
      }
    })
    return `${basePath.value}?${query.toString()}`
  });

  const { data: fetchData, get } = useApiFetch<ApiResponseList<Item>>(path.value);

  const { data, refresh } = useQuery({
    key: () => [basePath.value, filter],
    query: () => fetcher(),
  })

  const items = computed<Item[]>(() => {
    if (!data.value) return [];
    const response = new ApiResponseList(data.value, Item)

    return response.data
  })

  async function fetcher() {
    await get();
    return fetchData.value;
  }
</script>

<template>
  <section>
    <UTable />
  </section>
</template>