import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'

export function useDeleteCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()

  const { mutate, isLoading } = useMutation({
    mutation(category: Category) {
      return deleteCategory(category)
    },
    onMutate(category: Category) {
      const oldCategories: Category[] = queryCache.getQueryData(listQueryKey.value) || []

      const newCategories = oldCategories.filter((_category) => _category.id !== category.id)

      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldCategories, newCategories }
    },

    // onSuccess(category, _, { newCategory }) {
    //   const categories: Category[] = queryCache.getQueryData(listQueryKey.value) || []
    //   const categoryIndex = categories.findIndex(c => c.id === newCategory.id)
    //   if (categoryIndex >= 0) {
    //     queryCache.setQueryData(
    //       listQueryKey.value,
    //       categories.toSpliced(categoryIndex, 1, category)
    //     )
    //   }
    // },
    onSettled() {
      queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.categories.root() })
    },

    onError(err, _title, { oldCategories, newCategories }) {
      if (
        newCategories != null
        && newCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories)
      }

      console.error(err)

      // TODO: Handle error
    }
  })


  async function deleteCategory(category: Category): Promise<Category> {
    await apiFetch(`private/categories/${category.id}`).delete()
    return category;
  }

  return { deleteCategory: mutate, isLoading }
}