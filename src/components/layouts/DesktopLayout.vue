<script setup lang="ts">
import { generatePageLabel, type PageLabel } from '@/helpers/generate-page-label';
import { DEFAULT_PATH, ROUTE_NAMES, type RouteName } from '@/router/constants';
import routes from '@/router/routes/desktop';
import type { BreadcrumbItem } from '@nuxt/ui';
import { templateRef } from '@vueuse/core';
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRoute, type RouteRecordRaw } from 'vue-router';

const route = useRoute();
const { t } = useI18n();

const breadcrumbLabel = computed<PageLabel>(() => {
  return {
    ...generatePageLabel(t),
  }
})

const sideMenu = templateRef('side-menu');
const isMenuCollapsed = ref(false);

const breadcrumbs = shallowRef<BreadcrumbItem[]>([])

function toggleMenu() {
  isMenuCollapsed.value = !isMenuCollapsed.value;
}

function getMenuIcon(routeName: RouteName) {
  const menuItems = sideMenu.value?.menuItems.flat() || [];
  const currentMenu = menuItems.find((item) => {
    const key = Object.keys(sideMenu.value?.MENU_LABEL || {}).find((key) => sideMenu.value?.MENU_LABEL[key as RouteName] === item.label)
    return key === routeName
  });
  return currentMenu?.icon;
}

function arrangeBreadcrumbs(_routes: RouteRecordRaw,) {
  if (!_routes.children) {
    const routeName = _routes.name as RouteName;

    const existIndex = breadcrumbs.value.findIndex((breadcrumb) => {
      const key = Object.keys(breadcrumbLabel.value).find((key) => breadcrumbLabel.value[key as RouteName] === breadcrumb.label)
      return key === routeName
    });

    if (existIndex === -1) {
      breadcrumbs.value = [...breadcrumbs.value, {
        label: breadcrumbLabel.value[routeName],
        icon: getMenuIcon(routeName),
        to: route.name === routeName ? undefined : { name: routeName }
      }]
    }

    return;
  }

  let routeGroup: RouteRecordRaw | undefined = undefined;

  for (const _route of _routes.children) {
    if (_route.children && _route.children.flat().some((child) => child.name === route.name)) {
      routeGroup = _route;

      const defaultRoute = _route.children
        .find((childRoute) => childRoute.path === DEFAULT_PATH)

      if (defaultRoute && defaultRoute.name) {
        breadcrumbs.value = [...breadcrumbs.value, {
          icon: getMenuIcon(defaultRoute.name as RouteName),
          label: breadcrumbLabel.value[defaultRoute.name as RouteName],
          to: route.name === defaultRoute.name ? undefined : { name: defaultRoute.name }
        }]
      }

      break;
    }

    if (_route.name === route.name) {
      routeGroup = _route
      break;
    }
  }

  if (routeGroup) {
    arrangeBreadcrumbs(routeGroup)
  }

}

watch(
  [sideMenu, () => route.fullPath, breadcrumbLabel],
  () => {
    const [protectedRoutes] = routes.filter((route) => !!route.meta?.requiresAuth)
    breadcrumbs.value = [{
      label: breadcrumbLabel.value[ROUTE_NAMES.DASHBOARD],
      icon: getMenuIcon('Dashboard'),
      to: route.name === ROUTE_NAMES.DASHBOARD ? undefined : { name: ROUTE_NAMES.DASHBOARD }
    }];
    arrangeBreadcrumbs(protectedRoutes)
  },
)
</script>

<template>
  <section
    :class="[
      'w-screen p-4 h-dvh grid grid-rows-12 gap-4',
      {
        'grid-cols-[max-content_1fr]': isMenuCollapsed,
        'grid-cols-[minmax(0,_min(25%,_240px))_1fr] xl:grid-cols-[minmax(0,_min(18%,_240px))_1fr]': !isMenuCollapsed,
      }
    ]"
  >
    <!-- Side Menu -->
    <section
      class="row-span-12 rounded-md bg-elevated/20 ring ring-default grid grid-rows-subgrid overflow-y-auto overflow-x-hidden"
    >
      <section
        class="flex items-center font-black text-2xl sticky top-0 bg-(--ui-bg) z-10 before:absolute before:inset-0 before:bg-elevated/20 before:-z-10 border-b border-b-primary-900/70"
      >
        <div
          v-if="isMenuCollapsed"
          class="flex flex-col items-center w-full"
        >
          <span class="text-primary-500">S</span>
          <span class="text-neutral-400">P</span>
        </div>
        <div
          v-else
          class="px-2.5 text-3xl"
        >
          <span class="text-primary-500">Sewa</span>
          <span class="text-neutral-400">Pesta</span>
        </div>
      </section>
      <SideMenu
        ref="side-menu"
        :collapsed="isMenuCollapsed"
      />
    </section>

    <!-- Header -->
    <section class="row-span-1 flex items-center gap-x-4 bg-elevated/20 rounded-md ring ring-default px-4">
      <UButton
        icon="i-lucide-menu"
        variant="outline"
        color="neutral"
        @click="toggleMenu"
      />
      <section class="flex-1">
        <UBreadcrumb :items="breadcrumbs" />
      </section>
      <section class="flex items-center gap-x-4">
        <LocaleSelect />
        <ThemeSwitch />
        <LogoutButton />
      </section>
    </section>

    <!-- Content -->
    <main
      class="row-span-11 rounded-md min-w-0 bg-elevated/20 ring ring-default [&>*]:h-full [&>*]:w-full [&>*]:overflow-auto"
    >
      <RouterView />
    </main>
  </section>
</template>
