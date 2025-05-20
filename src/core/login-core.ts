import { ApiResponseData } from '@/utils/dtos/ApiResponse';
import { LoginResponse } from '@/utils/dtos/LoginResponse';

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
