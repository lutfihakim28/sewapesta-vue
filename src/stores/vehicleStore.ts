import { defineStore } from 'pinia';
import { useAppStore } from './appStore';
import { useRequest } from '@/lib/request';
import { ref } from 'vue';
import { VehicleDto } from '@/dtos/VehicleDto';
import { ResponseDto } from '@/dtos/ResponseDto';

export const useVehicleStore = defineStore('vehicle', () => {
  const appStore = useAppStore();
  const request = useRequest();

  const vehicles = ref<Array<VehicleDto>>([])

  async function getVehicles(): Promise<void> {
    try {
      const response = await request.GET<ResponseDto<Array<VehicleDto>, null>>('/private/vehicles');
      vehicles.value = response.data.map((data) => new VehicleDto(data));
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    vehicles,
    getVehicles,
  }
})