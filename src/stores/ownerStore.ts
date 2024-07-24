import { defineStore } from 'pinia';
import { useAppStore } from './appStore';
import { useRequest } from '@/utils/request';
import { ref } from 'vue';
import { OwnerDto } from '@/dtos/OwnerDto';
import { OwnerQueryDto } from '@/dtos/OwnerQueryDto';
import { PaginationDto } from '@/dtos/PaginationDto';
import { ResponseDto } from '@/dtos/ResponseDto';

export const useOwnerStore = defineStore('owner', () => {
  const appStore = useAppStore();
  const request = useRequest();

  const owners = ref<Array<OwnerDto>>([])

  async function getOwners(query: OwnerQueryDto): Promise<PaginationDto> {
    try {
      const qs = { ...query };
      const response = await request.GET<ResponseDto<Array<OwnerDto>, PaginationDto>, typeof qs>('/private/owners', qs);
      owners.value = response.data.map((data) => new OwnerDto(data));
      return Promise.resolve(new PaginationDto(response.meta!))
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    owners,
    getOwners,
  }
})