import { useAuthStore } from '@/stores/useAuthStore';
import { useLastRouteStore } from '@/stores/useLastRouteStore';
import { ApiResponseData } from '@/dto/ApiResponse';
import { LoginResponse } from '@/dto/LoginResponse';
import { generateLoginRequestSchema } from '@/schemas/login-request';
import { reactive, ref, useTemplateRef, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import { useI18n } from 'vue-i18n';
import type { SchemaType } from '@/types/schema';
import { useAppRouter } from '@/router/useAppRouter';
import { ROUTE_NAMES, type RouteName } from '@/router/constants';
import { useApiFetch } from '@/plugins/api-fetch';

export function useLoginCore() {
  const authStore = useAuthStore();
  const appRouter = useAppRouter()
  const lastRouteStore = useLastRouteStore();
  const apiFetch = useApiFetch();
  const { t, locale } = useI18n();

  const LoginRequestSchema = ref<ReturnType<typeof generateLoginRequestSchema>>(generateLoginRequestSchema(t));

  const loginForm = useTemplateRef<ComponentExposed<typeof UForm>>('login-form');

  const loginRequest = reactive<Partial<SchemaType<typeof LoginRequestSchema.value>>>({
    password: undefined,
    username: undefined
  })

  const { data, isFetching, error, execute } = apiFetch('auth/login', { immediate: false }).post(loginRequest)

  async function onSubmit() {
    await execute();

    if (!error.value) {
      const response = new ApiResponseData(data.value, LoginResponse)

      authStore.setToken(response.data.token)
      appRouter.push({
        name: lastRouteStore.route?.value?.name as RouteName || ROUTE_NAMES.DASHBOARD,
        query: lastRouteStore.route?.value?.query,
      })
    }
  }

  watch(locale, () => {
    LoginRequestSchema.value = generateLoginRequestSchema(t)
    loginForm.value?.clear();
  }, { immediate: true })

  return {
    loginRequest,
    isFetching,
    LoginRequestSchema,
    onSubmit,
    t
  }
}
