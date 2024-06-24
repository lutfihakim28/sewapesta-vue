import { useToast } from '@/components/ui/toast';
import { Employee, EmployeeFilter, ListEmployeeResponse } from '@/schemas/EmployeeSchema';
import { Meta } from '@/schemas/MetaSchema';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAppStore } from './appStore';
import { useRequest } from '@/lib/request';

export const useEmployeeStore = defineStore('employee', () => {
  const { toast } = useToast();
  const appStore = useAppStore();
  const request = useRequest();

  const employees = ref<Array<Employee>>([])
  const employee = ref<Employee>();

  async function getEmployees(query: EmployeeFilter): Promise<Meta> {
    try {
      const response = await request.GET<ListEmployeeResponse, EmployeeFilter>('/private/employees', query);

      employees.value = response.data;

      return Promise.resolve(response.meta);
    } catch (error) {
      appStore.handleError(error);
      return Promise.reject()
    }
  }

  return {
    employee,
    employees,
    getEmployees,
  }
})