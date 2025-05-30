<script setup lang="ts">
</script>

<template>
  <section class="w-full p-4 pt-0 min-h-dvh space-y-4 transition-all relative">

    <!-- Header -->
    <section class="sticky top-0 py-4 bg-(--ui-bg)">
      <section class="flex items-center justify-between rounded-md p-4 bg-elevated/50">
        <UDrawer direction="left" :ui="{
          content: 'z-50',
          overlay: 'z-50'
        }">
          <UButton icon="i-lucide-menu" variant="outline" color="neutral" />

          <!-- Side Menu -->
          <template #body>
            <section class="overflow-y-auto">
              <SideMenu />
            </section>
          </template>
        </UDrawer>
        <section class="flex items-center gap-x-4">
          <ThemeSwitch />
          <LogoutButton />
        </section>
      </section>
    </section>

    <!-- Content -->
    <main class="flex-1">
      <RouterView />
    </main>
  </section>
</template>
