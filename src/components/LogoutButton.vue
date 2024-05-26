<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router';

const router = useRouter()

function logout() {
  router.push('/login')
}
</script>

<template>
  <Button variant="ghost" @click="logout">
    <Icon icon="radix-icons:exit" class="h-[1.2rem] w-[1.2rem] text-destructive" />
  </Button>
</template>