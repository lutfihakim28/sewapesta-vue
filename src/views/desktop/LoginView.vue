<script setup lang="ts">
import { useApiFetch } from '@/utils/composables/api-fetch';
import { type LoginRequest, LoginRequestSchema } from '@/utils/schemas/login-request';
import type { FormSubmitEvent } from '@nuxt/ui';
import { reactive } from 'vue';

const loginRequest = reactive<Partial<LoginRequest>>({
  password: undefined,
  username: undefined
})

const { execute } = useApiFetch('auth/login', { immediate: false }).post(loginRequest)

async function onSubmit(event: FormSubmitEvent<LoginRequest>) {
  console.log(event.data)
  await execute()
}
</script>

<template>
  <section class="grid place-content-center h-dvh">
    <UForm :schema="LoginRequestSchema" :state="loginRequest" @submit="onSubmit">
      <UCard variant="subtle" :ui="{ root: 'w-sm' }">
        <template #header>
          <h4 class="text-xl font-medium">Login</h4>
        </template>

        <section class="space-y-4">
          <UFormField label="Username" name="username">
            <UInput v-model="loginRequest.username" :ui="{ root: 'w-full' }" />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="loginRequest.password" type="password" :ui="{ root: 'w-full' }" />
          </UFormField>
        </section>
        
        <template #footer>
          <UButton variant="solid" color="primary" type="submit" block>Login</UButton>
        </template>

      </UCard>
        
    </UForm>
  </section>
</template>