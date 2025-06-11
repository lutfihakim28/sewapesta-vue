import { STORAGE_LOCALE_KEY } from '@/constants/locales';
import { ApiResponse, ApiResponseData } from '@/dto/ApiResponse';
import { LoginResponse } from '@/dto/LoginResponse';
import { i18n } from '@/i18n/i18n';
import { ROUTE_NAMES } from '@/router/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { createFetch, useStorage } from '@vueuse/core';
import { inject, ref, type InjectionKey, type Plugin } from 'vue';
import type { Composer } from 'vue-i18n';
import type { Router } from 'vue-router';

type ApiFetchOption = {
  router: Router
}

export const fetchKey: InjectionKey<ReturnType<typeof createFetch>> = Symbol();

export const apiFetch: Plugin<ApiFetchOption> = {
  install(app, options) {
    const baseUrl = import.meta.env.VITE_API_URL
    const isRefreshing = ref(false)
    const refreshSubscribers = ref<Array<() => void>>([])
    const router = options.router

    const _apiFetch = createFetch({
      baseUrl,
      fetchOptions: {
        credentials: 'include',
      },
      options: {
        async beforeFetch({ options, url }) {
          const authStore = useAuthStore()
          const locale = useStorage(STORAGE_LOCALE_KEY, 'en')
          if (authStore.token) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${authStore.token}`,
              'ngrok-skip-browser-warning': '69420'
            }
          }
          const newUrl = new URL(url)
          newUrl.searchParams.append('lang', locale.value)
          return { options, url: newUrl.toString() };
        },
        async afterFetch(ctx) {
          const { t } = i18n.global as Composer
          if (ctx.response.status >= 200 && ctx.response.status < 400 && ctx.context.options.method !== 'GET' && !ctx.context.url.includes('auth/refresh')) {
            const response = new ApiResponse(JSON.parse(ctx.data));
            const toast = useToast()

            for (const message of response.messages) {
              toast.add({
                title: t('Success'),
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
              if (ctx.context.options.method?.toLowerCase() !== 'get') {
                refreshSubscribers.value.push(async () => {
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
              }

              if (!isRefreshing.value) {
                if (!authStore.token && !authStore.user) {
                  router.push({ name: ROUTE_NAMES.LOGIN })
                  return;
                }

                const performRefresh = async () => {
                  try {
                    isRefreshing.value = true
                    const { data, execute } = _apiFetch<string>('auth/refresh', {
                      immediate: false,
                    }).post()

                    await execute()

                    if (data.value) {
                      const response = new ApiResponseData(data.value, LoginResponse)
                      authStore.setToken(response.data.token)

                      refreshSubscribers.value.forEach(callback => callback())
                    } else {
                      authStore.reset()
                      await router.push({ name: ROUTE_NAMES.LOGIN })
                    }
                  } catch (error) {
                    authStore.reset()
                    await router.push({ name: ROUTE_NAMES.LOGIN })
                    console.error(error)
                  } finally {
                    isRefreshing.value = false
                    refreshSubscribers.value = []
                  }
                }

                performRefresh()
              }
            })
          } else if (ctx.response?.status !== 422) {
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
          return ctx
        },
      }
    })

    app.provide(fetchKey, _apiFetch)
  }
}

export function useApiFetch() {
  const apiFetch = inject(fetchKey)

  if (!apiFetch) {
    throw new Error('useApiFetch need ApiFetchPlugin to be installed')
  }

  return apiFetch
}