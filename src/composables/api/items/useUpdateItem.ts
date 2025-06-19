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
      const oldItems = getOldItems();
      const updatedItems = updateOldItems({
        items: oldItems,
        item,
      });
      const filteredItems = applyFilters({
        items: updatedItems,
        searchParams: getSearchParams(),
      });

      queryCache.setQueryData(listQueryKey.value, filteredItems);
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true });

      return { oldItems, updatedItems, updatedItem: item };
    },
    onSuccess(data, _vars, { updatedItems, updatedItem }) {
      if (data && updatedItems && updatedItem) {
        const _updatedItems = [...updatedItems]
        const index = _updatedItems.indexOf(updatedItem)
        if (index === -1) return
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

  function getOldItems(): Item[] {
    return queryCache.getQueryData(listQueryKey.value) || [];
  }

  function updateOldItems({ items: oldItems, item }: UpdateParam): Item[] {
    return oldItems.map((_item) => (_item.id !== item.id) ? _item : new Item({ ...item, loading: true }));
  }

  function getSearchParams(): URLSearchParams {
    const queryString = listQueryKey.value.join().split('?')[1];
    return new URLSearchParams(queryString);
  }

  function applyFilters({ items, searchParams }: ApplyFilterParam): Item[] {
    return items.filter((item) => {
      if (searchParams.has('keyword') && !item.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) return false;
      if (searchParams.has('type') && item.type !== searchParams.get('type')) return false;
      if (searchParams.has('categoryId') && item.category.id.toString() !== searchParams.get('categoryId')) return false;
      return true;
    });
  }

  return { update: mutate, isLoading }
}

interface ItemsParam {
  items: Item[]
}

interface UpdateParam extends ItemsParam {
  item: Item
}

interface ApplyFilterParam extends ItemsParam {
  searchParams: URLSearchParams
}
