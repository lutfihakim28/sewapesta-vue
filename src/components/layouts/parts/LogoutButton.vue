<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useApiFetch } from '@/utils/composables/useApiFetch';
import { ROUTE_NAMES } from '@/router/routes';

const { isFetching, error, execute } = useApiFetch('auth/logout', { immediate: false }).delete();
const authStore = useAuthStore();
const router = useRouter();

async function logout() {
  await execute()
  if (!error.value) {
    router.push({ name: ROUTE_NAMES.LOGIN })
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
