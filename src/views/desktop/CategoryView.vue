<script setup lang="ts">
  import { useApiFetch } from '@/utils/composables/api-fetch';
  import { ApiResponseList } from '@/utils/dtos/ApiResponse';
  import { Category } from '@/utils/dtos/Category';
  import { useQuery } from '@pinia/colada';
  import { computed } from 'vue';

  const path = computed(() => {
    return `private/categories`
  });

  const { fetch } = useApiFetch()
  const { data: fetchData, get } = fetch<ApiResponseList<Category>>(path.value);

  const { data } = useQuery({
    key: () => [path.value],
    query: () => fetcher(),
  })

  const categories = computed<Category[]>(() => {
    if (!data.value) return [];
    const response = new ApiResponseList(data.value, Category)

    return response.data
  })

  async function fetcher() {
    await get();
    return fetchData.value;
  }
</script>

<template>
  <section>
    <ul>
      <li v-for="(category, index) in categories" :key="`${category}_${index}`">{{ category.name }}</li>
    </ul>
  </section>
</template>
