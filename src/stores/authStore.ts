import { useToast } from '@/components/ui/toast';
import { CustomException } from '@/exceptions/CustomException';
import { useRequest } from '@/lib/request';
import { LoginRequest, LoginResponse, LogoutResponse } from '@/schemas/AuthSchema';
import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', () => {
  const request = useRequest();
  const { toast } = useToast();

  async function login(payload: LoginRequest) {
    try {
      const response = await request.POST<LoginResponse, LoginRequest>('/auth/login', payload)

      localStorage.setItem('sewapesta-token', response.data.token)
      toast({
        description: response.messages[0],
        variant: 'success',
      })
      return Promise.resolve()
    } catch (error) {
      if (error instanceof CustomException) {
        error.messages.forEach((message) => {
          toast({
            description: message,
            variant: 'destructive'
          })
        })
      }
      return Promise.reject()
    }
  }


  async function logout() {
    try {
      const response = await request.DELETE<LogoutResponse>('/auth/logout')

      localStorage.removeItem('sewapesta-token')
      toast({
        description: response.messages[0],
        variant: 'success',
      })
      return Promise.resolve()
    } catch (error) {
      if (error instanceof CustomException) {
        error.messages.forEach((message) => {
          toast({
            description: message,
            variant: 'destructive'
          })
        })
      }
      return Promise.reject()
    }
  }

  return {
    login,
    logout,
  }
})