<script setup lang="ts">
import { RoleEnum } from '@/enums/role';

</script>

<template>
  <UserPage :role="RoleEnum.Admin" />
</template>
