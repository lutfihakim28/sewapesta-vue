import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const searchParams = computed(() => new URLSearchParams(listQueryKey.value.join().split('?')[1]))
  const oldCategories = computed<Category[]>(() => queryCache.getQueryData(listQueryKey.value) || [])

  const { mutate, isLoading } = useMutation({
    mutation(category: Category) {
      return updateCategory(category)
    },
    onMutate(category: Category) {
      const updatedCategories = updateOldCategories(category)
      const filteredCategories = applyFilters(updatedCategories)

      queryCache.setQueryData(listQueryKey.value, filteredCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { updatedCategories, updatedCategory: category }
    },
    onSuccess(data, _vars, { updatedCategories, updatedCategory }) {
      if (data && updatedCategories && updatedCategory) {
        const _updatedCategories = [...updatedCategories]
        const index = _updatedCategories.indexOf(updatedCategory)
        if (index === -1) return
        _updatedCategories[index] = data

        queryCache.setQueryData(listQueryKey.value, _updatedCategories)
      }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.categories.root() })
    },
    onError(err, _title, { updatedCategories }) {
      if (
        updatedCategories != null
        && updatedCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories.value)
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

  function updateOldCategories(category: Category) {
    return oldCategories.value.map((cat) => {
      if (cat.id !== category.id) return cat;
      return new Category({
        ...category,
        loading: true,
      });
    })
  }

  function applyFilters(categories: Category[]) {
    return categories.filter((category) => {
      if (searchParams.value.has('keyword') && !category.name.toLowerCase().includes(searchParams.value.get('keyword')!.toLowerCase())) return false;
      return true;
    })
  }

  return { update: mutate, isLoading }
}
