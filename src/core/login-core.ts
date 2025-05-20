import type { FormSubmitEvent } from '@nuxt/ui'

export function useLoginCore() {
  const loginRequest = reactive<Partial<LoginRequest>>({
    password: undefined,
    username: undefined
  })

  const { execute } = useApiFetch('auth/login', { immediate: false }).post(loginRequest)

  async function onSubmit(event: FormSubmitEvent<LoginRequest>) {
    console.log(event.data)
    await execute()
  }

  return {
    loginRequest,
    onSubmit,
  }
}
