import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Item } from '@/dto/Item'
import type { SortDirectionEnum } from '@/enums/sort-by'
import { arraySort } from '@/helpers/array-sort'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateItem(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(item: Item) {
      return createItem(item)
    },
    onMutate(item: Item) {
      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      const oldItems: Item[] = queryCache.getQueryData(listQueryKey.value) || []

      let newItems = [...oldItems];

      if (searchParams.get('page') !== '1' && !searchParams.has('sort')) {
        return;
      }

      if (searchParams.has('keyword') && !item.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
        return;
      }

      const newItem = new Item({
        ...item,
        loading: true,
        id: 0,
      })

      newItems = [newItem, ...newItems]

      if (searchParams.has('sort') && searchParams.has('sortDirection')) {
        const key = searchParams.get('sort') as keyof Item;
        const direction = searchParams.get('sortDirection') as SortDirectionEnum;

        newItems = arraySort({
          array: newItems,
          key,
          direction
        });
      }

      const pageSize = Number(searchParams.get('pageSize') || 10)
      if (newItems.length >= pageSize) {
        newItems.pop()
      }

      queryCache.setQueryData(listQueryKey.value, newItems)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldItems, newItems, newItem }
    },
    onSuccess(data, _vars, { newItems, newItem }) {
      if (data && newItems && newItem) {
        const _newItems = [...newItems]
        const index = _newItems.indexOf(newItem)
        _newItems[index] = data

        queryCache.setQueryData(listQueryKey.value, _newItems)
      }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.items.root() })
    },

    onError(err, _title, { oldItems, newItems }) {
      if (
        newItems != null
        && newItems === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldItems)
      }

      console.error(err)

      toast.add({
        title: 'Create Item',
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function createItem(item: Item): Promise<Item> {
    const { data } = await apiFetch<ApiResponseData<Item>>('private/items').post(item.json())

    const response = new ApiResponseData(data.value, Item)

    return response.data;
  }

  return { create: mutate, isLoading }
}
