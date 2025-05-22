import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { createFetch } from '@vueuse/core'
import { ApiResponse } from '../dtos/ApiResponse';
import { useAuthStore } from '@/stores/auth';

export const useApiFetch = createFetch({
  baseUrl: 'https://cockatoo-composed-burro.ngrok-free.app/api',
  options: {
    async beforeFetch({ options }) {
      const tokenStore = useAuthStore();
      if (tokenStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenStore.token}`,
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
        // TODO: Handle Unauth exception
        console.log('TODO: Handle Unauth exception')
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
      if (ctx.response.status >= 200 && ctx.response.status < 400 && ctx.context.options.method !== 'GET') {
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