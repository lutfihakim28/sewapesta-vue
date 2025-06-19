import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { type Item } from '@/dto/Item'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDeleteItem(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(item: Item) {
      return deleteItem(item)
    },
    onMutate(item: Item) {
      const oldItems: Item[] = queryCache.getQueryData(listQueryKey.value) || []

      const newItems = oldItems.filter((_item) => _item.id !== item.id)

      queryCache.setQueryData(listQueryKey.value, newItems)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldItems, newItems }
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
        title: `Delete Item ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function deleteItem(item: Item): Promise<Item> {
    await apiFetch(`private/items/${item.id}`).delete()
    return item;
  }

  return { deleteItem: mutate, isLoading }
}
