<script setup lang="ts">
import LogoutButton from './LogoutButton.vue';
import ThemeToggle from './ThemeToggle.vue';
import SideMenu from './SideMenu.vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumStore } from '@/stores/breadcrumbStore';
import { computed } from 'vue';
import { onMounted } from 'vue';

const breadcrumStore = useBreadcrumStore();

const breadcrumbs = computed(() => breadcrumStore.breadcrumbs);

onMounted(() => {
  const verticalScrollableElement = document.querySelectorAll('.overflow-y-scroll');

  verticalScrollableElement.forEach((element) => {
    element.addEventListener('scroll', () => {
      element.classList.add('scrolled')
    })
    element.addEventListener('scrollend', () => {
      element.classList.remove('scrolled')
    })
  })
})
</script>

<template>
  <section class="w-fulll h-dvh flex items-stretch overflow-hidden">
    <section class="bg-background flex-shrink-0 basis-2/12 border-r border-border overflow-y-scroll relative">
      <section class="bg-background h-16 px-4 flex items-center sticky top-0 border-b border-border">
        <h4 class="text-2xl font-semibold text-primary">SewaPesta</h4>
      </section>
      <section class="pb-6">
        <SideMenu />
      </section>
    </section>
    <section class="bg-background flex-shrink-0 basis-10/12 overflow-y-scroll relative">
      <section class="sticky top-0 bg-background h-16 px-4 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
              <BreadcrumbSeparator v-if="index > 0" />
              <BreadcrumbItem>
                <BreadcrumbLink v-if="breadcrumb.path" as-child>
                  <RouterLink :to="breadcrumb.path">{{ breadcrumb.label }}</RouterLink>
                </BreadcrumbLink>
                <BreadcrumbPage v-else>{{ breadcrumb.label }}</BreadcrumbPage>
              </BreadcrumbItem>
            </template>
          </BreadcrumbList>
        </Breadcrumb>
        <section class="flex items-center gap-x-2">
          <ThemeToggle />
          <LogoutButton />
        </section>
      </section>
      <section class="px-16 pt-4 pb-6" style="min-height: calc(100dvh - 4rem);">

        <slot />
      </section>
    </section>
  </section>
</template>