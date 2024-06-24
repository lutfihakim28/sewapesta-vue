import { Meta } from '@/schemas/MetaSchema';
import { computed, reactive } from 'vue';

export function usePagination() {
  const pagination = reactive<Meta>({
    page: 1,
    limit: '10',
    totalPage: 0,
  })

  const totalData = computed(() => pagination.totalPage * Number(pagination.limit))

  return {
    pagination,
    totalData,
  }
}