import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { createFetch, useStorage } from '@vueuse/core'
import { ApiResponse } from '../dtos/ApiResponse';

export const useApiFetch = createFetch({
  baseUrl: 'http://localhost:3000/api',
  options: {
    async beforeFetch({ options }) {
      const token = useStorage('sewapesta-token', '');
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
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
      if (ctx.response.status >= 200 && ctx.response.status < 400) {
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
      return ctx
    },
  }
})