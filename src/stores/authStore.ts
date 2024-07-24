import { useRequest } from '@/utils/request';
import { defineStore } from 'pinia';
import { useAppStore } from './appStore';
import { useMessage } from 'naive-ui';
import { LoginRequestDto } from '@/dtos/LoginRequestDto';
import { ResponseDto } from '@/dtos/ResponseDto';
import { LoginDto } from '@/dtos/LoginDto';


export const useAuthStore = defineStore('auth', () => {
  const request = useRequest();
  const message = useMessage();
  const appStore = useAppStore();

  async function login(payload: LoginRequestDto) {
    try {
      const response = await request.POST<ResponseDto<LoginDto, null>, LoginRequestDto>('/auth/login', payload)

      localStorage.setItem('sewapesta-token', response.data.token)
      message.success(response.messages)
      return Promise.resolve()
    } catch (error) {
      appStore.handleError(error)
      return Promise.reject()
    }
  }


  async function logout() {
    try {
      const response = await request.DELETE<ResponseDto<null, null>>('/auth/logout')

      localStorage.removeItem('sewapesta-token')
      message.success(response.messages)
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