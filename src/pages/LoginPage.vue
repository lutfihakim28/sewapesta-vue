<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import {
  NLayout,
  NRow,
} from 'naive-ui'
</script>

<template>
  <NLayout has-sider style="height: 100dvh">
    <NRow align-items="center" justify-content="center">
      <LoginForm />
    </NRow>
  </NLayout>
</template>