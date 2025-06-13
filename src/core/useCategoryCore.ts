import { Category } from '@/dto/Category';
import { useListCore } from './parts/useListCore';
import { PRIVATE_QUERY_KEYS } from '@/constants/query-keys';
import { computed } from 'vue';
import { useCreateCategory } from '@/composables/api/categories/useCreateCategory';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue';
import { useDeleteCategory } from '@/composables/api/categories/useDeleteCategory';
import { useUpdateCategory } from '@/composables/api/categories/useUpdateCategory';
import CategoryRequest from '@/components/desktop/CategoryRequest.vue';

export function useCategoryCore() {
  const { isLoading, list, meta, fullPath, refreshData, t } = useListCore({
    key: 'categories',
    dto: Category,
  })

  const overlay = useOverlay();
  const requestModal = overlay.create(CategoryRequest)
  const confirmationModal = overlay.create(DeleteConfirmationModal)

  const listQueryKey = computed(() => PRIVATE_QUERY_KEYS.categories.list(fullPath.value))

  const { create, isLoading: loadingCreate } = useCreateCategory(listQueryKey)
  const { deleteCategory, isLoading: loadingDelete } = useDeleteCategory(listQueryKey)
  const { update, isLoading: loadingUpdate } = useUpdateCategory(listQueryKey)

  const loading = computed(() => isLoading.value || loadingCreate.value || loadingDelete.value || loadingUpdate.value)

  async function openForm(category?: Category) {
    const instance = requestModal.open({
      category,
    })

    const newCategories = await instance.result

    if (newCategories && newCategories.every((category) => category.id === 0)) {
      create(newCategories)
      return;
    }

    if (newCategories) {
      update(newCategories[0])
      return
    }
  }

  async function openConfirmation(category: Category) {
    const instance = confirmationModal.open({
      data: t('category'),
      value: category.name
    })

    const confirmed = await instance.result

    if (confirmed) {
      deleteCategory(category)
    }
  }
  return {
    categories: list,
    meta,
    loading,
    refreshData,
    t,
    openForm,
    openConfirmation,
  }
}
