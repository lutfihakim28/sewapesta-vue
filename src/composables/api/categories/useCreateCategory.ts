import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseList } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(categories: Category[]) {
      return createCategory(categories)
    },
    onMutate(categories: Category[]) {
      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      const oldCategories: Category[] = queryCache.getQueryData(listQueryKey.value) || []

      let newCategories = [...oldCategories];
      const latestCategories: Category[] = [];

      categories.forEach((category, index) => {
        if (searchParams.get('page') !== '1') {
          return;
        }

        if (searchParams.has('keyword') && !category.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
          return
        }

        const latestCategory = oldCategories
          .toSorted((a, b) => Math.abs(b.id) - Math.abs(a.id))
          .at(0)

        const newIndex = ((latestCategory?.id || 0) + index + 1);

        const newCategory = new Category({
          ...category,
          loading: true,
          id: newIndex,
        })

        newCategories.pop()

        latestCategories.push(newCategory)
        newCategories = [newCategory, ...newCategories]
      })


      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldCategories, newCategories, latestCategories }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.categories.root() })
    },

    onError(err, _title, { oldCategories, newCategories }) {
      if (
        newCategories != null
        && newCategories === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldCategories)
      }

      console.error(err)

      toast.add({
        title: 'Create Category',
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function createCategory(categories: Category[]): Promise<Category[]> {
    const { data } = await apiFetch<ApiResponseList<Category>>('private/categories/many').post({
      names: categories.map((category) => category.name)
    })

    const response = new ApiResponseList({
      ...data.value,
      meta: {
        total: 0
      }
    }, Category)

    return response.data;
  }

  return { create: mutate, isLoading }
}
