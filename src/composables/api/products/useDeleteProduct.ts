import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { type Product } from '@/dto/Product'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDeleteProduct(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(product: Product) {
      return deleteProduct(product)
    },
    onMutate(product: Product) {
      const oldProducts: Product[] = queryCache.getQueryData(listQueryKey.value) || []

      const newProducts = oldProducts.filter((_product) => _product.id !== product.id)

      queryCache.setQueryData(listQueryKey.value, newProducts)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldProducts, newProducts }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.products.root() })
    },

    onError(err, _title, { oldProducts, newProducts }) {
      if (
        newProducts != null
        && newProducts === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldProducts)
      }

      console.error(err)

      toast.add({
        title: `Delete Product ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function deleteProduct(product: Product): Promise<Product> {
    await apiFetch(`private/products/${product.id}`).delete()
    return product;
  }

  return { deleteProduct: mutate, isLoading }
}
