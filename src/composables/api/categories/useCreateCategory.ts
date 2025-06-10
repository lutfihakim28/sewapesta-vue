import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'

export function useCreateCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const { mutate } = useMutation({
    mutation(category: Category) {
      return createCategory(category)
    },
    onMutate(category: Category) {
      const oldCategories: Category[] = queryCache.getQueryData(listQueryKey.value) || []

      const latestCategory = oldCategories
        .toSorted((a, b) => Math.abs(b.id) - Math.abs(a.id))
        .at(0)

      const newIndex = ((latestCategory?.id || 0) + 1) * -1;

      const newCategory = new Category({
        ...category,
        id: newIndex,
      })

      const newCategories = [newCategory, ...oldCategories]

      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldCategories, newCategories, newCategory }
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


  async function createCategory(category: Category): Promise<Category> {
    const { data } = await apiFetch('private/categories').post({ name: category.name })

    const response = new ApiResponseData(data.value, Category)

    return response.data;
  }

  return { create: mutate }
}