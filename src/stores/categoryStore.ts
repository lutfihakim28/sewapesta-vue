import { CategoryDto } from '@/dtos/CategoryDto';
import { useRequest } from '@/lib/request';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAppStore } from './appStore';
import { ResponseDto } from '@/dtos/ResponseDto';
import { SelectOption } from 'naive-ui';

export const useCategoryStore = defineStore('category', () => {
  const appStore = useAppStore();
  const request = useRequest();

  const categories = ref<Array<CategoryDto>>([])

  const subcategoryOptions = computed(() => {
    return categories.value.flatMap((category) => {
      return category.subcategories.map((subcategory) => {
        const option: SelectOption = {
          label: subcategory.name,
          value: subcategory.id,
        }
        return option;
      })
    })
  })

  async function getCategories() {
    try {
      const response = await request.GET<ResponseDto<Array<CategoryDto>>>('/private/categories');
      categories.value = response.data.map((data) => new CategoryDto(data));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    categories,
    subcategoryOptions,
    getCategories,
  }
})