<script setup lang="ts">
import { useLoginCore } from '@/core/login-core';
import { LoginRequestSchema } from '@/utils/schemas/login-request';

const { loginRequest, onSubmit, isFetching } = useLoginCore()
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
            <PasswordInput v-model="loginRequest.password" />
          </UFormField>
        </section>

        <template #footer>
          <UButton variant="solid" color="primary" type="submit" :disabled="isFetching" block>
            Login

            <template v-if="isFetching" #leading>
              <LoadingSpinner />
            </template>
          </UButton>
        </template>

      </UCard>

    </UForm>
  </section>
</template>
