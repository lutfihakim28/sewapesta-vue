
import { useAuthStore } from '@/stores/auth';
import { createFetch } from '@vueuse/core';
import { ApiResponse, ApiResponseData } from '../dtos/ApiResponse';
import { LoginResponse } from '../dtos/LoginResponse';
import router from '@/router';

const baseUrl = import.meta.env.VITE_API_URL
let isRefreshing = false;
const refreshSubscribers: Array<() => void> = []

export const useApiFetch = createFetch({
  baseUrl,
  fetchOptions: {
    credentials: 'include',
  },
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
          'ngrok-skip-browser-warning': '69420'
        }
      }
      return { options };
    },
    async onFetchError(ctx) {
      const authStore = useAuthStore()

      if (ctx.response?.status === 401) {
        if (ctx.context.url.includes('auth')) {
          const response = new ApiResponse(JSON.parse(ctx.data));
          const toast = useToast()

          for (const message of response.messages) {
            toast.add({
              title: `Error ${response.code}`,
              description: message,
              color: 'error'
            })
          }

          if (ctx.context.url.includes('auth/refresh')) {
            authStore.reset()
            await router.push({ name: 'Login' })
            return ctx;
          }

          return ctx
        }

        if (!isRefreshing) {
          isRefreshing = true

          refreshSubscribers.push(async () => {
            const response = await ctx.execute();

            ctx.response = response;

            return ctx;
          })

          if (!authStore.token && !authStore.user) {
            await router.push({ name: 'Login' })
            return ctx;
          }

          const { data, error, execute } = useApiFetch(`auth/refresh`, { immediate: false }).post()

          await execute();

          if (!error.value) {
            const response = new ApiResponseData(data.value, LoginResponse)
            authStore.setToken(response.data.token)
            refreshSubscribers.forEach(callback => callback())
            refreshSubscribers.length = 0
          }

          return ctx;
        }
        return ctx;
      } else {
        const response = new ApiResponse(JSON.parse(ctx.data));
        const toast = useToast()

        for (const message of response.messages) {
          toast.add({
            title: `Error ${response.code}`,
            description: message,
            color: 'error'
          })
        }
      }

      return ctx
    },
    async afterFetch(ctx) {
      if (ctx.response.status >= 200 && ctx.response.status < 400 && ctx.context.options.method !== 'GET' && !ctx.context.url.includes('auth/refresh')) {
        const response = new ApiResponse(JSON.parse(ctx.data));
        const toast = useToast()

        for (const message of response.messages) {
          toast.add({
            title: `Success`,
            description: message,
            color: 'success'
          })
        }
      }
      isRefreshing = false;

      ctx.data = JSON.parse(ctx.data);


      return ctx
    },
  }
})