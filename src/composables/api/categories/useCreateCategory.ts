import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseList } from '@/dto/ApiResponse'
import { Category } from '@/dto/Category'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateCategory(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const searchParams = computed(() => new URLSearchParams(listQueryKey.value.join().split('?')[1]))
  const oldCategories = computed<Category[]>(() => queryCache.getQueryData(listQueryKey.value) || [])

  const { mutate, isLoading } = useMutation({
    mutation(categories: Category[]) {
      return createCategory(categories)
    },
    onMutate(categories: Category[]) {
      const newCategories = createNewCategories(categories)

      queryCache.setQueryData(listQueryKey.value, newCategories)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { newCategories, categories }
    },
    onSuccess(data, _vars, { newCategories }) {
      if (data && newCategories) {
        const _newItems = [...newCategories]

        data.forEach((category) => {
          const index = _newItems.findIndex((cat) => cat.name === category.name);
          if (index === -1) return
          _newItems[index] = category
        })

        queryCache.setQueryData(listQueryKey.value, _newItems)
      }
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

  function isCategoryValid() {
    return (category: Category) => {
      if (oldCategories.value.some((cat) => cat.name.toLowerCase() === category.name.toLowerCase())) return false;
      if (searchParams.value.get('page') !== '1') return false;
      if (searchParams.value.has('keyword') && !category.name.toLowerCase().includes(searchParams.value.get('keyword')!.toLowerCase())) {
        return false;
      }
      return true;
    };
  }

  function createNewCategories(categories: Category[]) {
    const newCategories = [...oldCategories.value];
    const pageSize = Number(searchParams.value.get('pageSize') || 10)

    categories.filter(isCategoryValid()).forEach((category, index) => {
      const newCategory = createNewCategory({ category, index })
      if (oldCategories.value.length >= pageSize) {
        newCategories.pop()
      }
      newCategories.unshift(newCategory)
    })
    return newCategories;
  }

  function createNewCategory({ category, index }: CreateNewCategoryParam): Category {
    const newIndex = getNewIndex(index)

    return new Category({
      ...category,
      loading: true,
      id: newIndex,
    })
  }

  function getNewIndex(index: number) {
    const latestCategory = oldCategories.value
      .toSorted((a, b) => Math.abs(b.id) - Math.abs(a.id))
      .at(0)

    const newIndex = ((latestCategory?.id || 0) + index + 1);

    return newIndex
  }

  return { create: mutate, isLoading }
}

interface CreateNewCategoryParam {
  category: Category;
  index: number;
}