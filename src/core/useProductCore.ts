import { Product } from '@/dto/Product';
import { useListCore } from './parts/useListCore';
import ProductRequest from '@/components/desktop/ProductRequest.vue';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue';
import { computed } from 'vue';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { useCreateProduct } from '@/composables/api/products/useCreateProduct';
import { useDeleteProduct } from '@/composables/api/products/useDeleteProduct';
import { useUpdateProduct } from '@/composables/api/products/useUpdateProduct';

export function useProductCore() {
  const { isLoading, list, meta, fullPath, refreshData, t } = useListCore({
    key: 'products',
    dto: Product,
  })

  const overlay = useOverlay();
  const requestModal = overlay.create(ProductRequest)
  const confirmationModal = overlay.create(DeleteConfirmationModal)

  const listQueryKey = computed(() => PRIVATE_QUERY_KEYS.products.list(fullPath.value))

  const { create, isLoading: loadingCreate } = useCreateProduct(listQueryKey)
  const { deleteProduct, isLoading: loadingDelete } = useDeleteProduct(listQueryKey)
  const { update, isLoading: loadingUpdate } = useUpdateProduct(listQueryKey)

  const loading = computed(() => isLoading.value || loadingCreate.value || loadingDelete.value || loadingUpdate.value)

  async function openForm(product?: Product) {
    const instance = requestModal.open({
      product,
    })

    const newProducts = await instance.result

    if (newProducts && newProducts.every((product) => product.id === 0)) {
      create(newProducts)
      return;
    }

    if (newProducts) {
      update(newProducts[0])
      return
    }
  }

  async function openConfirmation(product: Product) {
    const instance = confirmationModal.open({
      data: t('product'),
      value: product.name
    })

    const confirmed = await instance.result

    if (confirmed) {
      deleteProduct(product)
    }
  }
  return {
    products: list,
    meta,
    loading,
    refreshData,
    t,
    openForm,
    openConfirmation,
  }
}
