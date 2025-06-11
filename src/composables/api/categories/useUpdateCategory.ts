import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(category: Category) {
      return updateCategory(category)
    },
    onMutate(category: Category) {
      const oldCategories: Category[] = queryCache.getQueryData(listQueryKey.value) || []

      let updatedCategories = oldCategories.map((cat) => {
        if (cat.id !== category.id) return cat;
        return {
          ...category,
          loading: true,
        };
      })

      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      if (searchParams.has('keyword') && !category.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
        updatedCategories = updatedCategories.filter((cat) => cat.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase()))
      }

      queryCache.setQueryData(listQueryKey.value, updatedCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldCategories, updatedCategories, updatedCategory: category }
    },
    onSettled() {
      queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.categories.root() })
    },
    onError(err, _title, { oldCategories, updatedCategories }) {
      if (
        updatedCategories != null
        && updatedCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories)
      }

      console.error(err)

      toast.add({
        title: `Update Category ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    },
  })


  async function updateCategory(category: Category): Promise<Category> {
    const { data } = await apiFetch(`private/categories/${category.id}`).put({ name: category.name })

    const response = new ApiResponseData(data.value, Category)

    return response.data;
  }

  return { update: mutate, isLoading }
}