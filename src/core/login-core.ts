import { useAuthStore } from '@/stores/auth';
import { useLastRouteStore } from '@/stores/last-route';
import { useApiFetch } from '@/utils/composables/api-fetch';
import { ApiResponseData } from '@/utils/dtos/ApiResponse';
import { LoginResponse } from '@/utils/dtos/LoginResponse';
import type { LoginRequest } from '@/utils/schemas/login-request';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export function useLoginCore() {
  const authStore = useAuthStore();
  const router = useRouter()
  const lastRouteStore = useLastRouteStore();

  const loginRequest = reactive<Partial<LoginRequest>>({
    password: undefined,
    username: undefined
  })

  const { data, isFetching, execute } = useApiFetch('auth/login', { immediate: false }).post(loginRequest)

  async function onSubmit() {
    await execute();
    const response = new ApiResponseData(data.value, LoginResponse)

    authStore.setToken(response.data.token)
    router.push({
      path: lastRouteStore.route?.path || '/',
      query: lastRouteStore.route?.query,
    })
  }

  return {
    loginRequest,
    isFetching,
    onSubmit,
  }
}
