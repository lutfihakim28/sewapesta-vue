<script setup lang="ts">
import { ref } from 'vue';

const modelValue = defineModel<string>();

const show = ref(false)
</script>

<template>
  <UInput
    v-model="modelValue"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pe-1', root: 'w-full' }"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
