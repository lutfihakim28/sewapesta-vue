<script setup lang="ts">
  import { useApiFetch } from '@/utils/composables/api-fetch';
  import { ApiResponseList } from '@/utils/dtos/ApiResponse';
  import { Category } from '@/utils/dtos/Category';
  import { computed, onMounted } from 'vue';
  import useSWRV from 'swrv';

  const path = computed(() => {
    return `private/categories`
  });

  const { execute, data: fetchData } = useApiFetch<ApiResponseList<Category>>(path.value).get();
  const { data, mutate } = useSWRV(path.value, fetcher, { revalidateOnFocus: false });

  const categories = computed<Category[]>(() => {
    if (!data.value) return [];
    const response = new ApiResponseList(data.value, Category)

    return response.data
  })

  onMounted(() => {
    mutate()
  })

  async function fetcher() {
    await execute();
    return fetchData.value;
  }
</script>

<template>
  <section></section>
  <ul>
    <li v-for="(category, index) in categories" :key="`${category}_${index}`">{{ category.name }}</li>
  </ul>
</template>