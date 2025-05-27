import { useAuthStore } from '@/stores/auth';
import { useLastRouteStore } from '@/stores/last-route';
import { ApiResponseData } from '@/utils/dtos/ApiResponse';
import { LoginResponse } from '@/utils/dtos/LoginResponse';
import type { LoginRequest } from '@/utils/schemas/login-request';
import { onMounted, reactive, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { useRouter } from 'vue-router';
import UInput from '@nuxt/ui/runtime/components/Input.vue'
import { useApiFetch } from '@/utils/composables/useApiFetch';

export function useLoginCore() {
  const authStore = useAuthStore();
  const router = useRouter()
  const lastRouteStore = useLastRouteStore();

  const usernameInput = useTemplateRef<ComponentExposed<typeof UInput>>('username-input');

  onMounted(() => {
    if (usernameInput.value) {
      usernameInput.value.inputRef?.focus()
    }
  })

  const loginRequest = reactive<Partial<LoginRequest>>({
    password: undefined,
    username: undefined
  })

  const { data, isFetching, error, execute } = useApiFetch('auth/login', { immediate: false }).post(loginRequest)

  async function onSubmit() {
    await execute();

    if (!error.value) {
      const response = new ApiResponseData(data.value, LoginResponse)

      authStore.setToken(response.data.token)
      router.push({
        path: lastRouteStore.route?.path || '/',
        query: lastRouteStore.route?.query,
      })
    }
  }

  return {
    loginRequest,
    isFetching,
    onSubmit,
  }
}
