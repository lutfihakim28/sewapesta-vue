import { CategoryDto } from '@/dtos/CategoryDto';
import { useRequest } from '@/utils/request';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAppStore } from './appStore';
import { ResponseDto } from '@/dtos/ResponseDto';
import { SelectOption, useMessage } from 'naive-ui';
import { CategoryRequestDto } from '@/dtos/CategoryRequestDto';
import { messages } from '@/constants/messages';
import { SubcategoryRequestDto } from '@/dtos/SubcategoryRequestDto';

export const useCategoryStore = defineStore('category', () => {
  const appStore = useAppStore();
  const request = useRequest();
  const message = useMessage();

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

  async function createCategory(payload: CategoryRequestDto) {
    try {
      await request.POST<void, CategoryRequestDto>('/private/categories', payload);
      message.success(messages.create('Kategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function updateCategory(categoryId: number, payload: CategoryRequestDto) {
    try {
      await request.PUT<void, CategoryRequestDto>(`/private/categories/${categoryId}`, payload);
      message.success(messages.update('Kategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function deleteCategory(categoryId: number) {
    try {
      await request.DELETE<void>(`/private/categories/${categoryId}`);
      message.success(messages.delete('Kategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function createSubcategory(payload: SubcategoryRequestDto) {
    try {
      await request.POST<void, SubcategoryRequestDto>('/private/subcategories', payload);
      message.success(messages.create('Subkategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function updateSubcategory(subcategoryId: number, payload: SubcategoryRequestDto) {
    try {
      await request.PUT<void, SubcategoryRequestDto>(`/private/subcategories/${subcategoryId}`, payload);
      message.success(messages.update('Subkategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function deleteSubcategory(subcategoryId: number) {
    try {
      await request.DELETE<void>(`/private/subcategories/${subcategoryId}`);
      message.success(messages.delete('Subkategori'));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    categories,
    subcategoryOptions,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  }
})