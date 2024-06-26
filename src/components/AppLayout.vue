<script setup lang="ts">
import { menus } from '@/constants/menus';
import { useAuthStore } from '@/stores/authStore';
import { useBreadcrumStore } from '@/stores/breadcrumbStore';
import { Alert32Filled } from '@vicons/fluent';
import { NBreadcrumb, NBreadcrumbItem, NButton, NGradientText, NH1, NIcon, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, NSpace, NTooltip, useLoadingBar } from 'naive-ui';
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const breadcrumStore = useBreadcrumStore();
const loadingBar = useLoadingBar();
const authStore = useAuthStore();

const emit = defineEmits<{
  refresh: []
}>()

const selectedKey = ref(route.meta.menuKey);

const breadcrumbs = computed(() => breadcrumStore.breadcrumbs);

async function logout() {
  try {
    loadingBar.start();
    await authStore.logout();
    router.push({ name: 'LoginPage' })
  } catch (error) {
    loadingBar.error()
  } finally {
    loadingBar.finish()
  }
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <NLayout style="height: 100dvh;">
    <NLayoutHeader
      style="height: 4rem; width: 100dvw; display: flex; align-items: center; padding-left: 2rem; padding-right: 2rem"
      bordered>
      <NSpace align="center" justify="space-between" style="width: 100%">
        <NH1 style="margin: 0;">
          <NGradientText style="font-weight: 700; line-height: 1; letter-spacing: 0.75rem;">
            AFISKA
          </NGradientText>
        </NH1>

        <NSpace align="center">
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary circle type="warning" @click="refresh">
                <template #icon>
                  <NIcon size="24">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"></path>
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                      </g>
                    </svg>
                  </NIcon>
                </template>
              </NButton>
            </template>
            Refresh data
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary circle type="info">
                <NIcon :component="Alert32Filled" size="24" />
              </NButton>
            </template>
            Notifikasi
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary circle type="error" @click="logout">
                <template #icon>
                  <NIcon size="24">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                      <g>
                        <g>
                          <g>
                            <path d="M192,277.4h189.7l-43.6,44.7L368,352l96-96l-96-96l-31,29.9l44.7,44.7H192V277.4z">
                            </path>
                          </g>
                        </g>
                        <g>
                          <path d="M255.7,421.3c-44.1,0-85.5-17.2-116.7-48.4c-31.2-31.2-48.3-72.7-48.3-116.9c0-44.1,17.2-85.7,48.3-116.9
      c31.2-31.2,72.6-48.4,116.7-48.4c44,0,85.3,17.1,116.5,48.2l30.3-30.3c-8.5-8.4-17.8-16.2-27.7-23.2C339.7,61,298.6,48,255.7,48
      C141.2,48,48,141.3,48,256s93.2,208,207.7,208c42.9,0,84-13,119-37.5c10-7,19.2-14.7,27.7-23.2l-30.2-30.2
      C341.1,404.2,299.7,421.3,255.7,421.3z"></path>
                          <rect x="447.4" y="255.4" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 583.767 753.7971)"
                            width="1.2" height="1.2"></rect>
                        </g>
                      </g>
                    </svg>
                  </NIcon>
                </template>
              </NButton>
            </template>
            Keluar
          </NTooltip>
        </NSpace>
      </NSpace>
    </NLayoutHeader>
    <NLayout has-sider position="absolute" style="top: 4rem;">
      <NLayoutSider bordered :native-scrollbar="false">
        <NMenu v-model:value="selectedKey" :options="menus"></NMenu>
      </NLayoutSider>
      <NLayoutContent content-style="padding: 1rem; height: 100dvh; max-height: calc(100dvh - 4rem); overflow: hidden"
        :native-scrollbar="false">
        <NBreadcrumb>
          <NBreadcrumbItem v-for="(breadcrumb, index) in breadcrumbs" :key="index" :clickable="!!breadcrumb.path">
            <RouterLink v-if="breadcrumb.path" :to="breadcrumb.path">{{ breadcrumb.label }}</RouterLink>
            <span v-else>{{ breadcrumb.label }}</span>
          </NBreadcrumbItem>
        </NBreadcrumb>
        <slot />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>