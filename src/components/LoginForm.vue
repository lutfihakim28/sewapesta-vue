<script setup lang="ts">
import { LoginRequestDto } from '@/dtos/LoginRequestDto';
import { loginRequestRule } from '@/rules/loginRequestRule';
import { useAuthStore } from '@/stores/authStore';
import { useRouteNameStore } from '@/stores/routeNameStore';
import {
  FormInst,
  NButton,
  NCard,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  useLoadingBar,
  useMessage,
} from 'naive-ui'
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const message = useMessage();
const loadingBar = useLoadingBar();
const router = useRouter();
const authStore = useAuthStore();
const routeNameStore = useRouteNameStore();

const form = ref<FormInst>()
const request = reactive<LoginRequestDto>(new LoginRequestDto())
const disabled = ref(false);

async function login() {
  try {
    disabled.value = true;
    loadingBar.start();
    const result = await form.value?.validate();
    if (!result || !result?.warnings) {
      await authStore.login(request)
      if (routeNameStore.routeName) {
        router.push({ name: routeNameStore.routeName })
      } else {
        router.push('/')
      }
    } else {
      message.error('Data tidak valid.')
    }
  } catch (error) {
    console.error(error);
    loadingBar.error();
  } finally {
    disabled.value = false;
    loadingBar.finish();
  }
}
</script>

<template>
  <NForm
    ref="form"
    :model="request"
    :rules="loginRequestRule"
    @submit.prevent="login"
  >
    <NCard
      style="width: 24rem;"
      size="small"
    >
      <NGrid
        :cols="12"
        style="margin-top: 1rem;"
      >
        <NFormItemGi
          label="Nama Pengguna"
          :span="12"
          path="username"
        >
          <NInput
            v-model:value="request.username"
            placeholder="Ketik nama pengguna..."
          />
        </NFormItemGi>
        <NFormItemGi
          label="Kata Sandi"
          :span="12"
          path="password"
        >
          <NInput
            v-model:value="request.password"
            placeholder="********"
            type="password"
            show-password-on="click"
          />
        </NFormItemGi>
      </NGrid>
      <template #action>
        <NButton
          block
          type="primary"
          attr-type="submit"
          :disabled="disabled"
        >
          Masuk
        </NButton>
      </template>
    </NCard>
  </NForm>
</template>