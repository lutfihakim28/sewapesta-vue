import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys'
import { ApiResponseList } from '@/dto/ApiResponse'
import { Product } from '@/dto/Product'
import { useApiFetch } from '@/plugins/api-fetch'
import { useMutation, useQueryCache, type EntryKey } from '@pinia/colada'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useCreateProduct(listQueryKey: Ref<EntryKey>) {
  const apiFetch = useApiFetch()
  const queryCache = useQueryCache()
  const toast = useToast();
  const { t } = useI18n();

  const { mutate, isLoading } = useMutation({
    mutation(products: Product[]) {
      return createProduct(products)
    },
    onMutate(products: Product[]) {
      const searchParams = new URLSearchParams(
        listQueryKey.value
          .join()
          .split('?')
        [1]
      )

      const oldProducts: Product[] = queryCache.getQueryData(listQueryKey.value) || []

      let newProducts = [...oldProducts];
      const latestProducts: Product[] = [];

      products.forEach((product, index) => {
        if (searchParams.get('page') !== '1') {
          return;
        }

        if (searchParams.has('keyword') && !product.name.toLowerCase().includes(searchParams.get('keyword')!.toLowerCase())) {
          return
        }

        const latestProduct = oldProducts
          .toSorted((a, b) => Math.abs(b.id) - Math.abs(a.id))
          .at(0)

        const newIndex = ((latestProduct?.id || 0) + index + 1);

        const newProduct = new Product({
          ...product,
          loading: true,
          id: newIndex,
        })

        newProducts.pop()

        latestProducts.push(newProduct)
        newProducts = [newProduct, ...newProducts]
      })


      queryCache.setQueryData(listQueryKey.value, newProducts)
      queryCache.cancelQueries({ key: listQueryKey.value, exact: true })

      return { oldProducts, newProducts, latestProducts }
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
        title: 'Create Product',
        description: t('system-error'),
        color: 'error',
      })
    }
  })


  async function createProduct(products: Product[]): Promise<Product[]> {
    const { data } = await apiFetch<ApiResponseList<Product>>('private/products/many').post({
      names: products.map((product) => product.name)
    })

    const response = new ApiResponseList({
      ...data.value,
      meta: {
        total: 0
      }
    }, Product)

    return response.data;
  }

  return { create: mutate, isLoading }
}
