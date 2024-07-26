<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NLoadingBarProvider, NMessageProvider, NModalProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { idID, dateIdID } from 'naive-ui'
</script>

<template>
  <NConfigProvider :theme="darkTheme" :locale="idID" :date-locale="dateIdID">
    <NMessageProvider>
      <NLoadingBarProvider>
        <NDialogProvider>
          <NModalProvider>
            <RouterView />
          </NModalProvider>
        </NDialogProvider>
      </NLoadingBarProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>