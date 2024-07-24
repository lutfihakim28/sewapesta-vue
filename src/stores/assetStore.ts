import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAppStore } from './appStore';
import { useRequest } from '@/utils/request';
// import { useMessage } from 'naive-ui';
import { AssetDto } from '@/dtos/AssetDto';
import { ResponseDto } from '@/dtos/ResponseDto';
import { AssetQueryDto } from '@/dtos/AssetQueryDto';
import { PaginationDto } from '@/dtos/PaginationDto';
import { AssetOvertimePatchDto } from '@/dtos/AssetOvertimePatchDto';
import { useMessage } from 'naive-ui';

export const useAssetStore = defineStore('asset', () => {
  const appStore = useAppStore();
  const request = useRequest();
  const message = useMessage();

  const assets = ref<Array<AssetDto>>([])
  const asset = ref<AssetDto>();

  async function getAssets(query: AssetQueryDto): Promise<PaginationDto> {
    try {
      const qs = { ...query };
      const response = await request.GET<ResponseDto<Array<AssetDto>, PaginationDto>, typeof qs>('/private/items', qs);
      assets.value = response.data.map((data) => new AssetDto(data));
      return Promise.resolve(new PaginationDto(response.meta!))
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  async function patchOvertime(id: number, payload: AssetOvertimePatchDto): Promise<void> {
    try {
      const response = await request.PATCH<ResponseDto<null, null>, AssetOvertimePatchDto>(`/private/items/${id}/overtime`, payload)
      message.success(response.messages);
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    asset,
    assets,
    getAssets,
    patchOvertime,
  }
})