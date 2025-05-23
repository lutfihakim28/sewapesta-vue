import { User } from '@/utils/dtos/User';
import { useStorage } from '@vueuse/core';
import { useJwt } from '@vueuse/integrations/useJwt';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = useStorage('sewapesta-token', '')
  const { payload } = useJwt(token);

  const user = computed<User | undefined>(() => {
    if (payload.value) {
      return new User((payload.value as { user: User }).user);
    }
    return undefined
  })

  function setToken(_token: string) {
    token.value = _token;
  }

  function reset() {
    token.value = '';
  }

  return {
    token,
    user,
    setToken,
    reset,
  }
})
