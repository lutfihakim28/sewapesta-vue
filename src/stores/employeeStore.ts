import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAppStore } from './appStore';
import { useRequest } from '@/lib/request';
// import { useMessage } from 'naive-ui';
import { EmployeeDto } from '@/dtos/EmployeeDto';
import { ResponseDto } from '@/dtos/ResponseDto';
import { EmployeeQueryDto } from '@/dtos/EmployeeQueryDto';
import { PaginationDto } from '@/dtos/PaginationDto';

export const useEmployeeStore = defineStore('employee', () => {
  // const message = useMessage();
  const appStore = useAppStore();
  const request = useRequest();

  const employees = ref<Array<EmployeeDto>>([])
  const employee = ref<EmployeeDto>();

  async function getEmployees(query: EmployeeQueryDto): Promise<PaginationDto> {
    try {
      const qs = { ...query };
      const response = await request.GET<ResponseDto<Array<EmployeeDto>, PaginationDto>, typeof qs>('/private/employees', qs);
      employees.value = response.data.map((data) => new EmployeeDto(data));
      return Promise.resolve(new PaginationDto(response.meta))
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject(error);
    }
  }

  return {
    employee,
    employees,
    getEmployees,
  }
})