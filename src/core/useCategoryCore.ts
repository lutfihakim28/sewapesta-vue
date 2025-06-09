import { Category } from '@/dto/Category';
import { useListCore } from './parts/useListCore';
import CategoryRequest from '@/components/desktop/CategoryRequest.vue';
import { useMutation, useQueryCache } from '@pinia/colada';
import { useApiFetch } from '@/plugins/api-fetch';
import { ApiResponseData, ApiResponseList } from '@/dto/ApiResponse';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { computed } from 'vue';

export function useCategoryCore() {
  const { isPending, list, meta, fullPath, refreshData, t } = useListCore({
    key: 'categories',
    dto: Category,
  })

  const apiFetch = useApiFetch()
  const overlay = useOverlay();
  const modal = overlay.create(CategoryRequest)

  const listQueryKey = computed(() => PRIVATE_QUERY_KEYS.categories.list(fullPath.value))

  const queryCache = useQueryCache()
  const { mutate } = useMutation({
    mutation(category: Category) {
      return createCategory(category)
    },
    onMutate(category: Category) {
      const oldCategories: Category[] = queryCache.getQueryData(listQueryKey.value) || []

      const newCategories = [category, ...oldCategories]

      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldCategories, newCategories, newCategory: category }
    },

    onSuccess(category, _, { newCategory }) {
      const categories: Category[] = queryCache.getQueryData(listQueryKey.value) || []
      const categoryIndex = categories.findIndex(c => c.id === newCategory.id)
      if (categoryIndex >= 0) {
        queryCache.setQueryData(
          listQueryKey.value,
          categories.toSpliced(categoryIndex, 1, category)
        )
      }
    },
    onSettled() {
      queryCache.invalidateQueries({ key: listQueryKey.value })
    },

    onError(err, _title, { oldCategories, newCategories }) {
      if (
        newCategories != null
        && newCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories)
      }

      console.log(err)

      // TODO: Handle error
    }
  })

  async function openForm(category?: Category) {
    const instance = modal.open({
      category
    })

    const newCategory = await instance.result

    if (newCategory) {
      mutate(newCategory)
    }
  }

  async function createCategory(category: Category): Promise<Category> {
    const { data, execute } = apiFetch('private/categories', { immediate: false }).post({ name: category.name })
    await execute();
    const response = new ApiResponseData(data.value, Category)

    return response.data;
  }

  return {
    categories: list,
    meta,
    isPending,
    refreshData,
    t,
    openForm,
  }
}
