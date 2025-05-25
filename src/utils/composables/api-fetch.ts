import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { createFetch } from '@vueuse/core'
import { ApiResponse, ApiResponseData } from '../dtos/ApiResponse';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { LoginResponse } from '../dtos/LoginResponse';
import { ref } from 'vue';

const baseUrl = import.meta.env.VITE_API_URL

export function useApiFetch() {
  const authStore = useAuthStore();
  const router = useRouter();

  const isRefreshing = ref(false);
  const refreshSubscribers = ref<Array<() => void>>([])

  const fetch = createFetch({
    baseUrl,
    fetchOptions: {
      credentials: 'include',
    },
    options: {
      async beforeFetch({ options }) {
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

            if (ctx.context.url.includes('auth/refresh')) {
              authStore.setToken('')
              await router.push({ name: 'Login' })
            }

            return ctx
          }

          if (!isRefreshing.value) {
            isRefreshing.value = true

            addRefreshSubscriber(async () => {
              const response = await ctx.execute();

              ctx.response = response;

              return ctx;
            })

            await refreshToken();

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
          isRefreshing.value = false;
        }

        ctx.data = JSON.parse(ctx.data);


        return ctx
      },
    }
  })

  async function refreshToken() {

    if (!authStore.token && !authStore.user) {
      router.push({ name: 'Login' })
      return
    }

    const { data, error, execute } = fetch(`auth/refresh`, { immediate: false }).post()

    await execute();

    if (!error.value) {
      const response = new ApiResponseData(data.value, LoginResponse)
      authStore.setToken(response.data.token)
      refreshSubscribers.value.forEach(callback => callback())
      refreshSubscribers.value.length = 0
    }
  }

  function addRefreshSubscriber(callback: () => void) {
    refreshSubscribers.value.push(callback)
  }

  return {
    fetch
  }
}
