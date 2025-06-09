<script setup lang="ts">
import { useLoginCore } from '@/core/useLoginCore';

const { loginRequest, onSubmit, t, isFetching, LoginRequestSchema } = useLoginCore()
</script>

<template>
  <section class="grid place-content-center h-dvh">
    <UForm ref="login-form" :schema="LoginRequestSchema" :state="loginRequest" @submit="onSubmit">
      <UCard :ui="{ root: 'w-xs bg-transparent' }">
        <template #header>
          <h4 class="text-xl font-medium">Login</h4>
        </template>

        <section class="space-y-4">
          <UFormField :label="t('field.Username')" name="username">
            <UInput v-model="loginRequest.username" :ui="{ root: 'w-full' }" />
          </UFormField>

          <UFormField :label="t('field.Password')" name="password">
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
