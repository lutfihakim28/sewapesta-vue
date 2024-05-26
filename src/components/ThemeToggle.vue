<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

const mode = useColorMode()

function toggleMode() {
  if (mode.value === 'light') {
    mode.value = 'dark'
    return
  }
  if (mode.value === 'dark') {
    mode.value = 'light'
    return
  }
}
</script>

<template>
  <Button variant="outline" @click="toggleMode">
    <Icon icon="radix-icons:moon"
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Icon icon="radix-icons:sun"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  </Button>
</template>