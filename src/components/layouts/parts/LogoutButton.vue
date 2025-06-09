<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTE_NAMES } from '@/router/constants';
import { useAppRouter } from '@/router/useAppRouter';
import { useApiFetch } from '@/plugins/api-fetch';

const apiFetch = useApiFetch()

const { isFetching, error, execute } = apiFetch('auth/logout', { immediate: false }).delete();
const authStore = useAuthStore();
const appRouter = useAppRouter();

async function logout() {
  await execute()
  if (!error.value) {
    appRouter.push({ name: ROUTE_NAMES.LOGIN })
    authStore.reset();
  }
}
</script>

<template>
  <UButton variant="outline" color="error" @click="logout">
    <template #leading>
      <LoadingSpinner v-if="isFetching" class="size-5" />
      <UIcon v-else name="i-lucide-log-out" class="size-5" />
    </template>
  </UButton>
</template>
