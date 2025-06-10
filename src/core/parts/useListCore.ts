import { useQueryParam } from '@/composables/useQueryParam';
import { useQuery } from '@pinia/colada';
import { computed, shallowRef, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiResponseList } from '@/dto/ApiResponse';
import type { Meta } from '@/dto/Meta';
import { PRIVATE_QUERY_KEYS, type AvailablePrivateKey } from '@/constants/query-keys';
import { useApiFetch } from '@/plugins/api-fetch';

interface UseListCoreOptions<T> {
  key: AvailablePrivateKey;
  dto: new (data: T) => T;
  isPublic?: boolean;
  additionalQueryParam?: Ref<string> | string;
}

export function useListCore<T>(options: UseListCoreOptions<T>) {
  const { key, isPublic, dto, additionalQueryParam } = options;
  const { t } = useI18n();
  const apiFetch = useApiFetch()

  const { path } = useQueryParam(isPublic ? `public/${key}` : `private/${key}`);

  const meta = shallowRef<Meta>();

  const fullPath = computed(() => {
    let currentPath = path.value;
    if (additionalQueryParam) {
      const paramValue = typeof additionalQueryParam === 'string' ? additionalQueryParam : additionalQueryParam.value;
      if (paramValue) {
        currentPath += currentPath.includes('?') ? '&' : '?';
        currentPath += paramValue;
      }
    }
    return currentPath;
  });

  const { data, refetch, isLoading, } = useQuery({
    key: () => PRIVATE_QUERY_KEYS[key].list(fullPath.value),
    query: () => fetcher(fullPath.value),
  });

  const list = computed<T[]>((previous) => {
    if (data.value) {
      return data.value || [];
    }
    if (previous) return previous;
    return [];
  });

  async function fetcher(currentPath: string) {
    if (!currentPath.includes('page=')) return;

    const { data, get } = apiFetch<ApiResponseList<T>>(currentPath);
    await get();
    const response = new ApiResponseList(data.value, dto);
    meta.value = response.meta;
    return response.data;
  }

  async function refreshData() {
    await refetch();
  }

  return {
    list,
    meta,
    isLoading,
    fullPath,
    refreshData,
    t,
  };
}
