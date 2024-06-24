import { useToast } from '@/components/ui/toast';
import { CustomException } from '@/exceptions/CustomException';
import { useRequest } from '@/lib/request';
import { LoginRequest, LoginResponse } from '@/schemas/AuthSchema';
import { BaseResponse } from '@/schemas/BaseResponseSchema';
import { defineStore } from 'pinia';
import { useAppStore } from './appStore';


export const useAuthStore = defineStore('auth', () => {
  const request = useRequest();
  const { toast } = useToast();
  const appStore = useAppStore();

  async function login(payload: LoginRequest) {
    try {
      const response = await request.POST<LoginResponse, LoginRequest>('/auth/login', payload)

      localStorage.setItem('sewapesta-token', response.data.token)
      toast({
        description: response.messages,
        variant: 'success',
      })
      return Promise.resolve()
    } catch (error) {
      appStore.handleError(error)
      return Promise.reject()
    }
  }


  async function logout() {
    try {
      const response = await request.DELETE<BaseResponse>('/auth/logout')

      localStorage.removeItem('sewapesta-token')
      toast({
        description: response.messages,
        variant: 'success',
      })
      return Promise.resolve()
    } catch (error) {
      appStore.handleError(error)
      return Promise.reject()
    }
  }

  return {
    login,
    logout,
  }
})