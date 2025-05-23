import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { createFetch } from '@vueuse/core'
import { ApiResponse, ApiResponseData } from '../dtos/ApiResponse';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { LoginResponse } from '../dtos/LoginResponse';

const baseUrl = 'https://cockatoo-composed-burro.ngrok-free.app/api'
let isRefreshing = false;
const refreshSubscribers: Array<() => void> = []

export const useApiFetch = createFetch({
  baseUrl,
  options: {
    async beforeFetch({ options }) {
      const authStore = useAuthStore();
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

        if (!isRefreshing) {
          isRefreshing = true

          addRefreshSubscriber(async () => {
            const response = await ctx.execute();

            ctx.response = response;

            return ctx;
          })

          await refreshToken();
          onRrefreshed()

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

      ctx.data = JSON.parse(ctx.data);

      return ctx
    },
  }
})

async function refreshToken() {
  const authStore = useAuthStore();
  const router = useRouter();

  if (!authStore.token && !authStore.user) {
    router.push({ name: 'Login' })
    return
  }

  const { data, execute } = useApiFetch(`auth/refresh`, { immediate: false }).put({ userId: authStore.user!.id })

  await execute();
  const response = new ApiResponseData(data.value, LoginResponse)
  authStore.setToken(response.data.token)
}

function onRrefreshed() {
  isRefreshing = false;
  console.log('this', refreshSubscribers)
  refreshSubscribers.forEach(callback => callback())
  refreshSubscribers.length = 0
}

function addRefreshSubscriber(callback: () => void) {
  console.log('Eajsdkja')
  refreshSubscribers.push(callback)
}