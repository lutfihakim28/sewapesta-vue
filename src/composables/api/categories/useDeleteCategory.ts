import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { type Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDeleteCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const oldCategories = computed<Category[]>(() => queryCache.getQueryData(listQueryKey.value) || [])

  const { mutate, isLoading } = useMutation({
    mutation(category: Category) {
      return deleteCategory(category)
    },
    onMutate(category: Category) {
      const newCategories = oldCategories.value.filter((_category) => _category.id !== category.id)

      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { newCategories }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.categories.root() })
    },

    onError(err, _title, { newCategories }) {
      if (
        newCategories != null
        && newCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories.value)
      }

      console.error(err)

      toast.add({
        title: `Delete Category ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function deleteCategory(category: Category): Promise<Category> {
    await apiFetch(`private/categories/${category.id}`).delete()
    return category;
  }

  return { deleteCategory: mutate, isLoading }
}
