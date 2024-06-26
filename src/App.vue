<script setup lang="ts">
import { NConfigProvider, NLoadingBarProvider, NMessageProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { idID, dateIdID } from 'naive-ui'
</script>

<template>
  <NConfigProvider :theme="darkTheme" :locale="idID" :date-locale="dateIdID">
    <NMessageProvider>
      <NLoadingBarProvider>
        <RouterView />
      </NLoadingBarProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
