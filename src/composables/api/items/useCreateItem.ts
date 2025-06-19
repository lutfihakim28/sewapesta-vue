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
      const searchParams = getSearchParams();
      const isPartOfFilter = checkIfPartOfFilter({
        item,
        searchParams
      });

      if (!isPartOfFilter) {
        return;
      }

      const oldItems = getOldItems();

      const newItem = new Item({
        ...item,
        loading: true,
        id: 0,
      })

      const newItems = getNewItems({
        item: newItem,
        items: oldItems,
        searchParams
      });

      queryCache.setQueryData(listQueryKey.value, newItems)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldItems, newItems, newItem }
    },
    onSuccess(data, _vars, { newItems, newItem }) {
      if (data && newItems && newItem) {
        const _newItems = [...newItems]
        const index = _newItems.indexOf(newItem)
        if (index === -1) return
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

  function getOldItems(): Item[] {
    return queryCache.getQueryData(listQueryKey.value) || [];
  }

  function getSearchParams(): URLSearchParams {
    const queryString = listQueryKey.value.join().split('?')[1];
    return new URLSearchParams(queryString);
  }

  function checkIfPartOfFilter({ item, searchParams }: ItemSearchParam): boolean {
    if (searchParams.get('page') !== '1' && !searchParams.has('sort')) return false;
    if (searchParams.has('keyword') && !item.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) return false;
    if (searchParams.has('type') && item.type !== searchParams.get('type')) return false;
    if (searchParams.has('categoryId') && item.category.id.toString() !== searchParams.get('categoryId')) return false;
    return true;
  }

  function getNewItems({ item, items: oldItems, searchParams }: NewItemParam): Item[] {
    let newItems = [item, ...oldItems]
    newItems = sortNewItems({ items: newItems, searchParams });
    newItems = popItem({ items: newItems, searchParams });
    return newItems;
  }

  function sortNewItems({ items: newItems, searchParams }: ItemsSearchparam): Item[] {
    if (searchParams.has('sort') && searchParams.has('sortDirection')) {
      const key = searchParams.get('sort') as keyof Item;
      const direction = searchParams.get('sortDirection') as SortDirectionEnum;

      return arraySort({
        array: newItems,
        key,
        direction
      });
    }

    return newItems
  }

  function popItem({ items: newItems, searchParams }: ItemsSearchparam) {
    const _newItems = [...newItems]
    const pageSize = Number(searchParams.get('pageSize') || 10)
    if (_newItems.length >= pageSize) {
      _newItems.pop()
    }

    return _newItems;
  }

  return { create: mutate, isLoading }
}

interface SearchParam {
  searchParams: URLSearchParams
}

interface ItemSearchParam extends SearchParam {
  item: Item
}
interface ItemsSearchparam extends SearchParam {
  items: Item[]
}

type NewItemParam = ItemSearchParam & ItemsSearchparam
