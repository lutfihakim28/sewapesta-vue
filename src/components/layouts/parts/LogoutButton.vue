<script setup lang="ts">
const { isFetching, execute } = useApiFetch('auth/logout', { immediate: false }).delete();
const authStore = useAuthStore();
const router = useRouter();

async function logout() {
  await execute()
  router.push({ name: 'Login' })
  authStore.$reset();
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