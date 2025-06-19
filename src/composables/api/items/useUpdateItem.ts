import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Item } from '@/dto/Item'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateItem(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(item: Item) {
      return updateItem(item)
    },
    onMutate(item: Item) {
      const oldItems: Item[] = queryCache.getQueryData(listQueryKey.value) || []

      let updatedItems = oldItems.map((_item) => {
        if (_item.id !== item.id) return _item;
        return {
          ...item,
          loading: true,
        };
      })

      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      if (searchParams.has('keyword') && !item.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
        updatedItems = updatedItems.filter((_item) => _item.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase()))
      }

      queryCache.setQueryData(listQueryKey.value, updatedItems)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldItems, updatedItems, updatedItem: item }
    },
    onSuccess(data, _vars, { updatedItems, updatedItem }) {
      if (data && updatedItems && updatedItem) {
        const _updatedItems = [...updatedItems]
        const index = _updatedItems.indexOf(updatedItem)
        _updatedItems[index] = data

        queryCache.setQueryData(listQueryKey.value, _updatedItems)
      }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.items.root() })
    },
    onError(err, _title, { oldItems, updatedItems }) {
      if (
        updatedItems != null
        && updatedItems === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldItems)
      }

      console.error(err)

      toast.add({
        title: `Update Item ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    },
  })


  async function updateItem(item: Item): Promise<Item> {
    const { data } = await apiFetch(`private/items/${item.id}`).put(item.json())

    const response = new ApiResponseData(data.value, Item)

    return response.data;
  }

  return { update: mutate, isLoading }
}
