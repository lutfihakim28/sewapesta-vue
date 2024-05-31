<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginRequestSchema } from '@/schemas/AuthSchema';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const loginSchema = toTypedSchema(LoginRequestSchema);

const passwordType = ref<'password' | 'text'>('password');

const form = useForm({
  validationSchema: loginSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  await authStore.login(values);
  router.push('/')
})

function showHidePassword() {
  if (passwordType.value === 'password') {
    passwordType.value = 'text';
    return;
  }

  if (passwordType.value === 'text') {
    passwordType.value = 'password';
    return;
  }
}
</script>

<template>
  <section
    class="w-full h-dvh flex items-center justify-center bg-gradient-to-br from-primary/20 via-10% via-primary-foreground to-primary/60">
    <form @submit.prevent="onSubmit">
      <Card class="w-96">
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>Masuk menggunakan nama pengguna anda</CardDescription>
        </CardHeader>
        <CardContent>
          <section class="flex flex-col gap-y-2">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Nama Pengguna</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Masukkan nama pengguna" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Kata Sandi</FormLabel>
                <FormControl>
                  <section class="relative">
                    <Input :type="passwordType" placeholder="********" v-bind="componentField" class="relative pr-14" />
                    <Button type="button" class="absolute top-1/2 -translate-y-1/2 right-0" variant="ghost"
                      @click="showHidePassword">
                      <Icon :icon="passwordType === 'password' ? 'radix-icons:eye-closed' : 'radix-icons:eye-open'"
                        class="opacity-50" />
                    </Button>
                  </section>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </section>
        </CardContent>
        <CardFooter>
          <Button type="submit" class="w-full">Masuk</Button>
        </CardFooter>
      </Card>
    </form>
  </section>
</template>