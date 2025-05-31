
import { useAuthStore } from '@/stores/auth';
import { createFetch } from '@vueuse/core';
import { ApiResponse, ApiResponseData } from '../dtos/ApiResponse';
import { LoginResponse } from '../dtos/LoginResponse';
import router from '@/router';
import { ROUTE_NAMES } from '@/router/routes';

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

      ctx.data = JSON.parse(ctx.data);


      return ctx
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

          return ctx
        }

        return new Promise((resolve) => {
          refreshSubscribers.push(async () => {
            try {
              const retryResponse = await ctx.execute()
              resolve(retryResponse)
            } catch (error) {
              if ((error as { response: { status: number } }).response?.status === 401) {
                const authStore = useAuthStore()
                authStore.reset()
                await router.push({ name: ROUTE_NAMES.LOGIN })
                resolve(ctx)
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

                return ctx
              }
            }
          })

          if (!isRefreshing) {
            isRefreshing = true

            if (!authStore.token && !authStore.user) {
              router.push({ name: ROUTE_NAMES.LOGIN })
              return;
            }

            const performRefresh = async () => {
              try {
                const { data, execute } = useApiFetch<string>('auth/refresh', {
                  immediate: false,
                }).post()

                await execute()

                if (data.value) {
                  const response = new ApiResponseData(data.value, LoginResponse)
                  authStore.setToken(response.data.token)

                  const callbacks = [...refreshSubscribers]
                  refreshSubscribers.length = 0

                  callbacks.forEach(callback => callback())
                } else {
                  authStore.reset()
                  await router.push({ name: ROUTE_NAMES.LOGIN })
                }
              } catch (error) {
                authStore.reset()
                await router.push({ name: ROUTE_NAMES.LOGIN })
              } finally {
                isRefreshing = false
              }
            }

            performRefresh()
          }
        })
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

        return ctx
      }
    },
  }
})
