import { useAuthStore } from '@/stores/useAuthStore';
import { useLastRouteStore } from '@/stores/useLastRouteStore';
import { ApiResponseData } from '@/dtos/ApiResponse';
import { LoginResponse } from '@/dtos/LoginResponse';
import { generateLoginRequestSchema } from '@/schemas/login-request';
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import UForm from '@nuxt/ui/runtime/components/Form.vue'
import { useApiFetch } from '@/composables/useApiFetch';
import { useI18n } from 'vue-i18n';
import type { SchemaType } from '@/types/schema';
import { useAppRouter } from '@/router/useAppRouter';
import { ROUTE_NAMES, type RouteName } from '@/router/constants';

export function useLoginCore() {
  const authStore = useAuthStore();
  const appRouter = useAppRouter()
  const lastRouteStore = useLastRouteStore();
  const { t, locale } = useI18n();

  const LoginRequestSchema = ref<ReturnType<typeof generateLoginRequestSchema>>(generateLoginRequestSchema(t));

  const loginForm = useTemplateRef<ComponentExposed<typeof UForm>>('login-form');
  const usernameInput = useTemplateRef<ComponentExposed<typeof UInput>>('username-input');

  onMounted(() => {
    if (usernameInput.value) {
      usernameInput.value.inputRef?.focus()
    }
  })

  const loginRequest = reactive<Partial<SchemaType<typeof LoginRequestSchema.value>>>({
    password: undefined,
    username: undefined
  })

  const { data, isFetching, error, execute } = useApiFetch('auth/login', { immediate: false }).post(loginRequest)

  async function onSubmit() {
    await execute();

    if (!error.value) {
      const response = new ApiResponseData(data.value, LoginResponse)

      authStore.setToken(response.data.token)
      appRouter.push({
        name: lastRouteStore.route?.name as RouteName || ROUTE_NAMES.DASHBOARD,
        query: lastRouteStore.route?.query,
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
