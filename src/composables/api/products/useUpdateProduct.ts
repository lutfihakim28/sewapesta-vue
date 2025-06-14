import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseData } from '@/dto/ApiResponse'
import { Product } from '@/dto/Product'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useUpdateProduct(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(product: Product) {
      return updateProduct(product)
    },
    onMutate(product: Product) {
      const oldProducts: Product[] = queryCache.getQueryData(listQueryKey.value) || []

      let updatedProducts = oldProducts.map((prod) => {
        if (prod.id !== product.id) return prod;
        return {
          ...product,
          loading: true,
        };
      })

      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      if (searchParams.has('keyword') && !product.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
        updatedProducts = updatedProducts.filter((prod) => prod.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase()))
      }

      queryCache.setQueryData(listQueryKey.value, updatedProducts)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldProducts, updatedProducts, updatedProduct: product }
    },
    async onSettled() {
      await queryCache.invalidateQueries({ key: PRIVATE_QUERY_KEYS.products.root() })
    },
    onError(err, _title, { oldProducts, updatedProducts }) {
      if (
        updatedProducts != null
        && updatedProducts === queryCache.getQueryData(listQueryKey.value)
      ) {
        queryCache.setQueryData(listQueryKey.value, oldProducts)
      }

      console.error(err)

      toast.add({
        title: `Update Product ${_title.id}`,
        description: t('system-error'),
        color: 'error',
      })
    },
  })


  async function updateProduct(product: Product): Promise<Product> {
    const { data } = await apiFetch(`private/products/${product.id}`).put({ name: product.name })

    const response = new ApiResponseData(data.value, Product)

    return response.data;
  }

  return { update: mutate, isLoading }
}
